// src/App.jsx
import { useState, useEffect } from "react";
import "./index.css";

const days = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי"];
const rooms = Array.from({ length: 8 }, (_, i) => i + 1);

function App() {
  const [date, setDate] = useState("");
  const [hour, setHour] = useState("");
  const [room, setRoom] = useState("");
  const [psychologists, setPsychologists] = useState(() => {
    const saved = localStorage.getItem("psychologists");
    return saved ? JSON.parse(saved) : {};
  });

  const [editRoom, setEditRoom] = useState(null);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    localStorage.setItem("psychologists", JSON.stringify(psychologists));
  }, [psychologists]);

  const handleSubmit = () => {
    if (!date || !room || !hour) {
      alert("אנא מלא את כל השדות");
      return;
    }
    const message = `שלום, האם חדר ${room} פנוי בתאריך ${date} בשעה ${hour}?`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, "_blank");
  };

  const handleAddPsychologist = () => {
    if (!newName.trim()) return;
    setPsychologists((prev) => {
      const updated = {
        ...prev,
        [editRoom]: [...(prev[editRoom] || []), newName.trim()],
      };
      localStorage.setItem("psychologists", JSON.stringify(updated));
      return updated;
    });
    setNewName("");
  };

  const handleRemovePsychologist = (index) => {
    setPsychologists((prev) => {
      const updated = {
        ...prev,
        [editRoom]: prev[editRoom].filter((_, i) => i !== index),
      };
      localStorage.setItem("psychologists", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div dir="rtl" style={{ fontFamily: "Arial", padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>חדר פנוי בשניים 3?</h1>

      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <label>בחר תאריך: </label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <label style={{ marginInline: "10px" }}>שעה: </label>
        <input type="time" value={hour} onChange={(e) => setHour(e.target.value)} />
        <label style={{ marginInline: "10px" }}>חדר: </label>
        <select value={room} onChange={(e) => setRoom(e.target.value)}>
          <option value="">בחר חדר</option>
          {rooms.map((r) => (
            <option key={r} value={r}>חדר {r}</option>
          ))}
        </select>
        <button onClick={handleSubmit} style={{ padding: "8px 16px", marginRight: "10px" }}>
          שלח בקשת וואטסאפ
        </button>
      </div>

      <h2 style={{ textAlign: "center", marginTop: "30px" }}>הקצאת חדרים</h2>
      <div style={{ overflowX: "auto", border: "1px solid #ccc", direction: "ltr" }}>
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #aaa", padding: "8px", background: "#f0f0f0" }}>חדר / יום</th>
              {days.map((day) => (
                <th key={day} style={{ border: "1px solid #aaa", padding: "8px" }}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rooms.map((roomNum) => (
              <tr key={roomNum}>
                <td style={{ border: "1px solid #aaa", padding: "8px", background: "#f9f9f9" }}>
                  חדר {roomNum}
                  <br />
                  <button
                    style={{ marginTop: "5px", fontSize: "12px" }}
                    onClick={() => setEditRoom(roomNum)}
                  >
                    ניהול פסיכולוגים
                  </button>
                </td>
                {days.map((day) => (
                  <td key={day} style={{ border: "1px solid #aaa", padding: "8px", textAlign: "center" }}>
                    {psychologists[roomNum]?.join(", ") || "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* חלונית עריכת פסיכולוגים */}
      {editRoom && (
        <div
          style={{
            position: "fixed", top: "20%", left: "50%", transform: "translateX(-50%)",
            background: "white", padding: "20px", border: "1px solid #ccc", borderRadius: "8px", zIndex: 1000
          }}
        >
          <h3>פסיכולוגים בחדר {editRoom}</h3>
          <ul>
            {(psychologists[editRoom] || []).map((name, index) => (
              <li key={index}>
                {name}{" "}
                <button onClick={() => handleRemovePsychologist(index)}>❌</button>
              </li>
            ))}
          </ul>
          <input
            placeholder="הוסף שם פסיכולוג"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            style={{ marginTop: "10px", padding: "5px", width: "80%" }}
          />
          <br />
          <button onClick={handleAddPsychologist} style={{ marginTop: "10px" }}>הוסף</button>
          <button onClick={() => setEditRoom(null)} style={{ marginRight: "10px", marginTop: "10px" }}>
            סגור
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
