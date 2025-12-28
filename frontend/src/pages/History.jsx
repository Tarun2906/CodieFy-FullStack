import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function History() {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/history", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        setHistory(res.data);
      } catch {
        navigate("/login");
      }
    };

    fetchHistory();
  }, []);

  return (
    <div style={{ padding: "30px" }}>
      <h2>📜 Code Review History</h2>

      {history.length === 0 && <p>No history yet</p>}

      {history.map((h) => (
        <div key={h._id} style={card}>
          <b>{h.language.toUpperCase()}</b>
          <pre>{h.result}</pre>
        </div>
      ))}
    </div>
  );
}

const card = {
  background: "#020617",
  padding: "14px",
  marginTop: "12px",
  borderRadius: "10px",
  color: "#e5e7eb"
};
