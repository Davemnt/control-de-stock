import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { ROLES, COLLECTIONS } from "../constants";
import { hasPermission } from "../utils/permissions";
import Loader from "../components/Loader/Loader";
import toast from "react-hot-toast";

// Minutos sin actividad antes de cerrar la sesión automáticamente
const INACTIVITY_MINUTES = 30;

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

const AUTH_ERRORS = {
  "auth/invalid-credential": "Email o contraseña incorrectos",
  "auth/wrong-password": "Email o contraseña incorrectos",
  "auth/user-not-found": "Email o contraseña incorrectos",
  "auth/invalid-email": "El email no es válido",
  "auth/user-disabled": "Esta cuenta está deshabilitada",
  "auth/too-many-requests": "Demasiados intentos. Espera unos minutos e inténtalo de nuevo",
  "auth/network-request-failed": "Sin conexión. Revisa tu red e inténtalo de nuevo",
};

export const getAuthErrorMessage = (error, fallback = "Error al iniciar sesión") =>
  AUTH_ERRORS[error?.code] || error?.message || fallback;

/** Lee el perfil del usuario y valida que exista y esté activo. */
const fetchProfile = async (user) => {
  const snap = await getDoc(doc(db, COLLECTIONS.USERS, user.uid));
  if (!snap.exists()) {
    throw new Error("Tu cuenta no tiene un perfil asignado. Contacta al administrador.");
  }
  const data = { ...snap.data(), uid: user.uid };
  if (data.active === false) {
    throw new Error("Tu usuario está desactivado. Contacta al administrador.");
  }
  return data;
};

/**
 * Las reglas de Firestore permiten que el primer usuario cree su propio perfil
 * sólo mientras no exista system/bootstrap. En cuanto un admin entra, se crea
 * ese documento y la puerta queda cerrada.
 */
const closeBootstrap = async (profile) => {
  if (profile.role !== ROLES.ADMIN) return;
  try {
    const ref = doc(db, "system", "bootstrap");
    if (!(await getDoc(ref)).exists()) {
      await setDoc(ref, { closedAt: serverTimestamp(), closedBy: profile.uid });
    }
  } catch (error) {
    console.warn("No se pudo cerrar el bootstrap:", error);
  }
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const loginInProgress = useRef(false);

  // Escucha cambios de sesión (incluye recarga de página)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setCurrentUser(null);
        setUserData(null);
        setLoading(false);
        return;
      }

      // login() valida el perfil por su cuenta y muestra el error en el formulario
      if (loginInProgress.current) return;

      try {
        const profile = await fetchProfile(user);
        setUserData(profile);
        setCurrentUser(user);
        closeBootstrap(profile);
      } catch (error) {
        console.error("Perfil inválido:", error);
        toast.error(error.message);
        await signOut(auth);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    loginInProgress.current = true;
    try {
      const result = await signInWithEmailAndPassword(auth, email.trim(), password);
      let profile;
      try {
        profile = await fetchProfile(result.user);
      } catch (error) {
        await signOut(auth);
        throw error;
      }
      setUserData(profile);
      setCurrentUser(result.user);
      closeBootstrap(profile);
      toast.success(`Bienvenido, ${profile.name || "usuario"}`);
      return result;
    } catch (error) {
      throw new Error(getAuthErrorMessage(error));
    } finally {
      loginInProgress.current = false;
    }
  };

  const logout = useCallback(async (message = "Sesión cerrada") => {
    try {
      await signOut(auth);
      setUserData(null);
      setCurrentUser(null);
      if (message) toast.success(message);
    } catch (error) {
      toast.error("Error al cerrar sesión");
      throw error;
    }
  }, []);

  const resetPassword = (email) => sendPasswordResetEmail(auth, email.trim());

  const refreshUserData = async () => {
    if (!auth.currentUser) return;
    const profile = await fetchProfile(auth.currentUser);
    setUserData(profile);
  };

  // Cierre de sesión por inactividad
  useEffect(() => {
    if (!currentUser) return undefined;

    let lastActivity = Date.now();
    const markActivity = () => {
      lastActivity = Date.now();
    };
    const events = ["mousedown", "keydown", "touchstart", "scroll", "visibilitychange"];
    events.forEach((evt) => window.addEventListener(evt, markActivity, { passive: true }));

    const interval = setInterval(() => {
      if (Date.now() - lastActivity > INACTIVITY_MINUTES * 60 * 1000) {
        logout("Sesión cerrada por inactividad");
      }
    }, 60 * 1000);

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, markActivity));
      clearInterval(interval);
    };
  }, [currentUser, logout]);

  const role = userData?.role;
  const value = {
    currentUser,
    userData,
    loading,
    login,
    logout,
    resetPassword,
    refreshUserData,
    role,
    can: (permission) => hasPermission(role, permission),
    isAdmin: role === ROLES.ADMIN,
    isEmployee: role === ROLES.EMPLOYEE,
    isUser: role === ROLES.USER,
    isGuest: role === ROLES.GUEST,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <Loader fullScreen text="Iniciando..." /> : children}
    </AuthContext.Provider>
  );
};
