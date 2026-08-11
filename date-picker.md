# Date Picker

Calendar popover for picking a single date. Controlled via `value`/`onChange` in `YYYY-MM-DD`, with label, error, and disabled states.

```tsx
import { useState } from "react"

import { DatePicker } from "@/components/date-picker"

export default function DatePickerDemo() {
  const [dueDate, setDueDate] = useState("2026-08-10")
  return (
    <DatePicker
      label="Due date"
      value={dueDate}
      onChange={setDueDate}
    />
  )
}
```

```tsx
import { useState } from "react"

import { DatePicker } from "@/components/date-picker"

export function DatePickerStates() {
  const [date, setDate] = useState("")
  return (
    <div className="flex flex-col gap-4">
      <DatePicker label="Trip date" value={date} onChange={setDate} />

      <DatePicker
        label="Birthday"
        value={date}
        onChange={setDate}
        error={date ? undefined : "This field is required"}
      />

      <DatePicker label="Expires" value={date} onChange={setDate} disabled />
    </div>
  )
}
```

## Installation

<CodeTabs>
  <TabsListInstallType />

  <TabsContent value="cli">
    ```bash
    npm install dasregistary
    ```

    Import the stylesheet (Nothing Phone theme: black screen, dot-matrix font, red accents):

    ```tsx
    import "dasregistary/style.css";
    ```
  </TabsContent>

  <TabsContent value="manual">
    <Steps>
      <Step>Install the following dependencies</Step>

      The component has no dependencies beyond `react` and `react-dom`.

      <Step>Copy and paste the following code into your project</Step>

      ```tsx title="components/date-picker.tsx"
      "use client"

      import { useEffect, useId, useRef, useState } from "react";

      export interface DatePickerProps {
        label?: string;
        value?: string; // YYYY-MM-DD
        onChange?: (value: string) => void;
        error?: string;
        disabled?: boolean;
      }

      const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
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

      export function DatePicker({ label, value, onChange, error, disabled }: DatePickerProps) {
        const inputId = useId();
        const rootRef = useRef<HTMLDivElement>(null);
        const [open, setOpen] = useState(false);
        const [view, setView] = useState(() => new Date());

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
        }

        const display = value
          ? new Date(`${value}T00:00:00`).toLocaleDateString(undefined, {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "";

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
                onClick={() => setOpen((o) => !o)}
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
            {open && (
              <div className="das-dp-panel">
                <div className="das-dp-header">
                  <button type="button" aria-label="Previous month" onClick={() => setView(new Date(year, month - 1, 1))}>
                    <Chevron dir="left" />
                  </button>
                  <span>{view.toLocaleDateString(undefined, { month: "long", year: "numeric" })}</span>
                  <button type="button" aria-label="Next month" onClick={() => setView(new Date(year, month + 1, 1))}>
                    <Chevron dir="right" />
                  </button>
                </div>
                <div className="das-dp-grid">
                  {WEEKDAYS.map((d, i) => (
                    <span className="das-dp-dow" key={i}>
                      {d}
                    </span>
                  ))}
                  {cells.map((day, i) =>
                    day === null ? (
                      <span key={i} />
                    ) : (
                      <button
                        type="button"
                        key={i}
                        className={[
                          "das-dp-day",
                          value === `${year}-${pad(month + 1)}-${pad(day)}` && "das-dp-day-selected",
                          todayStr === `${year}-${pad(month + 1)}-${pad(day)}` && "das-dp-day-today",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        onClick={() => select(day)}
                      >
                        {day}
                      </button>
                    ),
                  )}
                </div>
              </div>
            )}
            {error && <span className="das-dp-error">{error}</span>}
          </div>
        );
      }
      ```

      <Step>Style the component</Step>

      The component is unstyled until you load the stylesheet:

      ```tsx
      import "dasregistary/style.css";
      ```

      <Step>Update the import paths to match your project setup</Step>
    </Steps>
  </TabsContent>
</CodeTabs>

## Usage

```tsx
import { DatePicker } from "@/components/date-picker"
```

```tsx
const [date, setDate] = useState("")

<DatePicker
  label="Due date"
  value={date}
  onChange={setDate}
/>
```

Pass a `value` of `YYYY-MM-DD` to control the selected date; `onChange` fires with the new date string whenever a day is picked. An `error` string renders under the input and marks it `aria-invalid`. The input is read-only — typing is not supported.

## API reference

### DatePickerProps

<TypeTable
  id="type-table-date-picker.ts-DatePickerProps"
  type={{
  "id": "date-picker.ts-DatePickerProps",
  "name": "DatePickerProps",
  "description": "",
  "entries": [
    {
      "name": "label",
      "description": "Label rendered above the input. Hidden when omitted.",
      "tags": [],
      "type": "string | undefined",
      "simplifiedType": "string",
      "required": false,
      "deprecated": false
    },
    {
      "name": "value",
      "description": "Selected date as YYYY-MM-DD. Uncontrolled when omitted.",
      "tags": [],
      "type": "string | undefined",
      "simplifiedType": "string",
      "required": false,
      "deprecated": false
    },
    {
      "name": "onChange",
      "description": "Called with the selected date (YYYY-MM-DD).",
      "tags": [],
      "type": "((value: string) => void) | undefined",
      "simplifiedType": "function",
      "required": false,
      "deprecated": false
    },
    {
      "name": "error",
      "description": "Error message rendered under the input; also sets aria-invalid.",
      "tags": [],
      "type": "string | undefined",
      "simplifiedType": "string",
      "required": false,
      "deprecated": false
    },
    {
      "name": "disabled",
      "description": "Disables the input.",
      "tags": [],
      "type": "boolean | undefined",
      "simplifiedType": "boolean",
      "required": false,
      "deprecated": false
    }
  ]
}}
/>

## Behavior

* Click the input to toggle the calendar; click outside or press `Escape` to close.
* Use the chevrons to move between months.
* Today is highlighted; the selected date is filled with the accent color.
* Reuses the native `<input>` so label click, keyboard focus, and disabled semantics come for free.


Last updated on August 11, 2026
