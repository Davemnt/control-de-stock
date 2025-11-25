import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Determinar si es usuario demo para separar datos
export const isDemoMode = () => {
  const userData = JSON.parse(localStorage.getItem("currentUser") || "{}");
  return userData.email === "demo@demo.com";
};

// Prefijo para colecciones según el tipo de usuario
export const getCollectionPrefix = () => {
  return isDemoMode() ? "demo_" : "";
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
export const db = getFirestore(app);

// Storage is optional - initialize only if configured
export const storage = firebaseConfig.storageBucket ? getStorage(app) : null;

// Log storage status
if (!storage) {
  console.warn(
    "Firebase Storage not configured. Image upload will be disabled."
  );
}

export default app;
