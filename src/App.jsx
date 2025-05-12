import { useEffect, useState } from "react";
import "./App.css";
import "./customStyles.css";
import { saveAssignments, savePsychologists, subscribeToData } from "./firebase";

function App() {
  const [assignments, setAssignments] = useState({});
  const [psychologists, setPsychologists] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [newPsychologistName, setNewPsychologistName] = useState("");
  const [room, setRoom] = useState("");
  const [hour, setHour] = useState("");
  const [date, setDate] = useState("");

  const days = ["ראשון", "שני", "שלישי", "רביעי", "חמישי"];
  const rooms = ["1", "2", "3"];
  const hours = [
    { label: "08:00-15:00", key: "morning" },
    { label: "15:00-22:00", key: "afternoon" },
  ];

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

  const toggleAdmin = () => {
    const password = prompt("הזן סיסמה:");
    if (password === "1234") {
      setIsAdmin(true);
    }
  };

  const handleSavePsychologist = (roomNum, name, phone) => {
    setPsychologists((prev) => {
      const updated = { ...prev };
      if (!updated[roomNum]) updated[roomNum] = [];
      if (!updated[roomNum].some((p) => p.name === name)) {
        updated[roomNum].push({ name, phone });
        savePsychologists(updated);
      }
      return updated;
    });
  };

  const handleRemovePsychologist = (roomNum, name) => {
    setPsychologists((prev) => {
      const updated = { ...prev };
      updated[roomNum] = updated[roomNum].filter((p) => p.name !== name);
      savePsychologists(updated);
      return updated;
    });
  };

  const handleSelectPsychologist = (roomNum, day, hourSlot, name) => {
    setAssignments((prev) => {
      const updated = { ...prev };
      if (!updated[roomNum]) updated[roomNum] = {};
      if (!updated[roomNum][day]) updated[roomNum][day] = {};
      updated[roomNum][day][hourSlot] = name;
      saveAssignments(updated);
      return updated;
    });
  };

  const validatePhone = (phone) => /^0\d{8,9}$/.test(phone);

  return (
    <div className="app">
      <div className="backdrop" onClick={() => setSelectedRoom(null)} style={{ display: selectedRoom !== null ? 'block' : 'none' }} />
      <header className="header">
        <h1>חדר פנוי בשניים 3?</h1>
        <button onClick={toggleAdmin} className="admin-toggle">
          כניסת מנהל
        </button>
      </header>

      <table>
        <thead>
          <tr>
            <th>חדר</th>
            {days.map((day) => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rooms.map((roomNum) => (
            hours.map((slot) => (
              <tr key={`${roomNum}-${slot.key}`}>
                <td onClick={() => setSelectedRoom(roomNum)}>
                  {`חדר ${roomNum}`} {psychologists[roomNum]?.length > 0 && <span title="יש פסיכולוגים קבועים">📋</span>}
                </td>
                {days.map((day) => (
                  <td key={day}>
                    {isAdmin ? (
                      <div className="select-wrapper">
                        <span className="icon">{slot.key === "morning" ? "📅" : "⏰"}</span>
                        <select
                          onChange={(e) => handleSelectPsychologist(roomNum, day, slot.key, e.target.value)}
                          value={assignments[roomNum]?.[day]?.[slot.key] || ""}
                        >
                          <option value="">בחר</option>
                          {(psychologists[roomNum] || []).map((p) => (
                            <option key={p.name + p.phone} value={p.name}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      assignments[roomNum]?.[day]?.[slot.key] || "-"
                    )}
                  </td>
                ))}
              </tr>
            ))
          ))}
        </tbody>
      </table>

      {selectedRoom && (
        <div className="popup">
          <h2>פסיכולוגים קבועים בחדר {selectedRoom}</h2>

          {isAdmin && (
            <>
              <input
                type="text"
                placeholder="שם הפסיכולוג"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const name = e.target.value.trim();
                    if (name) {
                      const phone = prompt("הזן מספר טלפון (כולל קידומת)");
                      if (phone && validatePhone(phone)) {
                        handleSavePsychologist(selectedRoom, name, phone);
                        e.target.value = "";
                      } else {
                        alert("מספר טלפון לא תקין");
                      }
                    }
                  }
                }}
              />
            </>
          )}

          <ul>
            {(psychologists[selectedRoom] || []).map((p) => (
              <li key={p.name}>
                {`${p.name} (${p.phone})`}
                {isAdmin && (
                  <button onClick={() => handleRemovePsychologist(selectedRoom, p.name)}>מחק</button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
