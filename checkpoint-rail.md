# CheckpointRail

A vertical rail of small horizontal lines for chat interfaces. Each line is a checkpoint — hover it to see the section label, click to jump straight there. Drop it along the right edge of a chat scroll container.

```tsx
import { useState } from "react"

import { CheckpointRail } from "@/components/checkpoint-rail"

export function CheckpointRailDemo() {
  const [checkpoint, setCheckpoint] = useState("")
  const checkpoints = [
    { id: "intro", label: "Intro" },
    { id: "setup", label: "Project setup" },
    { id: "deploy", label: "Deploy" },
  ]

  return (
    <CheckpointRail
      items={checkpoints}
      currentId={checkpoint}
      onSelect={setCheckpoint}
    />
  )
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

      ```tsx title="components/checkpoint-rail.tsx"
      export interface CheckpointItem {
        id: string;
        label: string;
      }

      export interface CheckpointRailProps {
        items: CheckpointItem[];
        currentId?: string;
        onSelect?: (id: string) => void;
      }

      export function CheckpointRail({ items, currentId, onSelect }: CheckpointRailProps) {
        return (
          <nav className="das-cp" aria-label="Chat checkpoints">
            {items.map((item) => {
              const current = item.id === currentId;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={["das-cp-btn", current && "das-cp-current"].filter(Boolean).join(" ")}
                  aria-label={`Jump to ${item.label}`}
                  aria-current={current ? "true" : undefined}
                  onClick={() => onSelect?.(item.id)}
                >
                  <span className="das-cp-line" aria-hidden="true" />
                  <span className="das-cp-tip">{item.label}</span>
                </button>
              );
            })}
          </nav>
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
import { CheckpointRail } from "@/components/checkpoint-rail"
```

Wire the rail to your chat scroll. When a checkpoint becomes visible (for example via `IntersectionObserver` on your message anchors), update `currentId`; when the user clicks a line, `onSelect` fires and you scroll the anchor into view:

```tsx
const [currentId, setCurrentId] = useState("")

<CheckpointRail
  items={checkpoints}
  currentId={currentId}
  onSelect={(id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
/>
```

## API reference

### CheckpointRailProps

<TypeTable
  id="type-table-checkpoint-rail.ts-CheckpointRailProps"
  type={{
  "id": "checkpoint-rail.ts-CheckpointRailProps",
  "name": "CheckpointRailProps",
  "description": "",
  "entries": [
    {
      "name": "items",
      "description": "The checkpoints, in top-to-bottom order. Each has an id (used for currentId/onSelect) and a label (shown in the hover tooltip). Defaults to an empty list.",
      "tags": [],
      "type": "CheckpointItem[] | undefined",
      "simplifiedType": "array",
      "required": false,
      "deprecated": false
    },
    {
      "name": "currentId",
      "description": "Id of the checkpoint currently visible in the chat; its line renders accent red.",
      "tags": [],
      "type": "string | undefined",
      "simplifiedType": "string",
      "required": false,
      "deprecated": false
    },
    {
      "name": "onSelect",
      "description": "Called with the checkpoint id when a line is clicked.",
      "tags": [],
      "type": "((id: string) => void) | undefined",
      "simplifiedType": "function",
      "required": false,
      "deprecated": false
    }
  ]
}}
/>

## Behavior

* Hovering (or keyboard-focusing) a line grows it, colors it accent red, and slides out a tooltip with the checkpoint label to the left. Clicking fires `onSelect`.
* The current checkpoint is marked with `aria-current` and a red line so the visible position stays readable without hover.
* Tooltips are pure CSS — no JS state, works on touch-outlined focus too.
* Sits on native `<button>` elements, so keyboard tabbing and Enter/Space activation work out of the box.
* Styles come from the shared stylesheet — load `dasregistry/style.css` once per app.


Last updated on August 20, 2026