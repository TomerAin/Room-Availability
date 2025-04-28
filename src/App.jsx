// src/App.jsx
import { useState, useEffect } from "react";

const emptySchedule = Array(8).fill().map(() => Array(6).fill(""));

function App() {
  const [morningSchedule, setMorningSchedule] = useState(emptySchedule);
  const [afternoonSchedule, setAfternoonSchedule] = useState(emptySchedule);

  const [timeOfDay, setTimeOfDay] = useState("morning");
  const [roomIndex, setRoomIndex] = useState(0);
  const [dayIndex, setDayIndex] = useState(0);
  const [employeeName, setEmployeeName] = useState("");

  const [date, setDate] = useState("");
  const [room, setRoom] = useState("");

  // קריאה מה-localStorage
  useEffect(() => {
    const storedMorning = localStorage.getItem("morningSchedule");
    const storedAfternoon = localStorage.getItem("afternoonSchedule");

    if (storedMorning) {
      setMorningSchedule(JSON.parse(storedMorning));
    }
    if (storedAfternoon) {
      setAfternoonSchedule(JSON.parse(storedAfternoon));
    }
  }, []);

  const saveToStorage = (morning, afternoon) => {
    localStorage.setItem("morningSchedule", JSON.stringify(morning));
    localStorage.setItem("afternoonSchedule", JSON.stringify(afternoon));
  };

  const handleUpdate = () => {
    if (!employeeName) {
      alert("נא למלא שם עובד");
      return;
    }

    let newSchedule;
    if (timeOfDay === "morning") {
      newSchedule = [...morningSchedule];
      newSchedule[roomIndex][dayIndex] = employeeName;
      setMorningSchedule(newSchedule);
      saveToStorage(newSchedule, afternoonSchedule);
    } else {
      newSchedule = [...afternoonSchedule];
      newSchedule[roomIndex][dayIndex] = employeeName;
      setAfternoonSchedule(newSchedule);
      saveToStorage(morningSchedule, newSchedule);
    }

    setEmployeeName("");
  };

  const handleReset = () => {
    if (window.confirm("האם אתה בטוח שברצונך לאפס את כל הנתונים?")) {
      setMorningSchedule(emptySchedule);
      setAfternoonSchedule(emptySchedule);
      saveToStorage(emptySchedule, emptySchedule);
    }
  };

  const handleSubmitWhatsapp = () => {
    if (!date || !room) {
      alert("אנא מלא את כל השדות");
      return;
    }
    const message = `שלום, האם חדר ${room} פנוי בתאריך ${date}?`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, "_blank");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "30px", fontFamily: "Arial", direction: "rtl" }}>
      <h1>חדר פנוי בשניים 3?</h1>

      {/* טופס שליחת בקשת וואטסאפ */}
      <div style={{ margin: "20px", background: "#e0f7fa", padding: "20px", borderRadius: "10px", display: "inline-block" }}>
        <h2>שליחת בקשת וואטסאפ</h2>
        <div style={{ marginBottom: "10px" }}>
          <label>בחר תאריך: </label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>בחר חדר: </label>
          <select value={room} onChange={(e) => setRoom(e.target.value)}>
            <option value="">בחר חדר</option>
            {Array.from({ length: 8 }, (_, i) => (
              <option key={i} value={i + 1}>חדר {i + 1}</option>
            ))}
          </select>
        </div>
        <button onClick={handleSubmitWhatsapp} style={{ padding: "10px 20px", fontSize: "16px" }}>
          שלח בקשת וואטסאפ
        </button>
      </div>

      {/* טופס ניהול עובדים בחדרים */}
      <div style={{ margin: "20px", background: "#f5f5f5", padding: "20px", borderRadius: "10px", display: "inline-block" }}>
        <h2>ניהול עובדים בחדרים</h2>
        <div style={{ marginBottom: "10px" }}>
          <label>בחר זמן ביום: </label>
          <select value={timeOfDay} onChange={(e) => setTimeOfDay(e.target.value)}>
            <option value="morning">08:00–15:00</option>
            <option value="afternoon">15:00 והלאה</option>
          </select>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>בחר חדר: </label>
          <select value={roomIndex} onChange={(e) => setRoomIndex(Number(e.target.value))}>
            {Array.from({ length: 8 }, (_, i) => (
              <option key={i} value={i}>חדר {i + 1}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>בחר יום: </label>
          <select value={dayIndex} onChange={(e) => setDayIndex(Number(e.target.value))}>
            <option value={0}>ראשון</option>
            <option value={1}>שני</option>
            <option value={2}>שלישי</option>
            <option value={3}>רביעי</option>
            <option value={4}>חמישי</option>
            <option value={5}>שישי</option>
          </select>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="שם עובד"
            value={employeeName}
            onChange={(e) => setEmployeeName(e.target.value)}
            style={{ padding: "5px" }}
          />
          <button onClick={handleUpdate} style={{ marginRight: "10px", padding: "5px 15px" }}>
            שמור
          </button>
        </div>

        <button onClick={handleReset} style={{ background: "red", color: "white", padding: "5px 15px", border: "none", borderRadius: "5px" }}>
          אפס את כל הנתונים
        </button>
      </div>

      {/* טבלאות הצגה */}
      <h2 style={{ marginTop: "40px" }}>זמינות חדרים 08:00–15:00</h2>
      <table border="1" style={{ width: "90%", margin: "auto", textAlign: "center", borderCollapse: "collapse", marginBottom: "40px" }}>
        <thead style={{ background: "#e0e0e0" }}>
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

      <h2 style={{ marginTop: "40px" }}>זמינות חדרים 15:00 והלאה</h2>
      <table border="1" style={{ width: "90%", margin: "auto", textAlign: "center", borderCollapse: "collapse" }}>
        <thead style={{ background: "#e0e0e0" }}>
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
