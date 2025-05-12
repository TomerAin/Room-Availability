import { useEffect, useState } from "react";
import "./App.css";
import "./customStyles.css";
@@ -18,7 +19,6 @@ function App() {
  const [room, setRoom] = useState("");
  const [hour, setHour] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [newPsychologistName, setNewPsychologistName] = useState("");

  useEffect(() => {
    subscribeToData("assignments", (data) => {
@@ -27,19 +27,8 @@ function App() {
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
@@ -53,7 +42,10 @@ function App() {
    setPsychologists((prev) => {
      const updated = { ...prev };
      if (!updated[roomNum]) updated[roomNum] = [];
      updated[roomNum].push({ name, phone });
      if (!updated[roomNum].some((p) => p.name === name)) {
        updated[roomNum].push({ name, phone });
        savePsychologists(updated);
      }
      return updated;
    });
  };
@@ -62,6 +54,7 @@ function App() {
    setPsychologists((prev) => {
      const updated = { ...prev };
      updated[roomNum] = updated[roomNum].filter((p) => p.name !== name);
      savePsychologists(updated);
      return updated;
    });
  };
@@ -72,6 +65,7 @@ function App() {
      if (!updated[roomNum]) updated[roomNum] = {};
      if (!updated[roomNum][day]) updated[roomNum][day] = {};
      updated[roomNum][day][hourSlot] = name;
      saveAssignments(updated);
      return updated;
    });
  };
@@ -102,11 +96,8 @@ function App() {
    setSelectedRoom(null);
  };

  const validatePhone = (phone) => /^0\d{8,9}$/.test(phone);

  return (
    <div className="app">
      <div className="backdrop" onClick={() => setSelectedRoom(null)} style={{ display: selectedRoom !== null ? 'block' : 'none' }} />
      <header className="header">
        <h1>חדר פנוי בשניים 3?</h1>
        <button onClick={toggleAdmin} className="admin-toggle">
@@ -150,25 +141,19 @@ function App() {
                      {`חדר ${roomNum}`} {psychologists[roomNum]?.length > 0 && <span title="יש פסיכולוגים קבועים">📋</span>}
                    </td>
                    {days.map((day) => (
                      <td key={day} className="cell-content">
                      <td key={day}>
                        {isAdmin ? (
                          <select
                            onChange={(e) =>
                              handleSelectPsychologist(roomNum, day, slot.key, e.target.value)
                            }
                            value={assignments[roomNum]?.[day]?.[slot.key] || ""}
                            onChange={(e) => handleSelectPsychologist(roomNum, day, slot.key, e.target.value)}
                            value={(assignments[roomNum]?.[day]?.[slot.key]) || ""}
                          >
                            <option value="">בחר</option>
                            {(psychologists[roomNum] || []).map((p) => (
                              <option key={p.name + p.phone} value={p.name}>
                                {p.name}
                              </option>
                              <option key={p.name} value={p.name}>{p.name}</option>
                            ))}
                          </select>
                        ) : (
                          <span>
                            {assignments[roomNum]?.[day]?.[slot.key] || "לא שובץ"}
                          </span>
                          assignments[roomNum]?.[day]?.[slot.key] || "-"
                        )}
                      </td>
                    ))}
@@ -186,41 +171,28 @@ function App() {
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
              <input
                type="text"
                placeholder="שם הפסיכולוג"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const name = e.target.value.trim();
                    if (name) {
                      const phone = prompt("הזן מספר טלפון (כולל קידומת)");
                      if (phone) handleSavePsychologist(selectedRoom, name, phone);
                      e.target.value = "";
                    }
                  }}
                >
                  הוסף פסיכולוג
                </button>
              </>
                  }
                }}
              />
            )}

            <ul>
              {(psychologists[selectedRoom] || []).map((p) => (
                <li key={p.name + p.phone}>
                <li key={p.name}>
                  {`${p.name} (${p.phone})`}
                  {isAdmin && (
                    <button
                      onClick={() => handleRemovePsychologist(selectedRoom, p.name)}
                    >
                      מחק
                    </button>
                    <button onClick={() => handleRemovePsychologist(selectedRoom, p.name)}>מחק</button>
                  )}
                </li>
              ))}
