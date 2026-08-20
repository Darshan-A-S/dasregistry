import { useEffect, useId, useRef, useState } from "react";

export interface DatePickerProps {
  label?: string;
  value?: string; // YYYY-MM-DD, or "START,END" in range mode
  onChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
  range?: boolean;
}

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const pad = (n: number) => String(n).padStart(2, "0");

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {dir === "left" ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 18l6-6-6-6" />}
    </svg>
  );
}

export function DatePicker({ label, value, onChange, error, disabled, range }: DatePickerProps) {
  const inputId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(() => new Date());
  const [mode, setMode] = useState<"days" | "months" | "years">("days");
  const [anchor, setAnchor] = useState<string | null>(null);
  const [rangeEnd, setRangeEnd] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [adjustTarget, setAdjustTarget] = useState<string | null>(null);
  const anchorSetDown = useRef(false);

  useEffect(() => {
    if (!range) return;
    if (!open) {
      setAnchor(null);
      setRangeEnd(null);
      setDragging(false);
      setAdjustTarget(null);
      anchorSetDown.current = false;
      return;
    }
    if (!dragging) return;
    function onUp() {
      if (adjustTarget && rangeParts) {
        const [a, b] = adjust(rangeParts, adjustTarget);
        commitRange(a, b);
        setDragging(false);
        return;
      }
      if (anchor == null) {
        setDragging(false);
        return;
      }
      setDragging(false);
      if (rangeEnd === anchor && anchorSetDown.current) {
        anchorSetDown.current = false;
        return;
      }
      commitRange(anchor, rangeEnd ?? anchor);
    }
    window.addEventListener("pointerup", onUp);
    return () => window.removeEventListener("pointerup", onUp);
  }, [range, open, dragging, anchor, rangeEnd, adjustTarget]);

  function commitRange(a: string, b: string) {
    const start = a < b ? a : b;
    const end = a < b ? b : a;
    onChange?.(`${start},${end}`);
    setAnchor(null);
    setRangeEnd(null);
    setAdjustTarget(null);
  }

  function adjust(parts: string[], d: string): [string, string] {
    const [lo, hi] = parts;
    if (d < lo) return [d, hi];
    if (d > hi) return [lo, d];
    const distLo = Math.abs(new Date(d).getTime() - new Date(lo).getTime());
    const distHi = Math.abs(new Date(hi).getTime() - new Date(d).getTime());
    return distLo <= distHi ? [d, hi] : [lo, d];
  }

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const year = view.getFullYear();
  const month = view.getMonth();
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

  const cells: (number | null)[] = [
    ...Array.from({ length: new Date(year, month, 1).getDay() }, () => null),
    ...Array.from({ length: daysInMonth(year, month) }, (_, i) => i + 1),
  ];

  function select(day: number) {
    onChange?.(`${year}-${pad(month + 1)}-${pad(day)}`);
    setOpen(false);
  }

  function beginRange(day: number) {
    const d = `${year}-${pad(month + 1)}-${pad(day)}`;
    if (anchor == null && rangeParts) {
      setAdjustTarget(d);
    } else if (anchor == null) {
      anchorSetDown.current = true;
      setAnchor(d);
      setRangeEnd(d);
    } else {
      setRangeEnd(d);
    }
    setDragging(true);
  }

  function hoverRange(day: number) {
    const d = `${year}-${pad(month + 1)}-${pad(day)}`;
    if (adjustTarget) setAdjustTarget(d);
    else if (anchor) setRangeEnd(d);
  }

  const formatDate = (s: string) =>
    new Date(`${s}T00:00:00`).toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const rangeParts = range && value && value.includes(",") ? value.split(",") : null;
  const current = (() => {
    if (anchor && rangeEnd) return anchor < rangeEnd ? [anchor, rangeEnd] : [rangeEnd, anchor];
    if (adjustTarget && rangeParts) return adjust(rangeParts, adjustTarget);
    return rangeParts;
  })();
  const display = rangeParts
    ? `${formatDate(rangeParts[0])} – ${formatDate(rangeParts[1])}`
    : value
      ? formatDate(value)
      : "";

  function dayMeta(day: number) {
    const ds = `${year}-${pad(month + 1)}-${pad(day)}`;
    const lo = current?.[0] ?? null;
    const hi = current?.[1] ?? null;
    const inSel = !!lo && !!hi && lo <= ds && ds <= hi;
    const isBound = range ? inSel && (ds === lo || ds === hi) : false;
    return {
      ds,
      inRange: range ? inSel : false,
      isStart: range && isBound && ds === lo && lo !== hi,
      isEnd: range && isBound && ds === hi && lo !== hi,
      isSingle: range && isBound && lo === hi,
      isSelected: !range && value === ds,
    };
  }

  return (
    <div className="das-dp" ref={rootRef}>
      {label && (
        <label className="das-dp-label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <div className="das-dp-input-wrap">
        <input
          id={inputId}
          className="das-dp-input"
          readOnly
          disabled={disabled}
          value={display}
          placeholder="pick a date"
          aria-invalid={error ? true : undefined}
          onClick={() => {
            const next = !open;
            if (next) setMode("days");
            setOpen(next);
          }}
          onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
        />
        <svg
          className="das-dp-chevron"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
      <div className={open ? "das-dp-panel das-dp-open" : "das-dp-panel"}>
          <div className="das-dp-header">
            <button
              type="button"
              aria-label={mode === "days" ? "Previous month" : mode === "months" ? "Previous year" : "Previous decade"}
              onClick={() => {
                if (mode === "days") setView(new Date(year, month - 1, 1));
                else if (mode === "months") setView(new Date(year - 1, month, 1));
                else setView(new Date(year - 12, month, 1));
              }}
            >
              <Chevron dir="left" />
            </button>
            <button type="button" className="das-dp-title" onClick={() => setMode(mode === "days" ? "years" : mode === "years" ? "months" : "days")}>
              {mode === "days"
                ? view.toLocaleDateString(undefined, { month: "long", year: "numeric" })
                : mode === "months"
                  ? String(year)
                  : `${Math.floor(year / 10) * 10}-${Math.floor(year / 10) * 10 + 9}`}
            </button>
            <button
              type="button"
              aria-label={mode === "days" ? "Next month" : mode === "months" ? "Next year" : "Next decade"}
              onClick={() => {
                if (mode === "days") setView(new Date(year, month + 1, 1));
                else if (mode === "months") setView(new Date(year + 1, month, 1));
                else setView(new Date(year + 12, month, 1));
              }}
            >
              <Chevron dir="right" />
            </button>
          </div>
          {mode === "months" ? (
            <div key={`${mode}-${year}`} className="das-dp-grid das-dp-grid-wide">
              {MONTHS.map((name, i) => (
                <button
                  type="button"
                  key={name}
                  className={["das-dp-month", month === i && "das-dp-month-current"].filter(Boolean).join(" ")}
                  onClick={() => {
                    setView(new Date(year, i, 1));
                    setMode("days");
                  }}
                >
                  {name}
                </button>
              ))}
            </div>
          ) : mode === "years" ? (
            <div key={`${mode}-${Math.floor(year / 10) * 10}`} className="das-dp-grid das-dp-grid-wide">
              {Array.from({ length: 12 }, (_, i) => Math.floor(year / 10) * 10 - 1 + i).map((y) => (
                <button
                  type="button"
                  key={y}
                  className={["das-dp-year", y === year && "das-dp-year-current"].filter(Boolean).join(" ")}
                  onClick={() => {
                    setView(new Date(y, month, 1));
                    setMode("months");
                  }}
                >
                  {y}
                </button>
              ))}
            </div>
          ) : (
            <div key={`${mode}-${year}-${month}`} className="das-dp-grid">
              {WEEKDAYS.map((d, i) => (
                <span className="das-dp-dow" key={i}>
                  {d}
                </span>
              ))}
              {cells.map((day, i) =>
                day === null ? (
                  <span key={i} />
                ) : (() => {
                  const m = dayMeta(day);
                  return (
                    <button
                      type="button"
                      key={i}
                      className={[
                        "das-dp-day",
                        m.isStart && "das-dp-day-range-start",
                        m.isEnd && "das-dp-day-range-end",
                        m.isSingle && "das-dp-day-range-single",
                        m.inRange && "das-dp-day-in-range",
                        m.isSelected && "das-dp-day-selected",
                        todayStr === m.ds && "das-dp-day-today",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      onClick={() => !range && select(day)}
                      onPointerDown={
                        range
                          ? (e) => {
                              e.preventDefault();
                              beginRange(day);
                            }
                          : undefined
                      }
                      onPointerEnter={range ? () => hoverRange(day) : undefined}
                    >
                      {day}
                    </button>
                  );
                })()
              )}
            </div>
          )}
      </div>
      {error && <span className="das-dp-error">{error}</span>}
    </div>
  );
}
