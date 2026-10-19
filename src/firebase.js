import { initializeApp, getApps } from "firebase/app";
import { getAuth, signOut } from "firebase/auth";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Validate Firebase configuration
const validateConfig = () => {
  const required = ["apiKey", "authDomain", "projectId"];
  const missing = required.filter((key) => !firebaseConfig[key]);

  if (missing.length > 0) {
    console.error("Firebase config missing:", missing);
    throw new Error(
      `Firebase configuration incomplete. Missing: ${missing.join(", ")}`
    );
  }
};

validateConfig();

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
// Caché persistente: los datos ya vistos siguen disponibles sin conexión y
// las escrituras simples se sincronizan al volver la red.
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
});

// Storage is optional - initialize only if configured
export const storage = firebaseConfig.storageBucket ? getStorage(app) : null;

// Log storage status
if (!storage) {
  console.warn(
    "Firebase Storage not configured. Image upload will be disabled."
  );
}

/**
 * Ejecuta una operación con una instancia de Auth secundaria.
 * Permite que un administrador cree cuentas nuevas sin que Firebase
 * cierre su propia sesión (createUserWithEmailAndPassword inicia sesión
 * automáticamente con el usuario creado).
 */
export const withSecondaryAuth = async (operation) => {
  const name = "secondary-auth";
  const secondaryApp =
    getApps().find((a) => a.name === name) || initializeApp(firebaseConfig, name);
  const secondaryAuth = getAuth(secondaryApp);
  try {
    return await operation(secondaryAuth);
  } finally {
    await signOut(secondaryAuth).catch(() => {});
  }
};

export default app;
