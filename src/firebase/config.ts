// ============================================================================
// FIREBASE CONFIGURATION (Prepared for future cloud migration)
// TODO: FIREBASE-MIGRATE - supply production Firebase project credentials in environment variables
// ============================================================================

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { getAuth, type Auth } from 'firebase/auth';

// Firebase configuration object (placeholders ready to be replaced with production keys)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSy_PLACEHOLDER_API_KEY_MAJUMDAR_KHAMAR",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "majumdar-khamar.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "majumdar-khamar",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "majumdar-khamar.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "909464399548",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:909464399548:web:abcdef123456"
};

let app: FirebaseApp;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;
let auth: Auth | null = null;

try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  db = getFirestore(app);
  storage = getStorage(app);
  auth = getAuth(app);
} catch (error) {
  console.warn("Firebase initialization note (app currently running on local localStorage dataService):", error);
  app = {} as FirebaseApp;
}

export { app, db, storage, auth, firebaseConfig };


