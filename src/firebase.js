// firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyA6qisQGd2zdLN_wylOmLXE3M1Dpqte9_Q",
  authDomain: "room-scheduler-579ef.firebaseapp.com",
  databaseURL: "https://room-scheduler-579ef-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "room-scheduler-579ef",
  storageBucket: "room-scheduler-579ef.appspot.com",
  messagingSenderId: "231957301822",
  appId: "1:231957301822:web:8b4a882f66464f34615f6f"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

function saveData(path, data) {
  console.log(`[Firebase] Writing data to path: ${path}`, data);
  return set(ref(database, path), data)
    .then(() => {
      console.log(`[Firebase] Successfully wrote data to ${path}`);
    })
    .catch((error) => {
      console.error(`[Firebase] Error writing data to ${path}:`, error);
    });
}

function subscribeToData(path, callback) {
  const dataRef = ref(database, path);
  onValue(dataRef, (snapshot) => {
    const val = snapshot.val();
    console.log(`[Firebase] Data updated at path: ${path}`, val);
    callback(val);
  }, (error) => {
    console.error(`[Firebase] Error reading data from ${path}:`, error);
  });
}

function saveAssignments(assignments) {
  return saveData("assignments", assignments);
}

function savePsychologists(psychologists) {
  return saveData("psychologists", psychologists);
}

export {
  saveAssignments,
  savePsychologists,
  subscribeToData
};
