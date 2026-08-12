# Loader

Tells the user something is happening — a status phrase (like Claude's "Thinking / Reviewing / Drafting") with a light sweep and growing dots. Two modes: free-run cycling through your phrases, or pinned to exactly what a background process is doing via `current`. Built for chat apps and long-running tasks.

```tsx
import { Loader } from "@/components/loader"

export function LoaderDemo() {
  return <Loader />
}
```

```tsx
import { Loader } from "@/components/loader"

export function ProcessLoader() {
  const process = "Compiling"
  return <Loader current={process} />
}
```

## Installation

<CodeTabs>
  <TabsListInstallType />

  <TabsContent value="cli">
    ```bash
    npm install dasregistry
    ```

    Import the stylesheet (Nothing Phone theme: black screen, dot-matrix font, red accents):

    ```tsx
    import "dasregistry/style.css";
    ```
  </TabsContent>

  <TabsContent value="manual">
    <Steps>
      <Step>Install the following dependencies</Step>

      The component has no dependencies beyond `react` and `react-dom`.

      <Step>Copy and paste the following code into your project</Step>

      ```tsx title="components/loader.tsx"
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
      ```

      <Step>Style the component</Step>

      The component is unstyled until you load the stylesheet:

      ```tsx
      import "dasregistry/style.css";
      ```

      <Step>Update the import paths to match your project setup</Step>
    </Steps>
  </TabsContent>
</CodeTabs>

## Usage

```tsx
import { Loader } from "@/components/loader"
```

Free-run cycling — good while waiting on something with no progress detail:

```tsx
<Loader />
```

Bring your own phrases:

```tsx
<Loader phrases={["Compiling", "Linking", "Optimizing"]} interval={2000} />
```

Background-process driven — pin the loader to exactly what is running. Pass `current` and the component stops cycling; change it whenever the process state changes and it updates instantly. No timer involved, so pacing follows your process:

```tsx
export function BuildPipeline({ phase }: { phase: string }) {
  return <Loader current={phase} />; // "Compiling", then "Linking", then "Optimizing"
}
```

## API reference

### LoaderProps

<TypeTable
  id="type-table-loader.ts-LoaderProps"
  type={{
  "id": "loader.ts-LoaderProps",
  "name": "LoaderProps",
  "description": "",
  "entries": [
    {
      "name": "phrases",
      "description": "Status words to cycle through in free-run mode.",
      "tags": [],
      "type": "string[] | undefined",
      "simplifiedType": "array",
      "required": false,
      "deprecated": false
    },
    {
      "name": "interval",
      "description": "Milliseconds between phrase swaps in free-run mode.",
      "tags": [],
      "type": "number | undefined",
      "simplifiedType": "number",
      "required": false,
      "deprecated": false
    },
    {
      "name": "current",
      "description": "Pin a single phrase; disables cycling so the loader mirrors whatever your background process is doing. Updates instantly when changed.",
      "tags": [],
      "type": "string | undefined",
      "simplifiedType": "string",
      "required": false,
      "deprecated": false
    }
  ]
}}
/>

## Behavior

* Renders `role="status"` + `aria-live="polite"` — screen readers announce each phrase change; the shine overlay is `aria-hidden`.
* `current` pins the text and disables the cycle timer entirely — the loader is pure prop-driven in that mode, so its pace is set by your process, not `interval`.
* The dots grow every 400ms; they hold as a static `...` for users with `prefers-reduced-motion`.
* Given one phrase in free-run mode, it stays static (no cycling) but still renders.
* Text uses the `Special Elite` typewriter face, falling back through `Story Script`, `Bitcount Ink`, and `Anthropic Serif`. Styles come from the shared stylesheet — load `dasregistry/style.css` once per app.


Last updated on August 13, 2026