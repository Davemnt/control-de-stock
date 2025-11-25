import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
} from "firebase/firestore";
import * as readline from "readline";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Leer .env manualmente sin dotenv
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, "..", ".env");
const envFile = readFileSync(envPath, "utf8");

const env = {};
envFile.split("\n").forEach((line) => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith("#")) {
    const [key, ...valueParts] = trimmed.split("=");
    if (key && valueParts.length > 0) {
      env[key.trim()] = valueParts.join("=").trim();
    }
  }
});

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Datos de ejemplo para materiales
const materialesEjemplo = [
  {
    name: "Consola Digital Yamaha QL5",
    code: "AUD-001",
    category: "Audio",
    subcategory: "Consolas Digitales",
    quantity: 3,
    quantityCommitted: 1,
    quantityMaintenance: 0,
    location: "Depósito Principal",
    status: "operativo",
    notes: "Consola profesional 64 canales, incluye stage box",
  },
  {
    name: "Micrófono Shure SM58",
    code: "AUD-002",
    category: "Audio",
    subcategory: "Micrófonos",
    quantity: 25,
    quantityCommitted: 10,
    quantityMaintenance: 2,
    location: "Depósito Principal",
    status: "operativo",
    notes: "Micrófonos dinámicos cardio para voces",
  },
  {
    name: "Moving Head Robe Robin 600",
    code: "LUZ-001",
    category: "Iluminación",
    subcategory: "Moving Heads",
    quantity: 12,
    quantityCommitted: 8,
    quantityMaintenance: 1,
    location: "Depósito Central",
    status: "operativo",
    notes: "Moving heads LED con zoom 7-49 grados",
  },
  {
    name: "PAR LED 54x3W RGBW",
    code: "LUZ-002",
    category: "Iluminación",
    subcategory: "PAR LED",
    quantity: 48,
    quantityCommitted: 24,
    quantityMaintenance: 3,
    location: "Depósito Principal",
    status: "operativo",
    notes: "Proyectores LED RGBW para wash",
  },
  {
    name: "Pantalla LED P3.9 Indoor",
    code: "VID-001",
    category: "Video",
    subcategory: "Pantallas LED",
    quantity: 60,
    quantityCommitted: 40,
    quantityMaintenance: 2,
    location: "Depósito Video",
    status: "operativo",
    notes: "Módulos 50x50cm, resolución HD",
  },
  {
    name: "Cámara Sony PXW-Z280",
    code: "VID-002",
    category: "Video",
    subcategory: "Cámaras",
    quantity: 4,
    quantityCommitted: 2,
    quantityMaintenance: 0,
    location: "Depósito Video",
    status: "operativo",
    notes: "Cámaras 4K con óptica Sony",
  },
  {
    name: "Motor Chain Master 500kg",
    code: "RIG-001",
    category: "Rigging",
    subcategory: "Motores",
    quantity: 20,
    quantityCommitted: 15,
    quantityMaintenance: 1,
    location: "Depósito Rigging",
    status: "operativo",
    notes: "Motores eléctricos certificados, última revisión 10/2025",
  },
  {
    name: "Truss Triangular 2m",
    code: "EST-001",
    category: "Estructuras",
    subcategory: "Truss",
    quantity: 80,
    quantityCommitted: 60,
    quantityMaintenance: 5,
    location: "Depósito Estructuras",
    status: "operativo",
    notes: "Truss aluminio triangular 290mm",
  },
  {
    name: "Cable Multipar 24ch 50m",
    code: "CAB-001",
    category: "Cables",
    subcategory: "Multipares",
    quantity: 10,
    quantityCommitted: 6,
    quantityMaintenance: 0,
    location: "Depósito Principal",
    status: "operativo",
    notes: "Cables multipar profesionales con XLR",
  },
  {
    name: "Cable DMX 10m",
    code: "CAB-002",
    category: "Cables",
    subcategory: "DMX",
    quantity: 50,
    quantityCommitted: 30,
    quantityMaintenance: 5,
    location: "Depósito Iluminación",
    status: "operativo",
    notes: "Cables DMX 5 pines",
  },
  {
    name: "Mochila Técnico Pro",
    code: "MOC-001",
    category: "Mochilas Técnicas",
    subcategory: "Kits Completos",
    quantity: 8,
    quantityCommitted: 5,
    quantityMaintenance: 0,
    location: "Oficina Técnica",
    status: "operativo",
    notes: "Kit completo: pinzas, destornilladores, tester, etc.",
  },
  {
    name: "Lámpara Discharge 300W",
    code: "REP-001",
    category: "Repuestos",
    subcategory: "Lámparas",
    quantity: 30,
    quantityCommitted: 0,
    quantityMaintenance: 0,
    location: "Depósito Repuestos",
    status: "operativo",
    notes: "Lámparas de repuesto para moving heads",
  },
];

