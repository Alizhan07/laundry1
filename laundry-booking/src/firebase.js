// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC5BStQo1fHVd05DA0A5lORCsOhs7GVf50",
  authDomain: "laundry-351ed.firebaseapp.com",
  projectId: "laundry-351ed",
  storageBucket: "laundry-351ed.firebasestorage.app",
  messagingSenderId: "587102478447",
  appId: "1:587102478447:web:f196edc57004a365df6d9a",
  measurementId: "G-3S3ZCSLLD8"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

