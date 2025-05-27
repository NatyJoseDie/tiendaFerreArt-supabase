// src/lib/firebaseConfig.ts
import { initializeApp, getApp, type FirebaseOptions } from 'firebase/app';
import { getStorage } from 'firebase/storage';
// import { getFirestore } from 'firebase/firestore'; // Uncomment if you use Firestore
// import { getAuth } from 'firebase/auth'; // Uncomment if you use Authentication

// TODO: Replace with your app's actual Firebase project configuration
const firebaseConfig: FirebaseOptions = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  // measurementId: "YOUR_MEASUREMENT_ID" // Optional, for Google Analytics
};

// Initialize Firebase
let app;
// Check if Firebase has already been initialized
try {
  app = getApp();
} catch (e) {
  app = initializeApp(firebaseConfig);
}

const storage = getStorage(app);
// const db = getFirestore(app); // Uncomment if you will use Firestore
// const auth = getAuth(app); // Uncomment if you will use Authentication

export { app, storage /*, db, auth */ };
