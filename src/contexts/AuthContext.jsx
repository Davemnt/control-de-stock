import React, { createContext, useContext, useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";
import { ROLES, COLLECTIONS, getCollection } from "../constants";
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

  // Get user data from Firestore
  const getUserData = async (uid, email = null) => {
    try {
      // Para usuario demo, usar colección separada
      const isDemo = email === "demo@demo.com";
      const collectionName = isDemo ? "demo_users" : COLLECTIONS.USERS;

      const userDoc = await getDoc(doc(db, collectionName, uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        // Guardar info del usuario en localStorage para separar colecciones
        localStorage.setItem(
          "currentUser",
          JSON.stringify({
            uid,
            email: userData.email,
            isDemo,
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

      if (!data.active) {
        await signOut(auth);
        throw new Error("Usuario desactivado");
      }

      setUserData(data);

      // Mostrar mensaje diferente para demo
      const isDemoUser = email === "demo@demo.com";
      const welcomeMessage = isDemoUser
        ? `Bienvenido al DEMO, ${data.name}`
        : `Bienvenido, ${data.name}`;

      toast.success(welcomeMessage);
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
      const isDemo = email === "demo@demo.com";
      const collectionName = isDemo ? "demo_users" : COLLECTIONS.USERS;

      await setDoc(doc(db, collectionName, result.user.uid), {
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

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        const data = await getUserData(user.uid, user.email);
        setUserData(data);
      } else {
        setUserData(null);
        localStorage.removeItem("currentUser");
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userData,
    loading,
    login,
    logout,
    register,
    isAdmin: userData?.role === ROLES.ADMIN,
    isUser: userData?.role === ROLES.USER,
    isGuest: userData?.role === ROLES.GUEST,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
