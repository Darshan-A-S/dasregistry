import { useRef, useState } from "react";
import type { CSSProperties } from "react";
import { createRoot } from "react-dom/client";
import { Button, CheckpointRail, DatePicker, Loader, registry } from "../index";
import "../style.css";

const heading: CSSProperties = {
  fontFamily: "'Doto', monospace",
  fontSize: 14,
  letterSpacing: 4,
  textTransform: "uppercase",
};

const CHECKPOINTS = [
  { id: "cp1", label: "I want to build a React component library. Where do I even start?", at: 0 },
  { id: "cp2", label: "What toolchain should I use for the build?", at: 2 },
  { id: "cp3", label: "How do I theme it so it doesn't clash with consumer apps?", at: 4 },
  { id: "cp4", label: "How do consumers import the styles?", at: 6 },
  { id: "cp5", label: "What about the DatePicker — what can it do that a native input can't?", at: 8 },
  { id: "cp6", label: "How do I ship a demo so people can preview the components?", at: 10 },
  { id: "cp7", label: "That checkpoint rail is slick. How does it actually work?", at: 12 },
  { id: "cp8", label: "How do I version and publish without breaking anyone?", at: 14 },
  { id: "cp9", label: "What should the docs look like for each component?", at: 16 },
  { id: "cp10", label: "Walk me through the very first release.", at: 18 },
];

const CHAT = [
  { role: "user", text: "I want to build a React component library. Where do I even start?" },
  { role: "ai", text: "Start with a registry pattern. Build one small component, wire a shared exports index, and ship a single stylesheet. The registry is the contract that makes a component library safe to grow — consumers import from the top level and never touch the internals, so you can re-arrange internals freely without breaking anyone." },
  { role: "user", text: "What toolchain should I use for the build?" },
  { role: "ai", text: "TypeScript plus tsup. tsup reads your source once and emits ESM, CJS, and .d.ts type files from the same entry — no separate compile steps and no hand-written declarations. Vite hosts the demo app so you can eyeball every component, and the build script copies the stylesheet into dist. One config file covers the whole pipeline." },
  { role: "user", text: "How do I theme it so it doesn't clash with consumer apps?" },
  { role: "ai", text: "Theming is the part most people get wrong. Scope every class behind a das- prefix so your styles never collide, and define the color tokens once at the top. Lean on CSS light-dark() so a single stylesheet adapts to light and dark mode automatically — consumers just set color-scheme and the whole kit follows." },
  { role: "user", text: "How do consumers import the styles?" },
  { role: "ai", text: "One shared stylesheet, imported exactly once per app: import \"dasregistry/style.css\". No CSS-in-JS, no scoped styles, no per-component imports to forget. Because every class is prefixed, the only way consumer styles and library styles fight is if a consumer deliberately overrides your tokens — which is a feature, not a bug." },
  { role: "user", text: "What about the DatePicker — what can it do that a native input can't?" },
  { role: "ai", text: "Native date inputs give you a picker but zero personality and no range. This one ships month, year, and decade navigation, a range mode you can drag across days, and a Nothing-style look that matches your brand. The value stays a plain YYYY-MM-DD string, so your forms and storage don't care how fancy the UI is." },
  { role: "user", text: "How do I ship a demo so people can preview the components?" },
  { role: "ai", text: "Run a Vite app that renders every component side by side in light and dark mode, with a registry listing so the demo doubles as documentation. Each component gets a section, a state example, and the actual props it accepts. It's the fastest way for a reviewer to say \"that looks right\" without reading a line of source." },
  { role: "user", text: "That checkpoint rail is slick. How does it actually work?" },
  { role: "ai", text: "Every user prompt becomes a checkpoint — a small horizontal line in a rail on the right edge of the chat. Hover a line to see the prompt snippet, click to scroll straight to that part of the conversation, and the line under whatever you're reading glows red as you scroll. It's a table of contents for a long thread." },
  { role: "user", text: "How do I version and publish without breaking anyone?" },
  { role: "ai", text: "Semver discipline is your safety net. Bump the version for every change, keep main, module, and types pointed at dist, and only run npm publish after a green build. Tag every release and keep a short changelog so you can always answer the question \"what changed since last week\" in ten seconds." },
  { role: "user", text: "What should the docs look like for each component?" },
  { role: "ai", text: "One markdown page per component: a live demo snippet at the top, an install section with copy-paste code, a table of every prop with its type, and a behavior list covering keyboard support and edge cases. If the demo is honest and the table is complete, the docs basically write themselves." },
  { role: "user", text: "Walk me through the very first release." },
  { role: "ai", text: "Run the build, copy the stylesheet into dist, bump to 0.1.0, tag it, and publish. Then open the demo, click through every component in light and dark mode, and fix anything that feels off before telling anyone. The first release is a contract with your users — make it boring and correct." },
];

