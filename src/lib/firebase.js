// src/lib/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCaLaNGHBlGuCxsQ0IGUFMhls6RQLjAkXg",
  authDomain: "tugas-akhir-upnvj.firebaseapp.com",
  projectId: "tugas-akhir-upnvj",
  storageBucket: "tugas-akhir-upnvj.appspot.com",
  messagingSenderId: "90693175190",
  appId: "1:90693175190:web:a807e8f629c00dedd2ffb7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Pastikan app juga diekspor di sini
export { app, auth, db };
