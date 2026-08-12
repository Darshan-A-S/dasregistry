import { useEffect, useState } from "react";

const DEFAULT_PHRASES = [
  "Thinking",
  "Searching",
  "Reading",
  "Reasoning",
  "Reviewing",
  "Drafting",
  "Editing",
  "Writing",
  "Coding",
  "Debugging",
  "Refactoring",
  "Analyzing",
  "Generating",
  "Polishing",
];

export interface LoaderProps {
  phrases?: string[];
  interval?: number;
  current?: string;
}

export function Loader({ phrases = DEFAULT_PHRASES, interval = 4000, current }: LoaderProps) {
  const [i, setI] = useState(0);
  const [dots, setDots] = useState(3);

  useEffect(() => {
    if (current !== undefined) return;
    const t = setInterval(() => setI((x) => (x + 1) % phrases.length), interval);
    return () => clearInterval(t);
  }, [phrases.length, interval, current]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setDots((d) => (d + 1) % 4), 400);
    return () => clearInterval(t);
  }, []);

  const text = current ?? phrases[i];

  return (
    <div className="das-loader" role="status" aria-live="polite">
      <span className="das-loader-phrase">
        <span className="das-loader-shine" aria-hidden="true">
          {text}
          {".".repeat(dots)}
        </span>
        {text}
        {".".repeat(dots)}
      </span>
    </div>
  );
}