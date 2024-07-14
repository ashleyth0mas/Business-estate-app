// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-8459a.firebaseapp.com",
  projectId: "mern-estate-8459a",
  storageBucket: "mern-estate-8459a.appspot.com",
  messagingSenderId: "30166199552",
  appId: "1:30166199552:web:3f9a0c4fff37872fb997e5"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);