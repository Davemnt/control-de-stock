import React, { createContext, useContext, useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";
import { ROLES, COLLECTIONS } from "../constants";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [sessionId] = useState(() => Date.now().toString());

  // Get user data from Firestore
  const getUserData = async (uid, email = null) => {
    try {
      const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        // Guardar info del usuario en localStorage
        localStorage.setItem(
          "currentUser",
          JSON.stringify({
            uid,
            email: userData.email,
          })
        );
        return userData;
      }
      return null;
    } catch (error) {
      console.error("Error getting user data:", error);
      return null;
    }
  };

  // Sign in
  const login = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const data = await getUserData(result.user.uid, email);

      if (!data) {
        throw new Error("Usuario no encontrado en la base de datos");
      }

      if (data.active === false) {
        await signOut(auth);
        throw new Error("Usuario desactivado");
      }

      setUserData(data);

      toast.success(`Bienvenido, ${data.name}`);
      return result;
    } catch (error) {
      let message = "Error al iniciar sesión";

      if (error.code === "auth/user-not-found") {
        message = "Usuario no encontrado";
      } else if (
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-credential"
      ) {
        message = "Contraseña incorrecta";
      } else if (error.code === "auth/invalid-email") {
        message = "Email inválido";
      } else if (error.message) {
        message = error.message;
      }

      toast.error(message);
      throw error;
    }
  };

  // Sign out
  const logout = async () => {
    try {
      await signOut(auth);
      setUserData(null);
      // Limpiar localStorage
      localStorage.removeItem("currentUser");
      toast.success("Sesión cerrada");
    } catch (error) {
      toast.error("Error al cerrar sesión");
      throw error;
    }
  };

  // Register new user (admin only)
  const register = async (email, password, userData) => {
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Create user document in Firestore
      await setDoc(doc(db, COLLECTIONS.USERS, result.user.uid), {
        ...userData,
        uid: result.user.uid,
        email: email.toLowerCase(),
        active: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      toast.success("Usuario creado exitosamente");
      return result;
    } catch (error) {
      let message = "Error al crear usuario";

      if (error.code === "auth/email-already-in-use") {
        message = "El email ya está en uso";
      } else if (error.code === "auth/weak-password") {
        message = "La contraseña es muy débil";
      } else if (error.code === "auth/invalid-email") {
        message = "Email inválido";
      }

      toast.error(message);
      throw error;
    }
  };

  // Sistema de cierre automático de sesión al cerrar navegador
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Marcar que la ventana se está cerrando
      sessionStorage.setItem("windowClosing", "true");
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        // La pestaña se oculta, puede ser que se esté cerrando
        sessionStorage.setItem("tabHidden", Date.now().toString());
      } else if (document.visibilityState === "visible") {
        // La pestaña vuelve a estar visible
        const hiddenTime = sessionStorage.getItem("tabHidden");
        if (hiddenTime) {
          const timeHidden = Date.now() - parseInt(hiddenTime);
          // Si estuvo oculta más de 30 segundos, cerrar sesión
          if (timeHidden > 30000 && currentUser) {
            logout();
            toast.error("Sesión cerrada por inactividad");
          }
        }
        sessionStorage.removeItem("tabHidden");
      }
    };

    // Verificar si es una nueva sesión del navegador
    const checkBrowserSession = () => {
      const lastSessionId = sessionStorage.getItem("currentSessionId");
      if (!lastSessionId || lastSessionId !== sessionId) {
        // Nueva sesión del navegador - cerrar sesión anterior
        if (currentUser) {
          logout();
        }
        sessionStorage.setItem("currentSessionId", sessionId);
      }
    };

    // Ejecutar verificación al cargar
    checkBrowserSession();

    // Event listeners
    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [currentUser, sessionId]);

  // Listen to auth state changes
  useEffect(() => {
    let unsubscribe;

    try {
      unsubscribe = onAuthStateChanged(auth, async (user) => {
        try {
          setCurrentUser(user);

          if (user) {
            const data = await getUserData(user.uid, user.email);
            setUserData(data);

            // Registrar sesión activa para múltiples usuarios
            const userSession = {
              uid: user.uid,
              email: user.email,
              sessionId,
              timestamp: Date.now(),
              userAgent: navigator.userAgent,
            };
            localStorage.setItem(
              "activeUserSession",
              JSON.stringify(userSession)
            );
          } else {
            setUserData(null);
            localStorage.removeItem("currentUser");
            localStorage.removeItem("activeUserSession");
          }

          setAuthError(null);
        } catch (error) {
          console.error("Error en onAuthStateChanged:", error);
          setAuthError(error.message);
          toast.error("Error de autenticación: " + error.message);
        }

        setLoading(false);
      });
    } catch (error) {
      console.error("Error al inicializar Firebase Auth:", error);
      setAuthError(error.message);
      setLoading(false);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [sessionId]);

  const value = {
    currentUser,
    userData,
    loading,
    login,
    logout,
    register,
    isAdmin: userData?.role === ROLES.ADMIN,
    isEmployee: userData?.role === ROLES.EMPLOYEE,
    isUser: userData?.role === ROLES.USER,
    isGuest: userData?.role === ROLES.GUEST,
  };

  // Si hay error de autenticación, mostrar mensaje
  if (authError) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          padding: "20px",
          backgroundColor: "#f5f5f5",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "30px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            textAlign: "center",
            maxWidth: "400px",
          }}
        >
          <h2 style={{ color: "#d32f2f", marginBottom: "20px" }}>
            ❌ Error de Firebase
          </h2>
          <p style={{ marginBottom: "15px" }}>Error de autenticación:</p>
          <code
            style={{
              display: "block",
              background: "#f5f5f5",
              padding: "10px",
              borderRadius: "4px",
              fontSize: "12px",
              marginBottom: "20px",
            }}
          >
            {authError}
          </code>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: "#1976d2",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Recargar
          </button>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
