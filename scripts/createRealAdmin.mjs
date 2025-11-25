#!/usr/bin/env node

import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";
import dotenv from "dotenv";
import readline from "readline";

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

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Interfaz para input del usuario
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function createRealAdmin() {
  try {
    console.log("🔧 Configurando Firebase...");
    console.log("Project ID:", firebaseConfig.projectId);
    console.log("");
    console.log("📝 Creación de Usuario Administrador Real");
    console.log("=====================================");
    console.log("");

    // Pedir datos del administrador
    const email = await askQuestion("📧 Email del administrador: ");
    const password = await askQuestion("🔑 Contraseña (mínimo 6 caracteres): ");
    const name = await askQuestion("👤 Nombre completo: ");
    const department =
      (await askQuestion("🏢 Departamento/Área (opcional): ")) ||
      "Administración";

    console.log("");
    console.log("👤 Creando usuario administrador...");

    // Crear usuario en Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    console.log("✅ Usuario creado en Authentication:", user.uid);

    // Crear documento de usuario en Firestore (colección normal, no demo)
    const userData = {
      uid: user.uid,
      email: email.toLowerCase(),
      name: name,
      role: "admin",
      active: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: "system",
      department: department,
    };

    console.log("📝 Creando documento de usuario en Firestore (users)...");
    await setDoc(doc(db, "users", user.uid), userData);

    console.log("");
    console.log("🎉 ¡Usuario administrador creado exitosamente!");
    console.log("===============================================");
    console.log("📧 Email:", email);
    console.log("👑 Role: admin");
    console.log("👤 Nombre:", name);
    console.log("🏢 Departamento:", department);
    console.log("");
    console.log("📊 Este usuario tendrá acceso a:");
    console.log("  ✅ Gestión completa de materiales");
    console.log("  ✅ Creación y edición de usuarios");
    console.log("  ✅ Reportes y exportaciones");
    console.log("  ✅ Configuración del sistema");
    console.log("");
    console.log("🔒 Los datos están completamente separados del usuario demo");
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error("Código de error:", error.code);

    if (error.code === "auth/email-already-in-use") {
      console.log("ℹ️  El email ya está en uso, intenta con otro email");
    } else if (error.code === "auth/weak-password") {
      console.log("ℹ️  La contraseña es muy débil, usa al menos 6 caracteres");
    } else if (error.code === "auth/invalid-email") {
      console.log("ℹ️  El email no es válido, verifica el formato");
    }
  } finally {
    rl.close();
  }
}

// Ejecutar la función
createRealAdmin()
  .then(() => {
    console.log("✨ Proceso completado");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error fatal:", error);
    process.exit(1);
  });
