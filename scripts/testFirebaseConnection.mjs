import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import dotenv from "dotenv";

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID,
};

console.log("🔧 Configurando Firebase...");
console.log("Project ID:", firebaseConfig.projectId);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

console.log("\n📋 Prueba de Conectividad Firebase");
console.log("=====================================");

try {
  // Intentar autenticarse con el administrador
  console.log("📧 Email del administrador: montedavid07@hotmail.com");
  console.log("🔑 Contraseña: Moroni1032!");

  const userCredential = await signInWithEmailAndPassword(
    auth,
    "montedavid07@hotmail.com",
    "Moroni1032!"
  );
  console.log("✅ Autenticación exitosa, UID:", userCredential.user.uid);

  // Intentar leer materiales
  console.log("\n📦 Probando lectura de materiales...");
  const materialsRef = collection(db, "materials");
  const snapshot = await getDocs(materialsRef);

  console.log(`✅ Se encontraron ${snapshot.size} materiales`);

  if (snapshot.size > 0) {
    console.log("\n📋 Primeros materiales:");
    let count = 0;
    snapshot.forEach((doc) => {
      if (count < 3) {
        console.log(`  • ${doc.data().name} - ${doc.data().category}`);
        count++;
      }
    });
  }

  console.log("\n🎉 ¡Todas las pruebas pasaron exitosamente!");
} catch (error) {
  console.error("❌ Error en la prueba:", error.message);
  console.error("Código:", error.code);
}

process.exit(0);
