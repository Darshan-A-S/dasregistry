# dasregistry

React + TypeScript component library — Nothing Phone edition, dot-matrix type, red accents.

Components are unstyled until you import the shared stylesheet once:

```tsx
import "dasregistry/style.css";
```

## Components

### Button

- Two variants — **primary** (solid) and **muted** (ghost).
- Sits on the native `<button>`, so focus, keyboard, `disabled`, and form submission just work.

### DatePicker

- Click-to-open calendar with month navigation; picks dates as `YYYY-MM-DD`.
- Built-in `label`, `error` (also marks `aria-invalid`), and `disabled` states.

### Loader

- Rotating status phrases — cycle your own words, or pin it to a running background process with `current` and it updates instantly.
- Light sweep across the text plus growing dots; screen-reader friendly and reduced-motion aware.

## Installing

```bash
npm install dasregistry
```

## Source

[GitHub — Darshan-A-S/dasregistry](https://github.com/Darshan-A-S/dasregistry)

## Doc Links

<!-- add-your-links-here -->