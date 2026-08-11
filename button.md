# Button

Wrapper around the native `<button>` with two visual variants. Inherits all native button behavior (disabled, focus, keyboard) for free.

```tsx
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button disabled>Disabled</Button>
```

```tsx
export function ButtonDemo() {
  return (
    <div className="flex flex-col gap-4">
      <Button variant="primary">Save changes</Button>

      <Button variant="secondary">Cancel</Button>

      <Button variant="secondary">Retry</Button>

      <Button onClick={() => console.log("clicked")}>Custom action</Button>

      <Button disabled>Unavailable</Button>
    </div>
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

      ```tsx title="components/button.tsx"
      import type { ButtonHTMLAttributes } from "react";

      export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
        variant?: "primary" | "secondary";
      }

      export function Button({ variant = "primary", className, ...props }: ButtonProps) {
        return <button className={`das-btn das-btn-${variant} ${className ?? ""}`.trim()} {...props} />;
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
import { Button } from "@/components/button"
```

```tsx
<Button variant="secondary" onClick={() => setSubmitting(false)}>
  Cancel
</Button>
```

`variant` switches between the solid primary style and the dashed secondary style. Everything else passes straight through to the native `<button>`: `onClick`, `type`, `disabled`, `aria-label`, `className`, and so on.

## API reference

### ButtonProps

<TypeTable
  id="type-table-button.ts-ButtonProps"
  type={{
  "id": "button.ts-ButtonProps",
  "name": "ButtonProps",
  "description": "",
  "entries": [
    {
      "name": "variant",
      "description": "Visual style: primary (solid) or secondary (dashed).",
      "tags": [],
      "type": "\"primary\" | \"secondary\" | undefined",
      "simplifiedType": "string",
      "required": false,
      "deprecated": false
    }
  ]
}}
/>

`ButtonProps` also includes every native `ButtonHTMLAttributes<HTMLButtonElement>` prop (`onClick`, `type`, `disabled`, `className`, `aria-*`, etc.).

## Behavior

* Sits on top of the native `<button>`, so keyboard focus, `Enter`/`Space` activation, `disabled`, and form submission work out of the box.
* Hovering turns the border and text accent red; pressing nudges the button down 1px.
* `variant` defaults to `"primary"` when omitted.
* Styles come from the shared stylesheet — load `dasregistry/style.css` once per app.


Last updated on August 11, 2026
