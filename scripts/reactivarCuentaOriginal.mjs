import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {
  getFirestore,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

console.log("🆘 REACTIVAR CUENTA ORIGINAL");
console.log("============================");
console.log("Este script reactiva tu cuenta original como administrador\n");

try {
  // Intentar autenticarse con cuenta original
  console.log("🔐 Intentando autenticar cuenta original...");
  await signInWithEmailAndPassword(
    auth,
    "montedavid07@hotmail.com",
    "Moroni1032!"
  );

  // Reactivar cuenta
  console.log("🔄 Reactivando cuenta...");
  const userRef = doc(db, "users", auth.currentUser.uid);
  await updateDoc(userRef, {
    active: true,
    reactivatedAt: serverTimestamp(),
    reactivatedReason: "Reactivación de emergencia",
  });

  console.log("✅ ¡Cuenta reactivada exitosamente!");
  console.log("\n📋 Puedes acceder nuevamente con:");
  console.log("   📧 Email: montedavid07@hotmail.com");
  console.log("   🔑 Contraseña: Moroni1032!");
  console.log("   🌐 URL: https://control-de-stock-e4f5f.web.app");
} catch (error) {
  console.error("❌ Error:", error.message);

  if (error.code === "auth/user-disabled") {
    console.log("⚠️  La cuenta fue deshabilitada en Firebase Auth");
    console.log("   Contacta el soporte de Firebase para reactivarla");
  } else if (error.code === "auth/wrong-password") {
    console.log("⚠️  Contraseña incorrecta");
  } else if (error.code === "auth/user-not-found") {
    console.log("⚠️  Usuario no encontrado");
  }
}

process.exit(0);
