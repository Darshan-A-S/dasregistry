import { useState } from "react";
import type { CSSProperties } from "react";
import { createRoot } from "react-dom/client";
import { Button, DatePicker, Loader, registry } from "../index";
import "../style.css";

const heading: CSSProperties = {
  fontFamily: "'Doto', monospace",
  fontSize: 14,
  letterSpacing: 4,
  textTransform: "uppercase",
};

function Pane({ scheme }: { scheme: "light" | "dark" }) {
  const [date, setDate] = useState("2026-08-10");
  const [birthday, setBirthday] = useState("");
  const isDark = scheme === "dark";
  const bg = isDark ? "#0a0a0a" : "#ffffff";
  const text = isDark ? "#f5f5f6" : "#18181b";
  const muted = "#7c7c80";
  return (
    <div
      style={{
        flex: 1,
        background: bg,
        color: text,
        colorScheme: scheme,
        padding: "3rem 2rem",
        overflow: "auto",
      }}
    >
      <h1 style={{ fontFamily: "'Doto', monospace", fontSize: 22, letterSpacing: 8, textTransform: "uppercase" }}>
        dasregistary
      </h1>
      <p style={{ color: muted, fontSize: 12, letterSpacing: 3, textTransform: "uppercase" }}>
        Nothing phone edition · {scheme}
      </p>

      <h2 style={heading}>Registry</h2>
      <ul style={{ color: muted, fontSize: 13, lineHeight: 2 }}>
        {Object.keys(registry).map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>

      <h2 style={heading}>Button</h2>
      <Button variant="primary">Primary</Button> <Button variant="muted">Muted</Button>{" "}
      <Button disabled>Disabled</Button>

      <h2 style={heading}>DatePicker</h2>
      <DatePicker label="Due date" value={date} onChange={setDate} />
      <br />
      <DatePicker label="Birthday" value={birthday} onChange={setBirthday} error={birthday ? undefined : "This field is required"} />

      <h2 style={heading}>Loader</h2>
      <Loader />
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <div style={{ display: "flex", height: "100vh", fontFamily: "'Space Mono', monospace" }}>
    <Pane scheme="light" />
    <Pane scheme="dark" />
  </div>
);