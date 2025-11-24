/**
 * Firebase Initialization Script
 * 
 * Este script debe ejecutarse UNA VEZ después de configurar Firebase
 * para crear el usuario administrador inicial y datos de prueba.
 * 
 * Instrucciones:
 * 1. Configurar las variables de entorno en .env
 * 2. Ejecutar: node scripts/initFirebase.js
 */

import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Configuración de Firebase (reemplazar con tus credenciales)
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Crear usuario administrador
async function createAdminUser() {
  try {
    const email = 'admin@eventos.com';
    const password = 'Admin123!';
    
    console.log('Creando usuario administrador...');
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      uid: userCredential.user.uid,
      name: 'Administrador',
      email: email,
      role: 'admin',
      active: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    console.log('✓ Usuario administrador creado');
    console.log(`  Email: ${email}`);
    console.log(`  Password: ${password}`);
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('⚠ Usuario administrador ya existe');
    } else {
      console.error('Error:', error);
    }
  }
}

// Crear materiales de ejemplo
async function createSampleMaterials() {
  console.log('\nCreando materiales de ejemplo...');
  
  const sampleMaterials = [
    {
      name: 'Mezcladora Digital X32',
      code: 'AUD-001',
      category: 'audio',
      subcategory: 'Mezcladoras',
      quantity: 5,
      quantityCommitted: 1,
      quantityMaintenance: 0,
      location: 'Depósito Principal',
      status: 'operativo',
      notes: 'Mezcladora digital profesional 32 canales'
    },
    {
      name: 'Moving Head LED 300W',
      code: 'LUZ-001',
      category: 'iluminacion',
      subcategory: 'Móviles',
      quantity: 12,
      quantityCommitted: 4,
      quantityMaintenance: 1,
      location: 'Depósito Principal',
      status: 'operativo',
      notes: 'Cabezal móvil LED de alta potencia'
    },
    {
      name: 'Proyector Video 10K Lumens',
      code: 'VID-001',
      category: 'video',
      subcategory: 'Proyectores',
      quantity: 8,
      quantityCommitted: 2,
      quantityMaintenance: 0,
      location: 'Sala de Video',
      status: 'operativo',
      notes: 'Proyector profesional para eventos'
    },
    {
      name: 'Truss Aluminio 3m',
      code: 'EST-001',
      category: 'estructuras',
      subcategory: 'Truss',
      quantity: 50,
      quantityCommitted: 20,
      quantityMaintenance: 2,
      location: 'Depósito Estructuras',
      status: 'operativo',
      notes: 'Truss triangular de aluminio'
    },
    {
      name: 'Cable XLR 10m',
      code: 'CAB-001',
      category: 'cables',
      subcategory: 'Audio',
      quantity: 100,
      quantityCommitted: 30,
      quantityMaintenance: 5,
      location: 'Depósito Cables',
      status: 'operativo',
      notes: 'Cable balanceado XLR profesional'
    },
    {
      name: 'Motor Chain Hoist 1T',
      code: 'RIG-001',
      category: 'rigging',
      subcategory: 'Motores',
      quantity: 15,
      quantityCommitted: 8,
      quantityMaintenance: 1,
      location: 'Depósito Rigging',
      status: 'operativo',
      notes: 'Motor de cadena 1 tonelada'
    },
    {
      name: 'Mochila Técnica Completa',
      code: 'MOC-001',
      category: 'mochilas',
      subcategory: 'Herramientas',
      quantity: 20,
      quantityCommitted: 5,
      quantityMaintenance: 0,
      location: 'Depósito Principal',
      status: 'operativo',
      notes: 'Mochila con herramientas básicas'
    }
  ];

  try {
    for (const material of sampleMaterials) {
      await addDoc(collection(db, 'materials'), {
        ...material,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log(`✓ ${material.name}`);
    }
    console.log('\n✓ Materiales creados exitosamente');
  } catch (error) {
    console.error('Error creando materiales:', error);
  }
}

// Ejecutar inicialización
async function initialize() {
  console.log('=================================');
  console.log('Inicializando Firebase...');
  console.log('=================================\n');
  
  await createAdminUser();
  await createSampleMaterials();
  
  console.log('\n=================================');
  console.log('Inicialización completada');
  console.log('=================================');
  process.exit(0);
}

initialize();
