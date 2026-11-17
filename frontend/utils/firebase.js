import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDummyApiKeyPlaceholderForAgentForge",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "agentforge-ai.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "agentforge-ai",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "agentforge-ai.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1046800162668",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1046800162668:web:agentforge",
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export default app;
