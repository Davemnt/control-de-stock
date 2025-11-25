#!/usr/bin/env node

import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import dotenv from "dotenv";

// Cargar variables de entorno
dotenv.config();

// Configuración de Firebase
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

async function cleanDemoData() {
  try {
    console.log("🔐 Iniciando sesión como usuario demo...");

    const demoEmail = "demo@demo.com";
    const demoPassword = "demo123";

    // Iniciar sesión con el usuario demo
    await signInWithEmailAndPassword(auth, demoEmail, demoPassword);

    console.log("✅ Sesión iniciada");
    console.log("🧹 Limpiando materiales demo duplicados...");

    // Obtener todos los materiales demo
    const materialsSnapshot = await getDocs(collection(db, "demo_materials"));

    console.log(`📦 Encontrados ${materialsSnapshot.size} materiales`);

    // Eliminar todos
    let deleted = 0;
    for (const docSnapshot of materialsSnapshot.docs) {
      await deleteDoc(doc(db, "demo_materials", docSnapshot.id));
      deleted++;
      console.log(
        `  ✅ Eliminado material ${deleted}/${materialsSnapshot.size}`
      );
    }

    console.log("");
    console.log("🎉 ¡Limpieza completada!");
    console.log(`📊 Se eliminaron ${deleted} materiales duplicados`);
    console.log(
      "Ahora puedes volver a crear datos demo limpios con createDemoData.mjs"
    );
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error("Código de error:", error.code);
  }
}

// Ejecutar la función
cleanDemoData()
  .then(() => {
    console.log("✨ Proceso completado");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error fatal:", error);
    process.exit(1);
  });
