function App() {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Room Availability</h1>
      <p>Check the available rooms below:</p>

      <h2>זמינות חדרים 08:00–15:00</h2>
      <table border="1" style={{ width: "100%", textAlign: "center", borderCollapse: "collapse", marginBottom: "40px" }}>
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
          <tr><td>חדר 1</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
          <tr><td>חדר 2</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
          <tr><td>חדר 3</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
          <tr><td>חדר 4</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
          <tr><td>חדר 5</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
          <tr><td>חדר 6</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
          <tr><td>חדר 7</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
          <tr><td>חדר 8</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
        </tbody>
      </table>

      <h2>זמינות חדרים 15:00 והלאה</h2>
      <table border="1" style={{ width: "100%", textAlign: "center", borderCollapse: "collapse" }}>
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
          <tr><td>חדר 1</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
          <tr><td>חדר 2</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
          <tr><td>חדר 3</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
          <tr><td>חדר 4</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
          <tr><td>חדר 5</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
          <tr><td>חדר 6</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
          <tr><td>חדר 7</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
          <tr><td>חדר 8</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
        </tbody>
      </table>
    </div>
  );
}

export default App;

