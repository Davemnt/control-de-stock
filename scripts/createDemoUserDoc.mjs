#!/usr/bin/env node

import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";
import dotenv from "dotenv";

// Cargar variables de entorno
dotenv.config();

// Configuración de Firebase usando las variables de entorno de Vite
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

console.log("🔧 Configurando Firebase...");
console.log("Project ID:", firebaseConfig.projectId);

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function createDemoUserDoc() {
  try {
    console.log("🔐 Iniciando sesión como usuario demo...");

    const demoEmail = "demo@demo.com";
    const demoPassword = "demo123";

    // Iniciar sesión con el usuario demo
    const userCredential = await signInWithEmailAndPassword(
      auth,
      demoEmail,
      demoPassword
    );
    const user = userCredential.user;

    console.log("✅ Sesión iniciada, UID:", user.uid);

    // Crear documento de usuario en Firestore
    const userData = {
      uid: user.uid,
      email: demoEmail.toLowerCase(),
      name: "Usuario Demo",
      role: "guest",
      active: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: "system",
      department: "Demostración",
    };

    console.log("📝 Creando documento de usuario en Firestore (demo_users)...");
    await setDoc(doc(db, "demo_users", user.uid), userData);

    console.log("✅ Documento de usuario creado exitosamente en Firestore");
    console.log("📧 Email:", demoEmail);
    console.log("🔑 Password:", demoPassword);
    console.log("👁️  Role: guest (acceso limitado solo lectura)");
    console.log("");
    console.log("🎉 ¡Usuario demo configurado completamente!");
    console.log(
      "Ahora puedes usar estas credenciales para iniciar sesión en la app."
    );
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error("Código de error:", error.code);

    if (
      error.code === "auth/user-not-found" ||
      error.code === "auth/wrong-password"
    ) {
      console.log(
        "ℹ️  Las credenciales no son correctas o el usuario no existe"
      );
      console.log("Verifica que el usuario demo se haya creado correctamente");
    }
  }
}

// Ejecutar la función
createDemoUserDoc()
  .then(() => {
    console.log("✨ Proceso completado");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error fatal:", error);
    process.exit(1);
  });
