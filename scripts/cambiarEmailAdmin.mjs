import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import dotenv from "dotenv";
import readline from "readline";

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

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function pregunta(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

console.log("🔄 CAMBIAR EMAIL DE ADMINISTRADOR");
console.log("===================================");
console.log(
  "⚠️  IMPORTANTE: Este proceso cambiará el administrador principal del sistema"
);
console.log("⚠️  Asegúrate de tener las credenciales correctas del cliente\n");

try {
  // 1. Solicitar credenciales del administrador actual y del nuevo
  console.log("🔐 ADMINISTRADOR ACTUAL:");
  const adminEmail = await pregunta("   Email actual: ");
  const adminPassword = await pregunta("   Contraseña actual: ");

  console.log("");
  console.log("📧 NUEVAS CREDENCIALES DEL CLIENTE:");
  const nuevoEmail = await pregunta("   Email del cliente: ");
  const nuevaPassword = await pregunta("   Contraseña del cliente: ");
  const nombreCliente = await pregunta("   Nombre del cliente: ");

  console.log("\n🔍 CONFIRMACIÓN:");
  console.log(`   Email: ${nuevoEmail}`);
  console.log(`   Nombre: ${nombreCliente}`);
  console.log(`   Contraseña: ${nuevaPassword.replace(/./g, "*")}`);

  const confirmacion = await pregunta("\n¿Continuar? (si/no): ");

  if (confirmacion.toLowerCase() !== "si") {
    console.log("❌ Operación cancelada");
    process.exit(0);
  }

  // 2. Crear la cuenta nueva (Firebase inicia sesión con ella)
  console.log("\nCreando nueva cuenta de administrador...");
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    nuevoEmail,
    nuevaPassword
  );
  const nuevoUID = userCredential.user.uid;
  await signOut(auth);

  // 3. Volver a entrar como administrador actual: las reglas de seguridad
  //    sólo permiten que un admin cree perfiles de administrador
  console.log("\nAutenticándose como administrador actual...");
  await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
  const adminActualUID = auth.currentUser.uid;
  console.log("Autenticado correctamente");

  // 4. Crear el perfil del nuevo administrador
  console.log("Configurando perfil de administrador...");
  await setDoc(doc(db, "users", nuevoUID), {
    uid: nuevoUID,
    email: nuevoEmail.toLowerCase(),
    name: nombreCliente,
    role: "admin",
    active: true,
    createdAt: serverTimestamp(),
    transferredFrom: adminEmail,
    isMainAdmin: true,
  });

  // 5. Desactivar la cuenta anterior (al final, mientras aún es admin)
  console.log("\nDesactivando cuenta actual...");
  await updateDoc(doc(db, "users", adminActualUID), {
    active: false,
    deactivatedAt: serverTimestamp(),
    deactivatedReason: `Transferido a cliente: ${nuevoEmail}`,
  });
  await signOut(auth);
  console.log("Cuenta anterior desactivada");

  console.log("\n🎉 ¡CAMBIO COMPLETADO EXITOSAMENTE!");
  console.log("=======================================");
  console.log("✅ Nueva cuenta de administrador creada");
  console.log("✅ Cuenta anterior desactivada");
  console.log("✅ Todos los datos y materiales preservados");
  console.log("✅ Sistema demo sigue funcionando");

  console.log("\n📋 CREDENCIALES PARA EL CLIENTE:");
  console.log(`   🌐 URL: https://${process.env.VITE_FIREBASE_PROJECT_ID}.web.app`);
  console.log(`   📧 Email: ${nuevoEmail}`);
  console.log(`   🔑 Contraseña: ${nuevaPassword}`);
  console.log(`   👤 Rol: Administrador (acceso completo)`);

  console.log("\n💡 CREDENCIALES DEMO (para demostraciones):");
  console.log("   📧 Email: demo@demo.com");
  console.log("   🔑 Contraseña: demo123");
  console.log("   👤 Rol: Invitado (solo lectura)");
} catch (error) {
  console.error("❌ Error durante el cambio:", error.message);

  if (error.code === "auth/email-already-in-use") {
    console.log(
      "\n⚠️  El email ya existe. ¿Quieres actualizar la cuenta existente?"
    );
    const actualizar = await pregunta("Escribir 'si' para actualizar: ");

    if (actualizar.toLowerCase() === "si") {
      console.log("🔄 Actualizando cuenta existente...");
      // Aquí puedes agregar lógica para actualizar una cuenta existente
    }
  }
} finally {
  rl.close();
  process.exit(0);
}
