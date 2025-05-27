// src/lib/firebaseConfig.ts
import { initializeApp, getApp, type FirebaseOptions } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// import { getAuth } from 'firebase/auth'; // Descomentá si usás autenticación

// Configuración de tu proyecto ACTUAL: distriferreart-1003d
const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyBAkcStnIRjIkcXRii4WincdDbiqXU",
  authDomain: "distriferreart-1003d.firebaseapp.com",
  projectId: "distriferreart-1003d",
  storageBucket: "distriferreart-1003d.appspot.com",
  messagingSenderId: "663326517690",
  appId: "1:663326517690:web:732e095195e90591abd583",
  measurementId: "G-PJPVPSQYC2"
};

// Inicializar Firebase solo si no está ya iniciado
let app;
try {
  app = getApp();
} catch (e) {
  app = initializeApp(firebaseConfig);
}

// Inicializar servicios
const db = getFirestore(app);
const storage = getStorage(app);
// const auth = getAuth(app); // Descomentá si usás auth

// Exportar todo lo necesario
export { app, db, storage /*, auth */ };
