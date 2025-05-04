// src/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// הגדרות החיבור לפרויקט Firebase שלך
const firebaseConfig = {
  apiKey: "AIzaSyA6qisQGd2zdLN_wylOmLXE3M1Dpqte9_Q",
  authDomain: "room-scheduler-579ef.firebaseapp.com",
  databaseURL: "https://room-scheduler-579ef-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "room-scheduler-579ef",
  storageBucket: "room-scheduler-579ef.appspot.com",
  messagingSenderId: "231957301822",
  appId: "1:231957301822:web:8b4a882f66464f34615f6f"
};

// אתחול Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
