// App.jsx
import React, { useEffect, useState } from "react";
import { saveData, subscribeToData } from "./firebase";
import AdminPanel from "./AdminPanel";

function App() {
  const [psychologists, setPsychologists] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    subscribeToData("psychologists", (data) => {
      if (data) setPsychologists(data);
    });
  }, []);

  const handleAddPsychologist = (room, name) => {
    const updated = {
      ...psychologists,
      [room]: [...(psychologists[room] || []), { name }],
    };
    setPsychologists(updated);
    saveData("psychologists", updated);
  };

  const toggleAdmin = () => {
    setIsAdmin(!isAdmin);
  };

  return (
    <div>
      <h1>מערכת שיבוץ חדרים</h1>
      <button onClick={toggleAdmin}>
        {isAdmin ? "צא ממצב מנהל" : "כניסה כמנהל"}
      </button>

      <h2>רשימת חדרים</h2>
      {Object.entries(psychologists).map(([room, list]) => (
        <div key={room} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
          <strong>חדר {room}</strong>
          <ul>
            {list.map((p, i) => (
              <li key={i}>{p.name}</li>
            ))}
          </ul>
        </div>
      ))}

      {isAdmin && (
        <AdminPanel
          psychologists={psychologists}
          onAddPsychologist={handleAddPsychologist}
        />
      )}
    </div>
  );
}

export default App;
