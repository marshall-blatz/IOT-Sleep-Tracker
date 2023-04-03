import { initializeApp } from "firebase/app";
import { getAuth} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // your Firebase project config goes here
  apiKey: "AIzaSyDJ1NNTZlJS6wLvW6eYZ1DYHfhb9_K4i8c",
  authDomain: "iot-project-c5c33.firebaseapp.com",
  databaseURL: "https://iot-project-c5c33-default-rtdb.firebaseio.com",
  projectId: "iot-project-c5c33",
  storageBucket: "iot-project-c5c33.appspot.com",
  messagingSenderId: "872741575843",
  appId: "1:872741575843:web:009ce5a7d4ad8961973316",
  measurementId: "G-ZMTKWKV0WF"
};

// initialize the Firebase app
const app = initializeApp(firebaseConfig);

// get a reference to Firestore
const db = getFirestore(app);

// get a reference to the Authentication service
const auth = getAuth(app);

export {db, auth}