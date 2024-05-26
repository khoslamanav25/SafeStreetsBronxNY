// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyARh0DdE-EMrOzzVpK5WN0nvWUalLjkKkE",
  authDomain: "safestreetsny.firebaseapp.com",
  projectId: "safestreetsny",
  storageBucket: "safestreetsny.appspot.com",
  messagingSenderId: "898633171335",
  appId: "1:898633171335:web:aa7290edeaa57c91d89322"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);