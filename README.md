# dasregistry

React + TypeScript component registry.

## Install

```bash
npm install dasregistry
```

Components are unstyled until you load the stylesheet (Nothing Phone theme: black screen, dot-matrix font, red accents):

```tsx
import "dasregistry/style.css";
```

## Usage

```tsx
import { Button, getComponent } from "dasregistry";

// deep import (tree-shakeable)
import { DatePicker } from "dasregistry/DatePicker";
```

## Registry

```tsx
const Btn = getComponent("Button");
```

## Adding a component

Drop `X.tsx` in `src/components/` and add it to `src/components/registry.ts`.
Build with `npm run build`, publish with `npm publish`.
