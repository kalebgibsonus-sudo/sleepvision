// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 🔹 Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyBkgpVyPyeteAymraqamGCheRKvOIA80i4",
  authDomain: "sleepvision-c0d73.firebaseapp.com",
  projectId: "sleepvision-c0d73",
  storageBucket: "sleepvision-c0d73.firebasestorage.app",
  messagingSenderId: "337763729696",
  appId: "1:337763729696:web:d27c344e56b19ee81fd745",
  measurementId: "G-8FJVD1LBNS",
};

// 🔧 Initialize Firebase app
const app = initializeApp(firebaseConfig);

// 🔧 Initialize Firebase services
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
