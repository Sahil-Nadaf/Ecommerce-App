import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAAEHuV6bmfC9MLUqdXpH1pmLzbHzj1Y10",
  authDomain: "flipkart-99043.firebaseapp.com",
  projectId: "flipkart-99043",
  storageBucket: "flipkart-99043.firebasestorage.app",
  messagingSenderId: "317162348269",
  appId: "1:317162348269:web:beb1cb98c738126e28f6e4",
  measurementId: "G-QW5PJVMRD2"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);