async function poblarDatos() {
  try {
    console.log("🔄 Iniciando población de datos...\n");

    // Verificar si ya hay materiales
    const materialesSnapshot = await getDocs(collection(db, "materials"));

    if (materialesSnapshot.size > 0) {
      console.log(
        `⚠️  Ya existen ${materialesSnapshot.size} materiales en la base de datos.`
      );
      const respuesta = await pregunta(
        "¿Deseas agregar más materiales de ejemplo? (s/n): "
      );
      if (respuesta.toLowerCase() !== "s") {
        console.log("❌ Operación cancelada.");
        process.exit(0);
      }
    }

    // Obtener el primer usuario administrador para asignar como creador
    const usersSnapshot = await getDocs(query(collection(db, "users")));
    let adminUserId = null;
    let adminUserName = "Sistema";

    usersSnapshot.forEach((doc) => {
      const userData = doc.data();
      if (userData.role === "admin") {
        adminUserId = doc.id;
        adminUserName = userData.name || "Administrador";
      }
    });

    if (!adminUserId) {
      console.log(
        "⚠️  No se encontró un usuario administrador. Usando ID genérico."
      );
      adminUserId = "system";
    }

    console.log(`👤 Usando usuario: ${adminUserName} (${adminUserId})\n`);

    // Agregar materiales
    console.log("📦 Agregando materiales de ejemplo...");
    const materialesIds = [];

    for (const material of materialesEjemplo) {
      const materialData = {
        ...material,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: adminUserId,
      };

      const docRef = await addDoc(collection(db, "materials"), materialData);
      materialesIds.push({ id: docRef.id, ...material });
      console.log(`  ✅ ${material.name} (${material.code})`);
    }

    console.log(
      `\n✅ ${materialesEjemplo.length} materiales agregados exitosamente!\n`
    );

    // Crear movimientos de ejemplo
    console.log("🔄 Agregando movimientos de ejemplo...");

    const movimientosEjemplo = [
      {
        materialId: materialesIds[0].id,
        materialName: materialesIds[0].name,
        type: "entrada",
        quantity: 3,
        fromLocation: "Proveedor XYZ",
        toLocation: "Depósito Principal",
        reason: "Compra de nuevo equipamiento",
        createdBy: adminUserId,
        createdByName: adminUserName,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Hace 30 días
      },
      {
        materialId: materialesIds[1].id,
        materialName: materialesIds[1].name,
        type: "salida",
        quantity: 10,
        fromLocation: "Depósito Principal",
        toLocation: "Evento Festival Rock 2025",
        reason: "Montaje de evento",
        createdBy: adminUserId,
        createdByName: adminUserName,
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // Hace 15 días
      },
      {
        materialId: materialesIds[2].id,
        materialName: materialesIds[2].name,
        type: "salida",
        quantity: 8,
        fromLocation: "Depósito Central",
        toLocation: "Evento Corporativo Tech Summit",
        reason: "Alquiler cliente corporativo",
        createdBy: adminUserId,
        createdByName: adminUserName,
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // Hace 10 días
      },
      {
        materialId: materialesIds[3].id,
        materialName: materialesIds[3].name,
        type: "transferencia",
        quantity: 12,
        fromLocation: "Depósito Principal",
        toLocation: "Depósito Central",
        reason: "Reorganización de stock",
        createdBy: adminUserId,
        createdByName: adminUserName,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Hace 7 días
      },
      {
        materialId: materialesIds[4].id,
        materialName: materialesIds[4].name,
        type: "salida",
        quantity: 40,
        fromLocation: "Depósito Video",
        toLocation: "Evento Concierto Arena",
        reason: "Montaje pantalla LED principal",
        createdBy: adminUserId,
        createdByName: adminUserName,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // Hace 5 días
      },
      {
        materialId: materialesIds[6].id,
        materialName: materialesIds[6].name,
        type: "ajuste",
        quantity: 1,
        fromLocation: "Depósito Rigging",
        toLocation: "Taller Mantenimiento",
        reason: "Envío a mantenimiento preventivo",
        createdBy: adminUserId,
        createdByName: adminUserName,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // Hace 3 días
      },
      {
        materialId: materialesIds[1].id,
        materialName: materialesIds[1].name,
        type: "entrada",
        quantity: 5,
        fromLocation: "Evento Festival Rock 2025",
        toLocation: "Depósito Principal",
        reason: "Devolución post-evento",
        createdBy: adminUserId,
        createdByName: adminUserName,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Hace 1 día
      },
    ];

    for (const movimiento of movimientosEjemplo) {
      const movData = {
        ...movimiento,
        createdAt: serverTimestamp(),
      };
      await addDoc(collection(db, "movements"), movData);
      console.log(
        `  ✅ ${movimiento.type.toUpperCase()}: ${movimiento.materialName}`
      );
    }

    console.log(
      `\n✅ ${movimientosEjemplo.length} movimientos agregados exitosamente!\n`
    );

    console.log("🎉 ¡Población de datos completada con éxito!");
    console.log("\n📊 Resumen:");
    console.log(`   - ${materialesEjemplo.length} materiales`);
    console.log(`   - ${movimientosEjemplo.length} movimientos`);
    console.log(`   - 8 categorías diferentes`);
    console.log(
      "\n🌐 Ahora puedes ver los datos en: https://control-de-stock-e4f5f.web.app\n"
    );
  } catch (error) {
    console.error("❌ Error al poblar datos:", error);
  } finally {
    process.exit(0);
  }
}

function pregunta(texto) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(texto, (respuesta) => {
      rl.close();
      resolve(respuesta);
    });
  });
}

poblarDatos();
