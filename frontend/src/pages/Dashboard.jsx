import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import axios from "axios";

const LANGUAGES = [
  { label: "Java", value: "java" },
  { label: "Python", value: "python" },
  { label: "C++", value: "cpp" },
  { label: "JavaScript", value: "javascript" },
  { label: "TypeScript", value: "typescript" },
  { label: "Go", value: "go" },
  { label: "SQL", value: "sql" }
];

const CODE_TEMPLATES = {
  java: `public class Main {
  public static void main(String[] args) {
    System.out.println("Hello CodieFy");
  }
}`,
  python: `def main():
    print("Hello CodieFy")

main()`,
  cpp: `#include <iostream>
using namespace std;

int main() {
  cout << "Hello CodieFy";
  return 0;
}`,
  javascript: `console.log("Hello CodieFy");`,
  typescript: `const msg: string = "Hello CodieFy";
console.log(msg);`,
  go: `package main
import "fmt"
func main() {
  fmt.Println("Hello CodieFy")
}`,
  sql: `SELECT * FROM users;`
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [dark, setDark] = useState(true);
  const [language, setLanguage] = useState("java");
  const [code, setCode] = useState(CODE_TEMPLATES.java);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const goHistory = () => {
    navigate("/history");
  };

  const reviewCode = async () => {
    setLoading(true);
    setOutput("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/review",
        { code, language },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      setOutput(res.data.result);
    } catch {
      setOutput("❌ Error while reviewing code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={page(dark)}>
      <div style={card(dark)}>
        {/* HEADER */}
        <div style={header}>
          <h2>🚀 CodieFy Editor</h2>

          <div>
            <button onClick={() => setDark(!dark)} style={btn}>
              {dark ? "☀ Light" : "🌙 Dark"}
            </button>

            <button onClick={goHistory} style={btn}>
              📜 History
            </button>

            <button onClick={logout} style={logoutBtn}>
              Logout
            </button>
          </div>
        </div>

        {/* CONTROLS */}
        <div style={controls}>
          <select
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value);
              setCode(CODE_TEMPLATES[e.target.value]);
            }}
          >
            {LANGUAGES.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>

          <button onClick={reviewCode} style={primaryBtn}>
            {loading ? "Reviewing..." : "Review Code"}
          </button>
        </div>

        {/* EDITOR */}
        <Editor
          height="350px"
          language={language}
          value={code}
          theme={dark ? "vs-dark" : "light"}
          onChange={(v) => setCode(v || "")}
          options={{ minimap: { enabled: false } }}
        />

        {/* OUTPUT */}
        {output && (
          <div style={outputBox(dark)}>
            <h3>🧠 AI Review</h3>
            <pre>{output}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const page = (dark) => ({
  minHeight: "100vh",
  background: dark ? "#0f172a" : "#f8fafc",
  padding: "30px"
});

const card = (dark) => ({
  maxWidth: "1200px",
  margin: "auto",
  background: dark ? "#020617" : "#ffffff",
  padding: "20px",
  borderRadius: "14px"
});

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};

const controls = {
  display: "flex",
  gap: "12px",
  margin: "14px 0"
};

const btn = {
  marginRight: "8px",
  padding: "6px 12px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600"
};

const logoutBtn = {
  ...btn,
  background: "#dc2626",
  color: "white"
};

const primaryBtn = {
  ...btn,
  background: "#2563eb",
  color: "white"
};

const outputBox = (dark) => ({
  marginTop: "20px",
  background: dark ? "#020617" : "#f1f5f9",
  padding: "14px",
  borderRadius: "10px",
  whiteSpace: "pre-wrap",
  overflowX: "auto"
});
