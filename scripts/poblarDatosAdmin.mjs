/**
 * Script para poblar Firestore usando Firebase Admin SDK
 *
 * REQUISITOS:
 * 1. Instalar: npm install firebase-admin
 * 2. Descargar serviceAccountKey.json desde Firebase Console
 * 3. Colocarlo en la raíz del proyecto
 *
 * USO:
 * node scripts/poblarDatosAdmin.mjs
 */

import admin from "firebase-admin";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import * as readline from "readline";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar credenciales de servicio
const serviceAccountPath = join(__dirname, "..", "serviceAccountKey.json");

try {
  const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf8"));

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  console.log("✅ Firebase Admin inicializado correctamente\n");
} catch (error) {
  console.error("❌ Error al cargar serviceAccountKey.json");
  console.error(
    "   Por favor descarga las credenciales desde Firebase Console:"
  );
  console.error(
    "   Configuración > Cuentas de servicio > Generar nueva clave privada"
  );
  process.exit(1);
}

const db = admin.firestore();

// Datos de ejemplo
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
    console.log("🔄 Iniciando población de datos con Firebase Admin SDK...\n");

    // Verificar materiales existentes
    const materialesSnapshot = await db.collection("materials").get();

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

    // Obtener primer usuario admin
    const usersSnapshot = await db
      .collection("users")
      .where("role", "==", "admin")
      .limit(1)
      .get();
    let adminUserId = "system";
    let adminUserName = "Sistema";

    if (!usersSnapshot.empty) {
      const adminDoc = usersSnapshot.docs[0];
      adminUserId = adminDoc.id;
      adminUserName = adminDoc.data().name || "Administrador";
    }

    console.log(`👤 Usando usuario: ${adminUserName} (${adminUserId})\n`);

    // Agregar materiales
    console.log("📦 Agregando materiales...");
    const materialesIds = [];
    const batch = db.batch();

    for (const material of materialesEjemplo) {
      const docRef = db.collection("materials").doc();
      const materialData = {
        ...material,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        createdBy: adminUserId,
      };

      batch.set(docRef, materialData);
      materialesIds.push({ id: docRef.id, ...material });
      console.log(`  ✅ ${material.name} (${material.code})`);
    }

    await batch.commit();
    console.log(`\n✅ ${materialesEjemplo.length} materiales agregados!\n`);

    // Agregar movimientos
    console.log("🔄 Agregando movimientos...");

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
      },
    ];

    const movBatch = db.batch();
    for (const mov of movimientosEjemplo) {
      const docRef = db.collection("movements").doc();
      movBatch.set(docRef, {
        ...mov,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log(`  ✅ ${mov.type.toUpperCase()}: ${mov.materialName}`);
    }

    await movBatch.commit();
    console.log(`\n✅ ${movimientosEjemplo.length} movimientos agregados!\n`);

    console.log("🎉 ¡Datos cargados exitosamente!");
    console.log("\n📊 Resumen:");
    console.log(`   - ${materialesEjemplo.length} materiales`);
    console.log(`   - ${movimientosEjemplo.length} movimientos`);
    console.log(`\n🌐 Ver en: https://${process.env.VITE_FIREBASE_PROJECT_ID}.web.app\n`);
  } catch (error) {
    console.error("❌ Error:", error.message);
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
