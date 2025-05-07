// AdminPanel.jsx
import React, { useState } from "react";

function AdminPanel({ psychologists, onAddPsychologist }) {
  const [room, setRoom] = useState("");
  const [name, setName] = useState("");

  const handleAdd = () => {
    if (room && name) {
      onAddPsychologist(room, name);
      setName("");
    }
  };

  return (
    <div className="admin-panel">
      <h2>ניהול פסיכולוגים</h2>
      <div className="form-group">
        <label>חדר:</label>
        <input
          type="number"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>שם פסיכולוג:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <button onClick={handleAdd}>הוסף</button>

      <h3>רשימת פסיכולוגים לפי חדר:</h3>
      <ul>
        {Object.entries(psychologists).map(([roomNum, list]) => (
          <li key={roomNum}>
            חדר {roomNum}:{" "}
            {list.map((p) => p.name).join(", ") || "אין פסיכולוגים"}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminPanel;
