import React, { useState, useEffect } from "react";
import { saveAssignments, subscribeToData, savePsychologists } from "./firebase";

const rooms = ["1", "2", "3"];
const days = ["ראשון", "שני", "שלישי", "רביעי", "חמישי"];
const hours = ["8:00–15:00", "15:00 ואילך"];

export default function App() {
  const [assignments, setAssignments] = useState({});
  const [psychologists, setPsychologists] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    subscribeToData("assignments", (data) => {
      if (data) setAssignments(data);
    });
    subscribeToData("psychologists", (data) => {
      if (data) setPsychologists(data);
    });
  }, []);

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

  const handleAssignPsychologist = (roomNum, name, phone) => {
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

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">שיבוץ חדרים</h1>

      <label className="mb-2 block">
        <input
          type="checkbox"
          checked={isAdmin}
          onChange={(e) => setIsAdmin(e.target.checked)}
        />
        מצב מנהל
      </label>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {rooms.map((roomNum) => (
          <div key={roomNum} className="border rounded-xl p-4 shadow">
            <h2 className="text-lg font-semibold mb-2">חדר {roomNum}</h2>

            {/* הצגת הפסיכולוגים הקבועים גם למשתמש רגיל */}
            <div className="mb-2">
              <strong>פסיכולוגים קבועים:</strong>
              <ul className="list-disc list-inside">
                {(psychologists[roomNum] || []).map((p, i) => (
                  <li key={i}>{p.name} ({p.phone})</li>
                ))}
              </ul>
            </div>

            {isAdmin && (
              <div className="mb-2">
                <input
                  type="text"
                  placeholder="שם פסיכולוג"
                  id={`name-${roomNum}`}
                  className="border p-1 mr-2"
                />
                <input
                  type="text"
                  placeholder="טלפון"
                  id={`phone-${roomNum}`}
                  className="border p-1 mr-2"
                />
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                  onClick={() =>
                    handleAssignPsychologist(
                      roomNum,
                      document.getElementById(`name-${roomNum}`).value,
                      document.getElementById(`phone-${roomNum}`).value
                    )
                  }
                >
                  הוסף פסיכולוג
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 gap-2">
              {days.map((day) => (
                <div key={day}>
                  <h3 className="font-semibold">{day}</h3>
                  {hours.map((hourSlot) => (
                    <div key={hourSlot} className="mb-1">
                      <label>
                        {hourSlot}:
                        <select
                          className="ml-2 border"
                          value={
                            assignments[roomNum]?.[day]?.[hourSlot] || ""
                          }
                          onChange={(e) =>
                            handleSelectPsychologist(
                              roomNum,
                              day,
                              hourSlot,
                              e.target.value
                            )
                          }
                          disabled={!isAdmin}
                        >
                          <option value="">בחר</option>
                          {(psychologists[roomNum] || []).map((p, i) => (
                            <option key={i} value={p.name}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
