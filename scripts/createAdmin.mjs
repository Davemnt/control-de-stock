import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";
import * as readline from "readline";

// Firebase configuration from .env
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) => {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
};

async function createAdminUser() {
  console.log("\n🔥 Crear Usuario Administrador\n");

  try {
    const email = await question("Email del administrador: ");
    const password = await question("Contraseña (mínimo 8 caracteres): ");
    const name = await question("Nombre completo: ");

    if (password.length < 8) {
      console.error("❌ La contraseña debe tener al menos 8 caracteres");
      rl.close();
      process.exit(1);
    }

    console.log("\n⏳ Creando usuario...");

    // Create authentication user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    console.log("✅ Usuario creado en Authentication");
    console.log(`UID: ${user.uid}`);

    // Create user document in Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: email.toLowerCase(),
      name: name,
      role: "admin",
      active: true,
      createdAt: serverTimestamp(),
    });

    console.log("✅ Documento creado en Firestore");
    console.log("\n🎉 Usuario administrador creado exitosamente!");
    console.log(`\nPuedes iniciar sesión con:`);
    console.log(`Email: ${email}`);
    console.log(`Contraseña: [la que ingresaste]\n`);
  } catch (error) {
    console.error("\n❌ Error:", error.message);

    if (error.code === "auth/email-already-in-use") {
      console.log("💡 El email ya está en uso. Intenta con otro email.");
    } else if (error.code === "auth/invalid-email") {
      console.log("💡 El formato del email es inválido.");
    } else if (error.code === "auth/weak-password") {
      console.log("💡 La contraseña es muy débil.");
    }
  } finally {
    rl.close();
    process.exit(0);
  }
}

createAdminUser();
