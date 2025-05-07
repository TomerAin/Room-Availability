import React, { useEffect, useState } from "react";
import AdminPanel from "./AdminPanel";
import { saveAssignments, savePsychologists, subscribeToData } from "./firebase";

const hoursBefore = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00"];
const hoursAfter = ["15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];
const rooms = ["1", "2", "3", "4"];
const days = ["ראשון", "שני", "שלישי", "רביעי", "חמישי"];

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
      if (isAdmin) saveAssignments(updated);
      return updated;
    });
  };

  const handleAssignPsychologist = (roomNum, name, phone) => {
    setPsychologists((prev) => {
      const updated = { ...prev };
      if (!updated[roomNum]) updated[roomNum] = [];
      if (!updated[roomNum].some((p) => p.name === name)) {
        updated[roomNum].push({ name, phone });
      }
      if (isAdmin) savePsychologists(updated);
      return updated;
    });
  };

  const handleRemovePsychologist = (roomNum, name) => {
    setPsychologists((prev) => {
      const updated = { ...prev };
      updated[roomNum] = updated[roomNum].filter((p) => p.name !== name);
      if (isAdmin) savePsychologists(updated);
      return updated;
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">מערכת שיבוץ חדרים</h1>
      <div className="mb-4">
        <label className="mr-2">הזן קוד מנהל:</label>
        <input
          type="password"
          onChange={(e) => setIsAdmin(e.target.value === "1234")}
          className="border p-1"
        />
      </div>
      {rooms.map((roomNum) => (
        <div key={roomNum} className="mb-8">
          <h2 className="text-xl font-semibold mb-2">חדר {roomNum}</h2>
          {isAdmin && (
            <AdminPanel
              roomNum={roomNum}
              psychologists={psychologists[roomNum] || []}
              onAssign={handleAssignPsychologist}
              onRemove={handleRemovePsychologist}
            />
          )}
          <div className="grid grid-cols-2 gap-4">
            <RoomTable
              title="8:00–15:00"
              hours={hoursBefore}
              days={days}
              roomNum={roomNum}
              assignments={assignments[roomNum] || {}}
              psychologists={psychologists[roomNum] || []}
              onSelect={handleSelectPsychologist}
              isAdmin={isAdmin}
            />
            <RoomTable
              title="15:00–21:00"
              hours={hoursAfter}
              days={days}
              roomNum={roomNum}
              assignments={assignments[roomNum] || {}}
              psychologists={psychologists[roomNum] || []}
              onSelect={handleSelectPsychologist}
              isAdmin={isAdmin}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
