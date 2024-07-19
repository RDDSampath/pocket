// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAzZ2nqvGN0lschBk94W-QidruhMilmDAU",
  authDomain: "pocket-ec8a4.firebaseapp.com",
  projectId: "pocket-ec8a4",
  storageBucket: "pocket-ec8a4.appspot.com",
  messagingSenderId: "39121314420",
  appId: "1:39121314420:web:a2adf13024f2199c79e721"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
// Initialize Database
export const db = getDatabase(app);
export default app;
