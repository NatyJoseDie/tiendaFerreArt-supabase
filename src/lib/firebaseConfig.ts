// src/lib/firebaseConfig.ts
import { initializeApp, getApp, type FirebaseOptions } from 'firebase/app';
import { getStorage } from 'firebase/storage';
// import { getFirestore } from 'firebase/firestore'; // Descomenta si usarás Firestore
// import { getAuth } from 'firebase/auth'; // Descomenta si usarás Authentication

const firebaseConfig: FirebaseOptions = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  // measurementId: "YOUR_MEASUREMENT_ID" // Opcional
};

// Inicializar Firebase
let app;
// Comprobar si Firebase ya ha sido inicializado para evitar errores de "app/duplicate-app" en HMR
try {
  app = getApp();
} catch (e) {
  app = initializeApp(firebaseConfig);
}

const storage = getStorage(app);
// const db = getFirestore(app); // Descomenta si usarás Firestore
// const auth = getAuth(app); // Descomenta si usarás Authentication

export { app, storage /*, db, auth */ };
