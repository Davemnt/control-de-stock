#!/usr/bin/env node

import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
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

// Verificar que tenemos la configuración
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error("❌ Error: Configuración de Firebase incompleta");
  console.log(
    "Verifica que el archivo .env tenga todas las variables necesarias"
  );
  process.exit(1);
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function createDemoUser() {
  try {
    console.log("👤 Creando usuario demo...");

    const demoEmail = "demo@demo.com";
    const demoPassword = "demo123";

    // Crear usuario en Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      demoEmail,
      demoPassword
    );
    const user = userCredential.user;

    console.log("✅ Usuario creado en Authentication:", user.uid);

    // Crear documento de usuario en Firestore
    const userData = {
      uid: user.uid,
      email: demoEmail.toLowerCase(),
      name: "Usuario Demo",
      role: "admin",
      active: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: "system",
      department: "Demostración",
    };

    await setDoc(doc(db, "users", user.uid), userData);

    console.log("✅ Documento de usuario creado en Firestore");
    console.log("📧 Email:", demoEmail);
    console.log("🔑 Password:", demoPassword);
    console.log("👑 Role: admin");
    console.log("");
    console.log("🎉 ¡Usuario demo creado exitosamente!");
    console.log("Ahora puedes usar estas credenciales para iniciar sesión.");
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      console.log("ℹ️  El usuario demo ya existe");
      console.log("📧 Email: demo@demo.com");
      console.log("🔑 Password: demo123");
    } else {
      console.error("❌ Error creando usuario demo:", error.message);
      console.error("Código de error:", error.code);
    }
  }
}

// Ejecutar la función
createDemoUser()
  .then(() => {
    console.log("✨ Proceso completado");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error fatal:", error);
    process.exit(1);
  });
