import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { collection, getFirestore}  from 'firebase/firestore';

const firebaseConfig = {
  apiKey:  process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "connectwave-6c933.firebaseapp.com",
  projectId: "connectwave-6c933",
  storageBucket: "connectwave-6c933.appspot.com",
  messagingSenderId: "121315480340",
  appId: "1:121315480340:web:1ea7bdc87dbb72c89b2801",
  measurementId: "G-YHKDD0EG96"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const firebaseAuth = getAuth(app);
export const firebaseDB= getFirestore(app);

export const userRef = collection(firebaseDB, "users"); 
export const meetingsRef = collection(firebaseDB, "meetings");