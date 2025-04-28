import { useState } from "react";

function App() {
  const [date, setDate] = useState("");
  const [room, setRoom] = useState("");

  const handleSubmit = () => {
    if (!date || !room) {
      alert("אנא מלא את כל השדות");
      return;
    }
    const message = `שלום, האם חדר ${room} פנוי בתאריך ${date}?`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, "_blank");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "30px", fontFamily: "Arial, sans-serif", padding: "20px", direction: "rtl" }}>
      <h1>חדר פנוי בשניים 3?</h1>

      {/* טופס בחירת תאריך וחדר */}
      <div style={{ marginBottom: "30px" }}>
        <div style={{ marginBottom: "20px" }}>
          <label>בחר תאריך: </label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label>בחר חדר: </label>
          <select value={room} onChange={(e) => setRoom(e.target.value)}>
            <option value="">בחר חדר</option>
            <option value="1">חדר 1</option>
            <option value="2">חדר 2</option>
            <option value="3">חדר 3</option>
            <option value="4">חדר 4</option>
            <option value="5">חדר 5</option>
            <option value="6">חדר 6</option>
            <option value="7">חדר 7</option>
          </select>
        </div>
        <button onClick={handleSubmit} style={{ padding: "10px 20px", fontSize: "16px" }}>
          שלח בקשת וואטסאפ
        </button>
      </div>

      {/* טבלה זמינות חדרים */}
      <h2>זמינות חדרים שפ"ח (08:00–15:00)</h2>
      <table border="1" style={{ width: "100%", textAlign: "center", borderCollapse: "collapse", marginBottom: "40px", direction: "rtl" }}>
        <thead>
          <tr>
            <th>חדר\יום</th>
            <th>ראשון</th>
            <th>שני</th>
            <th>שלישי</th>
            <th>רביעי</th>
            <th>חמישי</th>
            <th>שישי</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 8 }, (_, i) => (
            <tr key={i}>
              <td>חדר {i + 1}</td>
              <td></td><td></td><td></td><td></td><td></td><td></td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>זמינות חדרים שפ"מ (15:00 והלאה)</h2>
      <table border="1" style={{ width: "100%", textAlign: "center", borderCollapse: "collapse", direction: "rtl" }}>
        <thead>
          <tr>
            <th>חדר\יום</th>
            <th>ראשון</th>
            <th>שני</th>
            <th>שלישי</th>
            <th>רביעי</th>
            <th>חמישי</th>
            <th>שישי</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 8 }, (_, i) => (
            <tr key={i}>
              <td>חדר {i + 1}</td>
              <td></td><td></td><td></td><td></td><td></td><td></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
