# dasregistary

React + TypeScript component registry.

## Install

```bash
npm install dasregistary
```

## Usage

```tsx
import { Button } from "dasregistary";
import { getComponent } from "dasregistary";

// deep import (tree-shakeable)
import { Button } from "dasregistary/Button";
```

## Registry

```tsx
const Btn = getComponent("Button");
```

## Adding a component

Drop `X.tsx` in `src/components/` and add it to `src/components/registry.ts`.
Build with `npm run build`, publish with `npm publish`.
