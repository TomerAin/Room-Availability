// App.jsx
import { useState, useEffect } from "react";
import "./index.css";

const defaultRooms = Array.from({ length: 8 }, (_, i) => `חדר ${i + 1}`);
const days = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי"];
const times = ["8:00-15:00", "15:00-22:00"];

function App() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [room, setRoom] = useState("");
  const [psychologists, setPsychologists] = useState(() => {
    const saved = localStorage.getItem("psychologists");
    return saved ? JSON.parse(saved) : {};
  });
  const [roomAssignments, setRoomAssignments] = useState(() => {
    const saved = localStorage.getItem("roomAssignments");
    return saved ? JSON.parse(saved) : {};
  });
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    localStorage.setItem("psychologists", JSON.stringify(psychologists));
    localStorage.setItem("roomAssignments", JSON.stringify(roomAssignments));
  }, [psychologists, roomAssignments]);

  const handleSubmit = () => {
    if (!date || !room || !time) {
      alert("אנא מלא את כל השדות כולל שעה");
      return;
    }
    const allPhones = (psychologists[room] || []).map((p) => p.phone).filter(Boolean);
    if (allPhones.length === 0) {
      alert("אין מספרי טלפון משויכים לחדר זה");
      return;
    }
    const message = `שלום, האם חדר ${room} פנוי בתאריך ${date} בשעה ${time}?`;
    const encodedMessage = encodeURIComponent(message);
    allPhones.forEach(phone => {
      window.open(`https://wa.me/${phone}?text=${encodedMessage}`, "_blank");
    });
  };

  const handleAddPsychologist = (roomName, name, phone) => {
    setPsychologists(prev => ({
      ...prev,
      [roomName]: [...(prev[roomName] || []), { name, phone }]
    }));
  };

  const handleAssign = (roomName, day, name) => {
    setRoomAssignments(prev => ({
      ...prev,
      [roomName]: {
        ...(prev[roomName] || {}),
        [day]: name
      }
    }));
  };

  return (
    <div className="container" dir="rtl">
      <h1>חדר פנוי בשניים 3?</h1>

      <div className="form-section">
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        <select value={room} onChange={(e) => setRoom(e.target.value)}>
          <option value="">בחר חדר</option>
          {defaultRooms.map(r => <option key={r}>{r}</option>)}
        </select>
        <button onClick={handleSubmit}>שלח בקשת וואטסאפ</button>
      </div>

      <div className="schedule-tables">
        {times.map((period, idx) => (
          <div key={idx} className="schedule-table">
            <h3>{period}</h3>
            <table>
              <thead>
                <tr>
                  <th>חדר / יום</th>
                  {days.map((day, i) => <th key={i}>{day}</th>)}
                </tr>
              </thead>
              <tbody>
                {defaultRooms.map((roomName, rIdx) => (
                  <tr key={rIdx}>
                    <td>{roomName}</td>
                    {days.map((day, dIdx) => (
                      <td key={dIdx}>
                        {(roomAssignments[roomName] || {})[day] || "-"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      <hr />

      {authorized ? (
        <div className="admin-section">
          <h2>ניהול פסיכולוגים בחדרים</h2>
          {defaultRooms.map(roomName => (
            <div key={roomName} className="room-card">
              <h3>{roomName}</h3>
              <ul>
                {(psychologists[roomName] || []).map((p, i) => <li key={i}>{p.name} ({p.phone})</li>)}
              </ul>
              <input placeholder="שם פסיכולוג" id={`name-${roomName}`} />
              <input placeholder="מספר טלפון" id={`phone-${roomName}`} />
              <button onClick={() => {
                const name = document.getElementById(`name-${roomName}`).value;
                const phone = document.getElementById(`phone-${roomName}`).value;
                if (name && phone) handleAddPsychologist(roomName, name, phone);
              }}>הוסף פסיכולוג</button>
              <h4>שיבוץ לפי ימים</h4>
              {days.map(day => (
                <div key={day}>
                  <label>{day}: </label>
                  <select value={(roomAssignments[roomName] || {})[day] || ""}
                    onChange={(e) => handleAssign(roomName, day, e.target.value)}>
                    <option value="">בחר פסיכולוג</option>
                    {(psychologists[roomName] || []).map((p, i) => (
                      <option key={i} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="auth-section">
          <h3>הזדהות מנהל</h3>
          <input placeholder="סיסמה" type="password" id="admin-pass" />
          <button onClick={() => {
            const val = document.getElementById("admin-pass").value;
            if (val === "1234") setAuthorized(true);
            else alert("סיסמה שגויה");
          }}>התחבר</button>
        </div>
      )}
    </div>
  );
}

export default App;
