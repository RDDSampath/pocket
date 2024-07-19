// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC6pb9H-0rwdF3qAsdHZJjrRwGccNnrdb8",
  authDomain: "money-planner-c1877.firebaseapp.com",
  databaseURL: "https://money-planner-c1877-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "money-planner-c1877",
  storageBucket: "money-planner-c1877.appspot.com",
  messagingSenderId: "400907459312",
  appId: "1:400907459312:web:db5d430b5e66eb71458035"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Database
export const db = getDatabase(app);
