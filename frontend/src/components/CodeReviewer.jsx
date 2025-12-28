import { useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";

/* 🔹 Language list */
const LANGUAGES = [
  { label: "Java", value: "java" },
  { label: "Python", value: "python" },
  { label: "C++", value: "cpp" },
  { label: "JavaScript", value: "javascript" },
  { label: "TypeScript", value: "typescript" },
  { label: "Go", value: "go" },
  { label: "SQL", value: "sql" }
];

/* 🔹 Auto starter syntax templates */
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
  typescript: `const message: string = "Hello CodieFy";
console.log(message);`,
  go: `package main

import "fmt"

func main() {
    fmt.Println("Hello CodieFy")
}`,
  sql: `SELECT * FROM users;`
};

export default function CodeReviewer()
 {
  const [language, setLanguage] = useState("java");
  const [code, setCode] = useState(CODE_TEMPLATES["java"]);
  const [output, setOutput] = useState("");
  const [dark, setDark] = useState(true);
  const [loading, setLoading] = useState(false);

  const reviewCode = async () => {
    if (!code.trim()) {
      alert("Please write some code first!");
      return;
    }

    setLoading(true);
    setOutput("");

    try {
      const res = await axios.post("http://localhost:5000/api/review", {
        code,
        language
      });

      setOutput(res.data.result || "No response from AI.");
    } catch (err) {
      console.error(err);
      setOutput("❌ Error while reviewing code. Please check your backend or API key.");
    } finally {
      setLoading(false);
    }
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    alert("Copied to clipboard ✅");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: dark ? "#0f172a" : "#f8fafc",
        color: dark ? "#e5e7eb" : "#0f172a",
        display: "flex",
        justifyContent: "center",
        padding: "40px"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1100px",
          background: dark ? "#020617" : "#ffffff",
          borderRadius: "14px",
          padding: "24px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.25)"
        }}
      >
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "18px"
          }}
        >
          <h1 style={{ fontSize: "26px", fontWeight: "bold" }}>
            🚀 CodieFy – AI Code Reviewer
          </h1>

          <button onClick={() => setDark(!dark)} style={btnStyle}>
            {dark ? "☀ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>

        {/* CONTROLS */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginBottom: "14px"
          }}
        >
          <select
            value={language}
            onChange={(e) => {
              const lang = e.target.value;
              setLanguage(lang);
              setCode(CODE_TEMPLATES[lang] || "");
            }}
            style={selectStyle}
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>

          <button onClick={reviewCode} style={primaryBtn} disabled={loading}>
            {loading ? "Reviewing..." : "Review Code"}
          </button>
        </div>

        {/* EDITOR */}
        <Editor
          height="360px"
          language={language}
          value={code}
          onChange={(v) => setCode(v || "")}
          theme={dark ? "vs-dark" : "light"}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            automaticLayout: true
          }}
        />

        {/* OUTPUT */}
        {output && (
          <div
            style={{
              marginTop: "22px",
              background: dark ? "#020617" : "#f1f5f9",
              padding: "16px",
              borderRadius: "12px",
              whiteSpace: "pre-wrap"
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <h3>🧠 AI Review Result</h3>
              <button onClick={copyOutput} style={btnStyle}>
                📋 Copy
              </button>
            </div>

            <p style={{ marginTop: "12px", lineHeight: "1.6" }}>
              {output}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* 🔹 Styles */
const btnStyle = {
  padding: "8px 14px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  fontWeight: "600"
};

const primaryBtn = {
  ...btnStyle,
  background: "#2563eb",
  color: "white"
};

const selectStyle = {
  padding: "8px",
  borderRadius: "8px",
  fontWeight: "600"
};
