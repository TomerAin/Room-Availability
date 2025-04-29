import { useState, useEffect } from "react";

const defaultRoomPsychologists = {
  1: ["דנה", "יואב", "מיכל"],
  2: ["עדי", "רונית", "אבי"],
  3: ["ליאור", "חגית", "נועה"],
  4: ["תומר", "שירה", "אביגיל"],
  5: ["אורי", "נעם", "גילי"],
  6: ["מאיה", "עמרי", "איילת"],
  7: ["טל", "דניאלה", "עמית"],
  8: ["רוני", "גיתית", "שאול"],
};

const rooms = [1, 2, 3, 4, 5, 6, 7, 8];
const days = ["ראשון", "שני", "שלישי", "רביעי", "חמישי"];
const parts = ["8:00–15:00", "15:00–22:00"];

function App() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [room, setRoom] = useState("");
  const [schedule, setSchedule] = useState(() => JSON.parse(localStorage.getItem("roomSchedule") || "{}"));
  const [editMode, setEditMode] = useState(false);
  const [password, setPassword] = useState("");
  const [showManage, setShowManage] = useState(false);
  const [roomPsychologists, setRoomPsychologists] = useState(() =>
    JSON.parse(localStorage.getItem("roomPsychologists") || JSON.stringify(defaultRoomPsychologists))
  );
  const [selectedManageRoom, setSelectedManageRoom] = useState(1);
  const [newPsychologist, setNewPsychologist] = useState("");

  useEffect(() => {
    localStorage.setItem("roomSchedule", JSON.stringify(schedule));
  }, [schedule]);

  useEffect(() => {
    localStorage.setItem("roomPsychologists", JSON.stringify(roomPsychologists));
  }, [roomPsychologists]);

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
    const options = roomPsychologists[roomNum] || [];
    const current = schedule[key] || "";

    const newValue = prompt(
      `בחר פסיכולוג לחדר ${roomNum} ביום ${day} (${parts[partIndex]}):\n\n${options.join(", ")}`,
      current
    );

    if (newValue === null) return;

    if (options.includes(newValue)) {
      setSchedule((prev) => ({ ...prev, [key]: newValue }));
    } else if (newValue.trim() === "") {
      setSchedule((prev) => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });
    } else {
      alert("השם לא מופיע ברשימת הפסיכולוגים של החדר הזה.");
    }
  };

  const handleLogin = () => {
    if (password === "admin123") {
      setEditMode(true);
      setPassword("");
    } else {
      alert("סיסמה שגויה");
    }
  };

  const addPsychologist = () => {
    if (!newPsychologist.trim()) return;
    setRoomPsychologists((prev) => ({
      ...prev,
      [selectedManageRoom]: [...(prev[selectedManageRoom] || []), newPsychologist.trim()],
    }));
    setNewPsychologist("");
  };

  const removePsychologist = (name) => {
    setRoomPsychologists((prev) => ({
      ...prev,
      [selectedManageRoom]: prev[selectedManageRoom].filter((p) => p !== name),
    }));
  };

  return (
    <div dir="rtl" style={{ fontFamily: "Arial", textAlign: "center", padding: "20px" }}>
      <h1>חדר פנוי בשניים 3?</h1>

      {/* בקשת וואטסאפ */}
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
      {!showManage && (
        <>
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
                          const current = schedule[key] || "";
                          return (
                            <td
                              key={day}
                              onClick={() => handleCellClick(day, roomNum, partIndex)}
                              style={{
                                cursor: editMode ? "pointer" : "default",
                                padding: "5px",
                                backgroundColor: editMode ? "#f0f0f0" : "white",
                              }}
                            >
                              {current}
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
        </>
      )}

      {/* כפתורי ניהול */}
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
          <>
            <p style={{ color: "green" }}>מצב עריכה פעיל</p>
            <button onClick={() => setShowManage(!showManage)} style={{ marginTop: "10px" }}>
              {showManage ? "חזרה לטבלה" : "ניהול פסיכולוגים קבועים"}
            </button>
          </>
        )}
      </div>

      {/* מסך ניהול פסיכולוגים */}
      {editMode && showManage && (
        <div style={{ marginTop: "30px", maxWidth: "400px", marginInline: "auto", textAlign: "right" }}>
          <h3>ניהול פסיכולוגים קבועים</h3>
          <label>בחר חדר: </label>
          <select value={selectedManageRoom} onChange={(e) => setSelectedManageRoom(Number(e.target.value))}>
            {rooms.map((r) => (
              <option key={r} value={r}>חדר {r}</option>
            ))}
          </select>

          <ul style={{ paddingRight: "20px" }}>
            {(roomPsychologists[selectedManageRoom] || []).map((name) => (
              <li key={name}>
                {name}
                <button
                  onClick={() => removePsychologist(name)}
                  style={{ marginRight: "10px", color: "red", background: "none", border: "none", cursor: "pointer" }}
                >
                  מחק
                </button>
              </li>
            ))}
          </ul>

          <input
            type="text"
            value={newPsychologist}
            onChange={(e) => setNewPsychologist(e.target.value)}
            placeholder="הוסף פסיכולוג חדש"
          />
          <button onClick={addPsychologist} style={{ marginRight: "10px" }}>הוסף</button>
        </div>
      )}
    </div>
  );
}

export default App;
