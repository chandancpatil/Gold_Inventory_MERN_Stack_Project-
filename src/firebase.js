// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth"; // 🔥 Add this

const firebaseConfig = {
  apiKey: "AIzaSyCRFp2rk2EI5ga2HwkiO8lTiCFAJQlUGoM",
  authDomain: "goldbyarshad.firebaseapp.com",
  databaseURL: "https://goldbyarshad-default-rtdb.firebaseio.com",
  projectId: "goldbyarshad",
  storageBucket: "goldbyarshad.firebasestorage.app",
  messagingSenderId: "683967422592",
  appId: "1:683967422592:web:5214621e290d2699fdc665",
  measurementId: "G-S0FW99VCWT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app); // 🔥 Initialize authentication

export { database, auth };
