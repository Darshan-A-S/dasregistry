import { useState } from "react";
import { createRoot } from "react-dom/client";
import { Button, DatePicker, registry } from "../index";
import "../style.css";

function App() {
  const [date, setDate] = useState("2026-08-10");
  const [birthday, setBirthday] = useState("");
  return (
    <main
      style={{
        fontFamily: "'Space Mono', monospace",
        background: "#ffffff",
        color: "#18181b",
        minHeight: "100vh",
        padding: "3rem 2rem",
        maxWidth: 520,
      }}
    >
      <h1
        style={{
          fontFamily: "'Doto', monospace",
          fontSize: 22,
          letterSpacing: 8,
          textTransform: "uppercase",
        }}
      >
        dasregistary
      </h1>
      <p style={{ color: "#7c7c80", fontSize: 12, letterSpacing: 3, textTransform: "uppercase" }}>
        Nothing phone edition
      </p>

      <h2
        style={{
          fontFamily: "'Doto', monospace",
          fontSize: 14,
          letterSpacing: 4,
          textTransform: "uppercase",
        }}
      >
        Registry
      </h2>
      <ul style={{ color: "#7c7c80", fontSize: 13, lineHeight: 2 }}>
        {Object.keys(registry).map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>

      <h2
        style={{
          fontFamily: "'Doto', monospace",
          fontSize: 14,
          letterSpacing: 4,
          textTransform: "uppercase",
        }}
      >
        Button
      </h2>
      <Button variant="primary">Primary</Button>{" "}
      <Button variant="secondary">Secondary</Button>{" "}
      <Button disabled>Disabled</Button>

      <h2
        style={{
          fontFamily: "'Doto', monospace",
          fontSize: 14,
          letterSpacing: 4,
          textTransform: "uppercase",
        }}
      >
        DatePicker
      </h2>
      <DatePicker label="Due date" value={date} onChange={setDate} />
      <br />
      <DatePicker label="Birthday" value={birthday} onChange={setBirthday} error={birthday ? undefined : "This field is required"} />
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<App />);

