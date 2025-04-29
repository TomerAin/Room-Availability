import { useState, useEffect } from "react";

const initialSchedule = () => {
  const saved = localStorage.getItem("roomSchedule");
  return saved ? JSON.parse(saved) : {};
};

const rooms = [1, 2, 3, 4, 5, 6, 7, 8];
const days = ["ראשון", "שני", "שלישי", "רביעי", "חמישי"];
const parts = ["8:00–15:00", "15:00–22:00"];

function App() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [room, setRoom] = useState("");
  const [schedule, setSchedule] = useState(initialSchedule);
  const [editMode, setEditMode] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    localStorage.setItem("roomSchedule", JSON.stringify(schedule));
  }, [schedule]);

  const handleSubmit = () => {
    if (!date || !room || !time) {
      alert("אנא מלא את כל השדות");
      return;
    }
    const message = `שלום, האם חדר ${room} פנוי בתאריך ${date} בשעה ${time}?`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, "_blank");
  };

  const handleCellClick = (day, roomNum, partIndex) => {
    if (!editMode) return;
    const key = `${day}-${roomNum}-${partIndex}`;
    const newValue = prompt("הכנס/י שם עובד (או השאר ריק למחיקה):", schedule[key] || "");
    setSchedule((prev) => {
      const updated = { ...prev };
      if (newValue) updated[key] = newValue;
      else delete updated[key];
      return updated;
    });
  };

  const handleLogin = () => {
    if (password === "admin123") {
      setEditMode(true);
      setPassword("");
    } else {
      alert("סיסמה שגויה");
    }
  };

  return (
    <div dir="rtl" style={{ fontFamily: "Arial", textAlign: "center", padding: "20px" }}>
      <h1>חדר פנוי בשניים 3?</h1>

      {/* בקשת חדר */}
      <div style={{ marginBottom: "30px" }}>
        <label>בחר תאריך: </label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

        <label style={{ marginRight: "10px" }}>בחר שעה: </label>
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />

        <label style={{ marginRight: "10px" }}>בחר חדר: </label>
        <select value={room} onChange={(e) => setRoom(e.target.value)}>
          <option value="">בחר חדר</option>
          {rooms.map((r) => (
            <option key={r} value={r}>חדר {r}</option>
          ))}
        </select>

        <button onClick={handleSubmit} style={{ marginRight: "15px", padding: "8px 16px", fontSize: "16px" }}>
          שלח בקשת וואטסאפ
        </button>
      </div>

      {/* טבלת חדרים */}
      <h2>זמינות חדרים</h2>
      <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "50px" }}>
        {parts.map((partLabel, partIndex) => (
          <div key={partIndex}>
            <h3>{partLabel}</h3>
            <table border="1" style={{ borderCollapse: "collapse", direction: "rtl", minWidth: "400px" }}>
              <thead>
                <tr>
                  <th>חדר / יום</th>
                  {days.map((day) => (
                    <th key={day}>{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rooms.map((roomNum) => (
                  <tr key={roomNum}>
                    <td>חדר {roomNum}</td>
                    {days.map((day) => {
                      const key = `${day}-${roomNum}-${partIndex}`;
                      return (
                        <td
                          key={day}
                          onClick={() => handleCellClick(day, roomNum, partIndex)}
                          style={{ cursor: editMode ? "pointer" : "default", padding: "5px" }}
                        >
                          {schedule[key] || ""}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {/* מצב עריכה */}
      <div style={{ marginTop: "30px" }}>
        {!editMode ? (
          <>
            <input
              type="password"
              placeholder="הכנס סיסמת עריכה"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin} style={{ marginRight: "10px" }}>כניסה למצב עריכה</button>
          </>
        ) : (
          <p style={{ color: "green" }}>מצב עריכה פעיל</p>
        )}
      </div>
    </div>
  );
}

export default App;
