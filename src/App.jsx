import { useEffect, useState } from "react";
import "./App.css";
import "./customStyles.css";
import { saveAssignments, savePsychologists, subscribeToData } from "./firebase";

const days = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי"];
const rooms = [1, 2, 3, 4, 5, 6, 7, 8];
const hoursSlots = [
  { label: "8:00–15:00", key: "morning" },
  { label: "15:00–22:00", key: "evening" },
];

function App() {
  const [assignments, setAssignments] = useState({});
  const [psychologists, setPsychologists] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [date, setDate] = useState("");
  const [room, setRoom] = useState("");
  const [hour, setHour] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [newPsychologistName, setNewPsychologistName] = useState("");

  useEffect(() => {
    subscribeToData("assignments", (data) => {
      if (data) setAssignments(data);
    });
    subscribeToData("psychologists", (data) => {
      if (data) setPsychologists(data);
    });

    const today = new Date().toISOString().split("T")[0];
    setDate(today);
  }, []);

  useEffect(() => {
    saveAssignments(assignments);
  }, [assignments]);

  useEffect(() => {
    savePsychologists(psychologists);
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
      updated[roomNum].push({ name, phone });
      return updated;
    });
  };

  const handleRemovePsychologist = (roomNum, name) => {
    setPsychologists((prev) => {
      const updated = { ...prev };
      updated[roomNum] = updated[roomNum].filter((p) => p.name !== name);
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

  const handleRoomClick = (roomNum) => {
    setSelectedRoom(roomNum);
  };

  const handleSavePsychologist = (roomNum, name, phone) => {
    handleAssignPsychologist(roomNum, name, phone);
    setSelectedRoom(null);
  };

  const validatePhone = (phone) => /^0\d{8,9}$/.test(phone);

  return (
    <div className="app">
      <div className="backdrop" onClick={() => setSelectedRoom(null)} style={{ display: selectedRoom !== null ? 'block' : 'none' }} />
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
        <input type="time" value={hour} onChange={(e) => setHour(e.target.value)} />
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
                    <td
                      style={{ cursor: "pointer" }}
                      onClick={() => handleRoomClick(roomNum)}
                    >
                      {`חדר ${roomNum}`} {psychologists[roomNum]?.length > 0 && <span title="יש פסיכולוגים קבועים">📋</span>}
                    </td>
                    {days.map((day) => (
                      <td key={day} className="cell-content">
                        {isAdmin ? (
                          <select
                            onChange={(e) =>
                              handleSelectPsychologist(roomNum, day, slot.key, e.target.value)
                            }
                            value={assignments[roomNum]?.[day]?.[slot.key] || ""}
                          >
                            <option value="">בחר</option>
                            {(psychologists[roomNum] || []).map((p) => (
                              <option key={p.name + p.phone} value={p.name}>
                                {p.name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span>
                            {assignments[roomNum]?.[day]?.[slot.key] || "לא שובץ"}
                          </span>
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

      {selectedRoom !== null && (
        <div className="modal">
          <div className="modal-content">
            <h2>פסיכולוגים קבועים בחדר {selectedRoom}</h2>

            {isAdmin && (
              <>
                <input
                  type="text"
                  placeholder="שם הפסיכולוג"
                  value={newPsychologistName}
                  onChange={(e) => setNewPsychologistName(e.target.value)}
                />
                <button
                  onClick={() => {
                    const name = newPsychologistName.trim();
                    if (!name) return;
                    const phone = prompt("הזן מספר טלפון (כולל קידומת)");
                    if (phone && validatePhone(phone)) {
                      handleSavePsychologist(selectedRoom, name, phone);
                      setNewPsychologistName("");
                    } else {
                      alert("מספר טלפון לא תקין");
                    }
                  }}
                >
                  הוסף פסיכולוג
                </button>
              </>
            )}

            <ul>
              {(psychologists[selectedRoom] || []).map((p) => (
                <li key={p.name + p.phone}>
                  {`${p.name} (${p.phone})`}
                  {isAdmin && (
                    <button
                      onClick={() => handleRemovePsychologist(selectedRoom, p.name)}
                    >
                      מחק
                    </button>
                  )}
                </li>
              ))}
            </ul>

            <button onClick={() => setSelectedRoom(null)}>סגור</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
