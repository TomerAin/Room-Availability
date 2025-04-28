// src/App.jsx
import { useState } from "react";

// מערכים של שמות העובדים
const morningSchedule = [
  ["משה כהן", "שרה לוי", "אבי לוי", "", "", ""],
  ["דנה לוי", "", "אורן בן דוד", "", "", ""],
  ["רעות ישראלי", "", "", "", "", ""],
  ["", "נירית גבע", "", "", "", ""],
  ["", "", "", "יואב רון", "", ""],
  ["", "", "", "", "מיכל כהן", ""],
  ["", "", "", "", "", "ערן ממן"],
  ["", "", "", "", "", ""],
];

const afternoonSchedule = [
  ["ליאור אשכנזי", "", "", "", "", ""],
  ["", "שירה ברק", "", "", "", ""],
  ["", "", "תומר אלון", "", "", ""],
  ["", "", "", "גיא מזרחי", "", ""],
  ["", "", "", "", "חני אליאס", ""],
  ["", "", "", "", "", "אורי שמואלי"],
  ["", "", "", "", "", ""],
  ["", "", "", "", "", ""],
];

function App() {
  const [date, setDate] = useState("");
  const [room, setRoom] = useState("");

  const handleSubmit = () => {
    if (!date || !room) {
      alert("אנא מלא את כל השדות");
      return;
    }
    const message = `שלום, האם חדר ${room} פנוי בתאריך ${date}?`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, "_blank");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px", fontFamily: "Arial", direction: "rtl" }}>
      <h1>חדר פנוי בשניים 3?</h1>

      {/* טופס בחירת תאריך וחדר */}
      <div style={{ marginBottom: "20px" }}>
        <label>בחר תאריך: </label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label>בחר חדר: </label>
        <select value={room} onChange={(e) => setRoom(e.target.value)}>
          <option value="">בחר חדר</option>
          <option value="1">חדר 1</option>
          <option value="2">חדר 2</option>
          <option value="3">חדר 3</option>
          <option value="4">חדר 4</option>
          <option value="5">חדר 5</option>
          <option value="6">חדר 6</option>
          <option value="7">חדר 7</option>
          <option value="8">חדר 8</option>
        </select>
      </div>

      <button onClick={handleSubmit} style={{ padding: "10px 20px", fontSize: "16px" }}>
        שלח בקשת וואטסאפ
      </button>

      {/* טבלת זמינות בוקר */}
      <h2 style={{ marginTop: "50px" }}>זמינות חדרים 08:00–15:00</h2>
      <table border="1" style={{ width: "100%", textAlign: "center", borderCollapse: "collapse", marginBottom: "40px" }}>
        <thead>
          <tr>
            <th>חדר\יום</th>
            <th>ראשון</th>
            <th>שני</th>
            <th>שלישי</th>
            <th>רביעי</th>
            <th>חמישי</th>
            <th>שישי</th>
          </tr>
        </thead>
        <tbody>
          {morningSchedule.map((room, i) => (
            <tr key={i}>
              <td>חדר {i + 1}</td>
              {room.map((name, j) => (
                <td key={j}>{name}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* טבלת זמינות אחה"צ */}
      <h2>זמינות חדרים 15:00 והלאה</h2>
      <table border="1" style={{ width: "100%", textAlign: "center", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>חדר\יום</th>
            <th>ראשון</th>
            <th>שני</th>
            <th>שלישי</th>
            <th>רביעי</th>
            <th>חמישי</th>
            <th>שישי</th>
          </tr>
        </thead>
        <tbody>
          {afternoonSchedule.map((room, i) => (
            <tr key={i}>
              <td>חדר {i + 1}</td>
              {room.map((name, j) => (
                <td key={j}>{name}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
