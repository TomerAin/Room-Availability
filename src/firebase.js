// firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";

// הגדרות Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA6qisQGd2zdLN_wylOmLXE3M1Dpqte9_Q",
  authDomain: "room-scheduler-579ef.firebaseapp.com",
  databaseURL: "https://room-scheduler-579ef-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "room-scheduler-579ef",
  storageBucket: "room-scheduler-579ef.appspot.com",
  messagingSenderId: "231957301822",
  appId: "1:231957301822:web:8b4a882f66464f34615f6f"
};

// אתחול האפליקציה
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// פונקציה כללית לשמירת נתונים
function saveData(path, data) {
  return set(ref(database, path), data);
}

// האזנה לשינויים במסלול מסוים
function subscribeToData(path, callback) {
  const dataRef = ref(database, path);
  onValue(dataRef, (snapshot) => {
    const data = snapshot.val();
    callback(data);
  });
}

// פונקציות ייעודיות לשמירת נתונים
function saveAssignments(data) {
  return saveData("assignments", data);
}

function savePsychologists(data) {
  return saveData("psychologists", data);
}

export {
  saveData,
  subscribeToData,
  saveAssignments,
  savePsychologists
};
