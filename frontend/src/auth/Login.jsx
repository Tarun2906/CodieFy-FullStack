import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [dark, setDark] = useState(true);

  // 🔐 Auto redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && token !== "undefined") {
      navigate("/dashboard", { replace: true });
    }
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      localStorage.setItem("token", res.data.token);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle(dark)}>
      <div style={cardStyle(dark)}>
        {/* HEADER */}
        <div style={headerStyle}>
          <h1 style={titleStyle}>🚀 CodieFy</h1>
          <button onClick={() => setDark(!dark)} style={toggleBtn}>
            {dark ? "☀ Light" : "🌙 Dark"}
          </button>
        </div>

        <p style={subtitleStyle}>
          Login to review your code with AI
        </p>

        {/* FORM */}
        <form onSubmit={submitHandler} style={{ marginTop: "20px" }}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle(dark)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle(dark)}
          />

          <button type="submit" style={btnStyle} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={footerText(dark)}>
          Don’t have an account?{" "}
          <Link to="/register" style={linkStyle}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const pageStyle = (dark) => ({
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: dark
    ? "linear-gradient(135deg, #020617, #0f172a)"
    : "linear-gradient(135deg, #e2e8f0, #f8fafc)",
});

const cardStyle = (dark) => ({
  width: "100%",
  maxWidth: "380px",
  background: dark ? "#020617" : "#ffffff",
  padding: "32px",
  borderRadius: "14px",
  boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
  color: dark ? "#e5e7eb" : "#0f172a",
});

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const titleStyle = {
  fontSize: "26px",
  fontWeight: "800",
};

const subtitleStyle = {
  textAlign: "center",
  fontSize: "14px",
  marginTop: "10px",
  opacity: 0.8,
};

const toggleBtn = {
  padding: "6px 10px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  fontWeight: "600",
};

const inputStyle = (dark) => ({
  width: "100%",
  padding: "12px",
  marginTop: "14px",
  borderRadius: "8px",
  border: dark ? "1px solid #1e293b" : "1px solid #cbd5f5",
  background: dark ? "#020617" : "#f8fafc",
  color: dark ? "#e5e7eb" : "#0f172a",
  outline: "none",
  fontSize: "14px",
});

const btnStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "20px",
  borderRadius: "10px",
  border: "none",
  background: "#2563eb",
  color: "white",
  fontWeight: "700",
  fontSize: "15px",
  cursor: "pointer",
};

const footerText = (dark) => ({
  marginTop: "18px",
  textAlign: "center",
  fontSize: "14px",
  color: dark ? "#94a3b8" : "#475569",
});

const linkStyle = {
  color: "#2563eb",
  fontWeight: "600",
  textDecoration: "none",
};
