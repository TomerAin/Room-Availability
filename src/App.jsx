import { useEffect, useState } from "react";
import "./App.css";

const days = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי"];
const rooms = [1, 2, 3, 4, 5, 6, 7, 8];
const hoursSlots = [
  { label: "8:00–15:00", key: "morning" },
  { label: "15:00–22:00", key: "evening" },
];

function App() {
  const [assignments, setAssignments] = useState(
    JSON.parse(localStorage.getItem("assignments")) || {}
  );
  const [psychologists, setPsychologists] = useState(
    JSON.parse(localStorage.getItem("psychologists")) || {}
  );
  const [selectedPsychologist, setSelectedPsychologist] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [date, setDate] = useState("");
  const [room, setRoom] = useState("");
  const [hour, setHour] = useState("");

  useEffect(() => {
    localStorage.setItem("assignments", JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem("psychologists", JSON.stringify(psychologists));
  }, [psychologists]);

  const toggleAdmin = () => {
    const password = prompt("הזן סיסמה:");
    if (password === "1234") {
      setIsAdmin((prev) => !prev);
    } else {
      alert("סיסמה לא נכונה");
    }
  };

  const handleAssignPsychologist = (roomNum, name, phone) => {
    setPsychologists((prev) => {
      const updated = { ...prev };
      if (!updated[roomNum]) updated[roomNum] = [];
      if (!updated[roomNum].some((p) => p.name === name)) {
        updated[roomNum].push({ name, phone });
      }
      return updated;
    });
  };

  const handleSelectPsychologist = (roomNum, day, hourSlot, name) => {
    setAssignments((prev) => {
      const updated = { ...prev };
      if (!updated[roomNum]) updated[roomNum] = {};
      if (!updated[roomNum][day]) updated[roomNum][day] = {};
      updated[roomNum][day][hourSlot] = name;
      return updated;
    });
  };

  const handleSendRequest = () => {
    if (!date || !room || !hour) {
      alert("אנא מלא את כל השדות");
      return;
    }
    const recipients = psychologists[room] || [];
    if (recipients.length === 0) {
      alert("לא נמצאו אנשי קשר לחדר זה");
      return;
    }
    const message = `שלום, האם חדר ${room} פנוי בתאריך ${date} בשעה ${hour}?`;
    const encodedMessage = encodeURIComponent(message);
    recipients.forEach((person) => {
      window.open(`https://wa.me/${person.phone}?text=${encodedMessage}`, "_blank");
    });
  };

  return (
    <div className="app">
      <header className="header">
        <h1>חדר פנוי בשניים 3?</h1>
        <button onClick={toggleAdmin} className="admin-toggle">
          {isAdmin ? "יציאה ממצב מנהל" : "הזדהות כמנהל"}
        </button>
      </header>

      <div className="request-form">
        <h2>שליחת בקשת וואטסאפ</h2>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <select value={room} onChange={(e) => setRoom(e.target.value)}>
          <option value="">בחר חדר</option>
          {rooms.map((r) => (
            <option key={r} value={r}>{`חדר ${r}`}</option>
          ))}
        </select>
        <input
          type="time"
          value={hour}
          onChange={(e) => setHour(e.target.value)}
        />
        <button onClick={handleSendRequest}>שלח בקשה</button>
      </div>

      <div className="tables">
        {hoursSlots.map((slot) => (
          <div key={slot.key} className="table-section">
            <h2>{slot.label}</h2>
            <table>
              <thead>
                <tr>
                  <th>חדר \ יום</th>
                  {days.map((day) => (
                    <th key={day}>{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rooms.map((roomNum) => (
                  <tr key={roomNum}>
                    <td>{`חדר ${roomNum}`}</td>
                    {days.map((day) => (
                      <td key={day}>
                        {isAdmin ? (
                          <div
                            onClick={() => {
                              const name = prompt("הזן את שם הפסיכולוג:");
                              if (name) {
                                const phone = prompt("הזן מספר טלפון (כולל קידומת):");
                                if (phone) handleAssignPsychologist(roomNum, name, phone);
                              }
                            }}
                          >
                            {assignments[roomNum]?.[day]?.[slot.key] || "-"}
                          </div>
                        ) : (
                          assignments[roomNum]?.[day]?.[slot.key] || "-"
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
