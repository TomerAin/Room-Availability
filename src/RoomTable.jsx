// RoomTable.jsx
import React from "react";

const days = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי"];

function RoomTable({ hoursSlot, rooms, assignments, psychologists, isAdmin, onAssign, onRoomClick }) {
  return (
    <div className="table-section">
      <h2>{hoursSlot.label}</h2>
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
                onClick={() => onRoomClick(roomNum)}
              >
                {`חדר ${roomNum}`}
              </td>
              {days.map((day) => (
                <td key={day}>
                  {isAdmin ? (
                    <select
                      onChange={(e) =>
                        onAssign(roomNum, day, hoursSlot.key, e.target.value)
                      }
                      value={
                        assignments[roomNum]?.[day]?.[hoursSlot.key] || ""
                      }
                    >
                      <option value="">בחר</option>
                      {(psychologists[roomNum] || []).map((p) => (
                        <option key={p.name} value={p.name}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    assignments[roomNum]?.[day]?.[hoursSlot.key] || "-"
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RoomTable;
