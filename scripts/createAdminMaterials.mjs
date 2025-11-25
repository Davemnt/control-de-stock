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
import readline from "readline";

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

// Datos de ejemplo para materiales (más variados y profesionales)
const exampleMaterials = [
  {
    name: "Consola Digital Yamaha LS9-32",
    code: "CON-YAM-LS9-001",
    category: "audio",
    subcategory: "Consolas Digitales",
    quantity: 2,
    quantityCommitted: 1,
    quantityMaintenance: 0,
    location: "Sala de Audio",
    status: "operativo",
    notes: "Consola digital 32 canales con rack de stage",
  },
  {
    name: "Moving Head LED Wash 19x15W",
    code: "LUZ-MHL-019-002",
    category: "iluminacion",
    subcategory: "Moving Heads",
    quantity: 12,
    quantityCommitted: 8,
    quantityMaintenance: 1,
    location: "Depósito Iluminación",
    status: "operativo",
    notes: "Moving heads RGBW zoom 8-60°",
  },
  {
    name: "Pantalla LED P3.9 Indoor 500x500mm",
    code: "LED-P39-500-003",
    category: "video",
    subcategory: "Pantallas LED",
    quantity: 24,
    quantityCommitted: 24,
    quantityMaintenance: 0,
    location: "Depósito Video",
    status: "prestado",
    notes: "Módulos para pantalla 3x4m",
  },
  {
    name: 'Altavoz Line Array 12" + 1.4"',
    code: "AUD-LIN-012-004",
    category: "audio",
    subcategory: "Line Array",
    quantity: 16,
    quantityCommitted: 12,
    quantityMaintenance: 0,
    location: "Sala de Audio",
    status: "operativo",
    notes: "Sistema line array biamplificado",
  },
  {
    name: "Truss Triangular 290mm 2m",
    code: "TRU-TRI-290-005",
    category: "estructuras",
    subcategory: "Truss Triangular",
    quantity: 40,
    quantityCommitted: 28,
    quantityMaintenance: 2,
    location: "Depósito Estructuras",
    status: "operativo",
    notes: "Truss triangular compatible con sistema global",
  },
  {
    name: "Cámara PTZ 4K 20x Zoom",
    code: "CAM-PTZ-4K20-006",
    category: "video",
    subcategory: "Cámaras PTZ",
    quantity: 4,
    quantityCommitted: 2,
    quantityMaintenance: 0,
    location: "Depósito Video",
    status: "operativo",
    notes: "Cámaras PTZ con control NDI",
  },
  {
    name: "Splitter DMX 8 salidas",
    code: "DMX-SPL-008-007",
    category: "iluminacion",
    subcategory: "Control DMX",
    quantity: 6,
    quantityCommitted: 4,
    quantityMaintenance: 0,
    location: "Depósito Iluminación",
    status: "operativo",
    notes: "Splitter DMX con opto-aislamiento",
  },
  {
    name: 'Subwoofer Doble 18" 3600W',
    code: "AUD-SUB-218-008",
    category: "audio",
    subcategory: "Subwoofers",
    quantity: 8,
    quantityCommitted: 6,
    quantityMaintenance: 1,
    location: "Sala de Audio",
    status: "operativo",
    notes: "Subwoofers cardioide para graves",
  },
  {
    name: "Mezclador de Video 4K 12 entradas",
    code: "VID-MIX-4K12-009",
    category: "video",
    subcategory: "Mezcladoras",
    quantity: 1,
    quantityCommitted: 1,
    quantityMaintenance: 0,
    location: "Depósito Video",
    status: "prestado",
    notes: "Mezclador con streaming integrado",
  },
  {
    name: "Cable Multipar 32ch 50m",
    code: "CAB-MUL-32-010",
    category: "cables",
    subcategory: "Multipares",
    quantity: 10,
    quantityCommitted: 6,
    quantityMaintenance: 0,
    location: "Sala de Audio",
    status: "operativo",
    notes: "Multipar 32 canales con conectores",
  },
];

async function createAdminMaterials() {
  try {
    console.log("🔧 Configurando Firebase...");
    console.log("Project ID:", firebaseConfig.projectId);
    console.log("");
    console.log("📝 Creación de Materiales de Ejemplo para Administrador");
    console.log("=====================================================");
    console.log("");

    // Pedir credenciales del administrador
    const email = await askQuestion("📧 Email del administrador: ");
    const password = await askQuestion("🔑 Contraseña: ");

    console.log("");
    console.log("🔐 Iniciando sesión...");

    // Iniciar sesión
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    console.log("✅ Sesión iniciada, UID:", user.uid);
    console.log("📦 Creando materiales de ejemplo...");
    console.log("");

    // Crear materiales
    let created = 0;
    for (const material of exampleMaterials) {
      const materialData = {
        ...material,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: user.uid,
        createdByName: "Administrador",
      };

      await addDoc(collection(db, "materials"), materialData);
      created++;
      console.log(
        `  ✅ [${created}/${exampleMaterials.length}] ${material.name}`
      );
    }

    console.log("");
    console.log("🎉 ¡Materiales creados exitosamente!");
    console.log("===============================================");
    console.log(`📊 Se crearon ${created} materiales de ejemplo`);
    console.log("");
    console.log("📋 Categorías incluidas:");
    console.log("  • Audio (consolas, line array, subwoofers)");
    console.log("  • Iluminación (moving heads, control DMX)");
    console.log("  • Video (cámaras, pantallas LED, mezcladoras)");
    console.log("  • Estructuras (truss triangular)");
    console.log("  • Cables (multipares)");
    console.log("");
    console.log("✨ Los materiales están listos para usar, editar y gestionar");
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error("Código de error:", error.code);

    if (
      error.code === "auth/user-not-found" ||
      error.code === "auth/wrong-password" ||
      error.code === "auth/invalid-credential"
    ) {
      console.log(
        "ℹ️  Credenciales incorrectas, verifica el email y contraseña"
      );
    }
  } finally {
    rl.close();
  }
}

// Ejecutar la función
createAdminMaterials()
  .then(() => {
    console.log("✨ Proceso completado");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error fatal:", error);
    process.exit(1);
  });
