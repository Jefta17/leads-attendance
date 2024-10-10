// src/lib/firebase.js
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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

export { auth, db };