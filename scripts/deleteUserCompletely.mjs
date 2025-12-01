import { initializeApp } from "firebase/app";
import { getAuth, deleteUser, signInWithEmailAndPassword } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import * as readline from "readline";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Preguntar qué entorno usar
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function main() {
  console.log("🗑️  Script para eliminar usuario completamente\n");

  const env = await question("¿Qué entorno? (1=Producción, 2=Demo): ");

  const envFile = env === "2" ? ".env.demo" : ".env.production";
  dotenv.config({ path: resolve(__dirname, `../${envFile}`) });

  console.log(
    `\n🔥 Conectando a proyecto: ${process.env.VITE_FIREBASE_PROJECT_ID}`
  );

  const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  const email = await question("\n📧 Email del usuario a eliminar: ");
  const password = await question("🔑 Contraseña del usuario: ");

  const confirm = await question(
    `\n⚠️  ¿Estás seguro de eliminar a ${email}? (si/no): `
  );

  if (confirm.toLowerCase() !== "si") {
    console.log("❌ Operación cancelada");
    rl.close();
    process.exit(0);
  }

  try {
    console.log("\n🔍 Buscando usuario...");

    // 1. Iniciar sesión con el usuario para obtener su UID
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const uid = userCredential.user.uid;
    console.log(`   ✅ Usuario encontrado: ${uid}`);

    // 2. Eliminar documento de Firestore
    console.log("\n📄 Eliminando documento de Firestore...");
    const userDocRef = doc(db, "users", uid);
    await deleteDoc(userDocRef);
    console.log("   ✅ Documento eliminado de Firestore");

    // 3. Eliminar usuario de Authentication
    console.log("\n🔐 Eliminando de Firebase Authentication...");
    await deleteUser(userCredential.user);
    console.log("   ✅ Usuario eliminado de Authentication");

    console.log("\n🎉 ¡Usuario eliminado completamente!");
    console.log("   Ahora puedes crear un nuevo usuario con este email.");
  } catch (error) {
    console.error("\n❌ Error:", error.message);

    if (error.code === "auth/wrong-password") {
      console.error("   Contraseña incorrecta");
    } else if (error.code === "auth/user-not-found") {
      console.error("   Usuario no encontrado en Authentication");

      // Intentar buscar y eliminar solo de Firestore
      console.log("\n🔍 Buscando en Firestore...");
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email.toLowerCase()));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const userDoc = snapshot.docs[0];
        await deleteDoc(doc(db, "users", userDoc.id));
        console.log("   ✅ Documento eliminado de Firestore");
        console.log("   ℹ️  El usuario no existía en Authentication");
      } else {
        console.log("   ⚠️  Usuario no encontrado en ningún lugar");
      }
    }
  } finally {
    rl.close();
    process.exit(0);
  }
}

main();
