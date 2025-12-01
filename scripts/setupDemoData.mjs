import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  setDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno DEMO
dotenv.config({ path: resolve(__dirname, "../.env.demo") });

// Configuración Firebase DEMO
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

console.log("🔥 Conectando a proyecto DEMO:", firebaseConfig.projectId);

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Usuario demo predeterminado (Employee role)
const DEMO_USER = {
  email: "demo@demo.com",
  password: "demo123",
  name: "Empleado Demo",
  role: "employee",
};

// Materiales de ejemplo
const DEMO_MATERIALS = [
  {
    name: "Consola Digital X32",
    code: "AUD-001",
    category: "audio",
    subcategory: "Consolas",
    quantity: 2,
    quantityCommitted: 0,
    quantityMaintenance: 0,
    location: "Depósito Audio",
    status: "operativo",
    notes: "Consola digital 32 canales con flightcase",
    imageUrl: "",
    imagePath: "",
  },
  {
    name: "Moving Head LED 150W",
    code: "ILU-001",
    category: "iluminacion",
    subcategory: "Cabezas Móviles",
    quantity: 8,
    quantityCommitted: 4,
    quantityMaintenance: 0,
    location: "Depósito Iluminación",
    status: "operativo",
    notes: "Cabezas móviles LED 150W con estuche",
  },
  {
    name: "Proyector 10.000 Lúmenes",
    code: "VID-001",
    category: "video",
    subcategory: "Proyectores",
    quantity: 3,
    quantityCommitted: 1,
    quantityMaintenance: 0,
    location: "Depósito Video",
    status: "operativo",
    notes: "Proyector Full HD 10.000 lúmenes",
  },
  {
    name: "Truss Cuadrado 2m",
    code: "EST-001",
    category: "estructuras",
    subcategory: "Truss",
    quantity: 20,
    quantityCommitted: 8,
    quantityMaintenance: 2,
    location: "Depósito Estructuras",
    status: "operativo",
    notes: "Truss cuadrado de aluminio 290x290mm",
  },
  {
    name: "Cable DMX XLR 10m",
    code: "CAB-001",
    category: "cables",
    subcategory: "DMX",
    quantity: 30,
    quantityCommitted: 15,
    quantityMaintenance: 0,
    location: "Depósito Cables",
    status: "operativo",
    notes: "Cable DMX profesional 3 pines",
  },
  {
    name: "Mochila Técnica Grande",
    code: "MOC-001",
    category: "mochilas",
    subcategory: "Transporte",
    quantity: 5,
    quantityCommitted: 2,
    quantityMaintenance: 0,
    location: "Depósito Principal",
    status: "operativo",
    notes: "Mochila para transporte de equipos",
  },
  {
    name: "Motor Chain Hoist 500kg",
    code: "RIG-001",
    category: "rigging",
    subcategory: "Motores",
    quantity: 6,
    quantityCommitted: 4,
    quantityMaintenance: 1,
    location: "Depósito Rigging",
    status: "operativo",
    notes: "Motor eléctrico para elevación",
  },
  {
    name: "Repuesto Foco Par LED",
    code: "REP-001",
    category: "repuestos",
    subcategory: "Iluminación",
    quantity: 15,
    quantityCommitted: 0,
    quantityMaintenance: 0,
    location: "Depósito Repuestos",
    status: "operativo",
    notes: "Repuestos para focos PAR LED",
  },
  {
    name: 'Parlante Activo 15" 1000W',
    code: "AUD-002",
    category: "audio",
    subcategory: "Parlantes",
    quantity: 10,
    quantityCommitted: 6,
    quantityMaintenance: 1,
    location: "Depósito Audio",
    status: "operativo",
    notes: "Parlante activo profesional",
  },
  {
    name: "Par LED 18x10W RGBW",
    code: "ILU-002",
    category: "iluminacion",
    subcategory: "PAR LED",
    quantity: 24,
    quantityCommitted: 12,
    quantityMaintenance: 0,
    location: "Depósito Iluminación",
    status: "operativo",
    notes: "Foco PAR LED 18x10W RGBW",
  },
  {
    name: "Pantalla LED P3.9 50x50cm",
    code: "VID-002",
    category: "video",
    subcategory: "Pantallas LED",
    quantity: 16,
    quantityCommitted: 8,
    quantityMaintenance: 0,
    location: "Depósito Video",
    status: "operativo",
    notes: "Panel LED indoor P3.9",
  },
  {
    name: "Base de Truss",
    code: "EST-002",
    category: "estructuras",
    subcategory: "Bases",
    quantity: 8,
    quantityCommitted: 4,
    quantityMaintenance: 0,
    location: "Depósito Estructuras",
    status: "operativo",
    notes: "Base cuadrada para truss con placas",
  },
];

async function setupDemoData() {
  try {
    console.log("📦 Iniciando configuración de datos DEMO...\n");

    // 1. Crear usuario demo
    console.log("👤 Creando usuario demo...");
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        DEMO_USER.email,
        DEMO_USER.password
      );

      const uid = userCredential.user.uid;

      // Crear documento de usuario en Firestore
      await setDoc(doc(db, "users", uid), {
        name: DEMO_USER.name,
        email: DEMO_USER.email,
        role: DEMO_USER.role,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log("✅ Usuario demo creado:", DEMO_USER.email);
      console.log("   UID:", uid);
      console.log("   Rol:", DEMO_USER.role);
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        console.log("⚠️  Usuario demo ya existe, actualizando rol...");

        // Iniciar sesión para obtener el UID
        try {
          const userCredential = await signInWithEmailAndPassword(
            auth,
            DEMO_USER.email,
            DEMO_USER.password
          );

          const uid = userCredential.user.uid;
          console.log("   📄 Usuario encontrado, UID:", uid);

          // Actualizar/crear documento en Firestore
          await setDoc(doc(db, "users", uid), {
            name: DEMO_USER.name,
            email: DEMO_USER.email,
            role: DEMO_USER.role,
            active: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          });

          console.log("   ✅ Rol actualizado a:", DEMO_USER.role);
        } catch (signInError) {
          console.error("   ❌ Error al iniciar sesión:", signInError.message);
        }
      } else {
        throw error;
      }
    } // 2. Crear materiales de ejemplo
    console.log("\n📦 Creando materiales de ejemplo...");
    const materialsRef = collection(db, "materials");

    let createdCount = 0;
    for (const material of DEMO_MATERIALS) {
      try {
        const materialData = {
          ...material,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: "demo-user",
          createdByName: "Usuario Demo",
        };

        await addDoc(materialsRef, materialData);
        createdCount++;
        console.log(`   ✓ ${material.name} (${material.code})`);
      } catch (error) {
        console.error(`   ✗ Error creando ${material.name}:`, error.message);
      }
    }

    console.log(
      `\n✅ ${createdCount}/${DEMO_MATERIALS.length} materiales creados exitosamente`
    );

    console.log("\n🎉 ¡Configuración DEMO completada!");
    console.log("\n📋 Credenciales de acceso:");
    console.log("   Email:", DEMO_USER.email);
    console.log("   Password:", DEMO_USER.password);
    console.log("\n🌐 Proyecto Firebase:", firebaseConfig.projectId);
  } catch (error) {
    console.error("❌ Error en configuración:", error);
    throw error;
  } finally {
    process.exit(0);
  }
}

// Ejecutar
setupDemoData();
