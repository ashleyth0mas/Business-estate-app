
import { initializeApp } from "firebase/app";



const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-8459a.firebaseapp.com",
  projectId: "mern-estate-8459a",
  storageBucket: "mern-estate-8459a.appspot.com",
  messagingSenderId: "30166199552",
  appId: "1:30166199552:web:3f9a0c4fff37872fb997e5"
};


export const app = initializeApp(firebaseConfig);
