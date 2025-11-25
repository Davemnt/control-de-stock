#!/usr/bin/env node

import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
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

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Datos demo para materiales
const demoMaterials = [
  {
    name: "Cámara Sony A7R IV",
    code: "CAM-A7R4-001",
    category: "video",
    subcategory: "Cámaras",
    quantity: 5,
    quantityCommitted: 2,
    quantityMaintenance: 0,
    location: "Depósito Principal",
    status: "operativo",
    observations: "Cámaras profesionales para eventos",
  },
  {
    name: "Lente Canon 24-70mm",
    code: "LEN-C2470-002",
    category: "video",
    subcategory: "Lentes",
    quantity: 8,
    quantityCommitted: 3,
    quantityMaintenance: 1,
    location: "Depósito Principal",
    status: "operativo",
    observations: "Lentes versátiles para diferentes situaciones",
  },
  {
    name: "Micrófono Shure SM58",
    code: "MIC-SM58-003",
    category: "audio",
    subcategory: "Micrófonos",
    quantity: 15,
    quantityCommitted: 8,
    quantityMaintenance: 2,
    location: "Sala de Audio",
    status: "operativo",
    observations: "Micrófonos dinámicos para voces",
  },
  {
    name: "Truss Cuadrado 2m",
    code: "TRU-CUA-004",
    category: "estructuras",
    subcategory: "Truss",
    quantity: 20,
    quantityCommitted: 12,
    quantityMaintenance: 0,
    location: "Depósito Estructuras",
    status: "operativo",
    observations: "Estructuras modulares para montajes",
  },
  {
    name: "LED Par 64 RGBW",
    code: "LED-P64-005",
    category: "iluminacion",
    subcategory: "LED",
    quantity: 30,
    quantityCommitted: 18,
    quantityMaintenance: 3,
    location: "Sala de Iluminación",
    status: "operativo",
    observations: "Luminarias LED para espectáculos",
  },
];

async function createDemoData() {
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
    console.log("📦 Creando materiales demo...");

    // Crear materiales demo
    for (const material of demoMaterials) {
      const materialData = {
        ...material,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: user.uid,
        createdByName: "Usuario Demo",
      };

      await addDoc(collection(db, "demo_materials"), materialData);
      console.log(`✅ Material creado: ${material.name}`);
    }

    console.log("");
    console.log("🎉 ¡Datos demo creados exitosamente!");
    console.log(`📊 Se crearon ${demoMaterials.length} materiales de ejemplo`);
    console.log(
      "Ahora el usuario demo tendrá datos para explorar la aplicación."
    );
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error("Código de error:", error.code);
  }
}

// Ejecutar la función
createDemoData()
  .then(() => {
    console.log("✨ Proceso completado");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error fatal:", error);
    process.exit(1);
  });
