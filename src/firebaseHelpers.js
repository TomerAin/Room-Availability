// firebaseHelpers.js
import { database } from './firebase';
import { ref, set, onValue } from 'firebase/database';

// שמירת פסיכולוג ליום מסוים בחדר
export function saveRoomAssignment(roomId, day, psychologistName, phoneNumber) {
  const roomRef = ref(database, `rooms/${roomId}/days/${day}`);
  set(roomRef, {
    name: psychologistName,
    phone: phoneNumber
  });
}

// טעינת הפסיכולוג שמשויך לחדר ביום מסוים
export function loadRoomAssignment(roomId, day, callback) {
  const roomRef = ref(database, `rooms/${roomId}/days/${day}`);
  onValue(roomRef, (snapshot) => {
    const data = snapshot.val();
    callback(data);
  });
}