const REPLIES = [
  "Got it — I've noted that down.",
  "Interesting. Tell me more.",
  "Makes sense. Want me to walk through the next step?",
  "On it. Anything else?",
];

function ChatDemo({ scheme }: { scheme: "light" | "dark" }) {
  const [current, setCurrent] = useState("cp1");
  const [messages, setMessages] = useState(CHAT);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const msgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const replyIdx = useRef(0);
  const isDark = scheme === "dark";
  const border = isDark ? "#262628" : "#e4e4e7";
  const surface = isDark ? "#101012" : "#f6f6f7";
  const text = isDark ? "#f5f5f6" : "#18181b";
  const bubble = isDark ? "#1a1a1c" : "#ffffff";

  function send() {
    const t = input.trim();
    if (!t) return;
    const reply = REPLIES[replyIdx.current % REPLIES.length];
    replyIdx.current += 1;
    setMessages((m) => [...m, { role: "user", text: t }, { role: "ai", text: reply }]);
    setInput("");
    requestAnimationFrame(() => {
      const el = scrollRef.current;
      if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    });
  }

  function pick(id: string) {
    const at = CHECKPOINTS.find((c) => c.id === id)?.at;
    const el = scrollRef.current;
    const node = at != null ? msgRefs.current[at] : null;
    if (!el || !node) return;
    const top = node.getBoundingClientRect().top - el.getBoundingClientRect().top + el.scrollTop;
    el.scrollTo({ top, behavior: "smooth" });
    setCurrent(id);
  }

  function onScroll() {
    const el = scrollRef.current;
    if (!el) return;
    let found = CHECKPOINTS[0].id;
    for (const c of CHECKPOINTS) {
      const node = msgRefs.current[c.at];
      if (!node) continue;
      const top = node.getBoundingClientRect().top - el.getBoundingClientRect().top;
      if (top <= el.clientHeight / 2) found = c.id;
    }
    setCurrent(found);
  }

  return (
    <div style={{ position: "relative", width: "100%", height: 420 }}>
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="das-chat-no-scrollbar"
        style={{
          height: "100%",
          overflowY: "auto",
          overflowX: "hidden",
          scrollbarWidth: "none",
          border: `1px solid ${border}`,
          borderRadius: 6,
          padding: "1rem 3rem 1rem 1.25rem",
          fontFamily: "'Space Mono', monospace",
        }}
      >
        <div style={{ maxWidth: 420, margin: "0 auto" }}>
          {messages.map((m, i) => (
          <div
            key={i}
            ref={(el) => {
              msgRefs.current[i] = el;
            }}
            style={{
              background: m.role === "user" ? surface : bubble,
              border: `1px solid ${m.role === "user" ? "#ff0015" : border}`,
              borderRadius: 6,
              padding: "8px 12px",
              fontSize: 12,
              lineHeight: 1.6,
              color: text,
              margin: "0 0 8px",
              marginLeft: m.role === "user" ? "auto" : 0,
              width: "fit-content",
              maxWidth: "85%",
              overflowWrap: "anywhere",
            }}
          >
            {m.text}
          </div>
        ))}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          right: 4,
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          alignItems: "center",
          background: isDark ? "rgba(16,16,18,0.7)" : "rgba(246,246,247,0.7)",
          borderRadius: 6,
          padding: "6px 0",
        }}
      >
        <CheckpointRail
          items={CHECKPOINTS.map((c) => ({ id: c.id, label: c.label }))}
          currentId={current}
          onSelect={pick}
        />
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Type a message..."
          style={{
            flex: 1,
            background: bubble,
            border: `1px solid ${border}`,
            borderRadius: 6,
            color: text,
            padding: "8px 12px",
            fontSize: 12,
            fontFamily: "'Space Mono', monospace",
            outline: "none",
          }}
        />
        <Button variant="primary" onClick={send}>
          Send
        </Button>
      </div>
    </div>
  );
}

function Pane({ scheme }: { scheme: "light" | "dark" }) {
  const [date, setDate] = useState("");
  const [birthday, setBirthday] = useState("");
  const [stay, setStay] = useState("");
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
        overflowY: "auto",
        overflowX: "hidden",
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
      <br />
      <DatePicker label="Stay dates" range value={stay} onChange={setStay} />

      <h2 style={heading}>Loader</h2>
      <Loader />

      <h2 style={heading}>CheckpointRail</h2>
      <ChatDemo scheme={scheme} />
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <>
    <style>{`.das-chat-no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Space Mono', monospace" }}>
      <Pane scheme="light" />
      <Pane scheme="dark" />
    </div>
  </>
);