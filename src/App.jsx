// src/App.jsx
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
    // פה אפשר לשים מספר ייעודי, בינתיים זה פותח את וואטסאפ פתוח
    window.open(`https://wa.me/?text=${encodedMessage}`, "_blank");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px", fontFamily: "Arial" }}>
      <h1>חדר פנוי בשניים 3?</h1>
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
  );
}

export default App;
