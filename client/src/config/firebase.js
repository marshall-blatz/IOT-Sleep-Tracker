// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'; //connectAuthEmulator
import { getFirestore } from "firebase/firestore"; //connectFirestoreEmulator
import { getStorage } from "firebase/storage"

// TODO: Add SDKs for Firebase products
// https://firebase.google.com/docs/web/setup#available-libraries

// Web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// authentication initilization and reference
export const auth = getAuth(app);
// connectAuthEmulator(auth, "http://localhost:9099");

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
// connectFirestoreEmulator(db, "localhost", 8080);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);

// use auth elsewhere
//export default auth;
