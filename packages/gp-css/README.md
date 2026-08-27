# `@generatedpixel/gp-css`

> Utility-first CSS engine designed for Generated Pixel design system with native `gp-ui` and `gp-theme` integration.

## Overview

`gp-css` is Generated Pixel's custom CSS framework—combining the flexibility of Tailwind CSS with native token bridges for `gp-theme` and pre-styled UI component helpers for `gp-ui`.

- **Scanner & Compiler**: Lightning-fast JIT scanner extracting utilities from HTML, TS, TSX, JS, JSX, and template files.
- **`gp-theme` Synergy**: Out-of-the-box support for design tokens (`bg-panel`, `text-accent`, `surface-card`, `primary`, `secondary`), glassmorphism (`glass`), glowing effects (`glow`), and custom gradients.
- **`gp-ui` Synergy**: Pre-configured utility classes and variant modifiers (`hover:`, `focus:`, `dark:`, `sm:`, `md:`, `lg:`, `xl:`, `group-hover:`).
- **Directives & @apply**: Full support for `@gp-css theme;`, `@gp-css base;`, `@gp-css components;`, `@gp-css utilities;`, and `@apply`.
- **CLI & Programmatic API**: Use via command line (`npx gp-css build`) or JavaScript/TypeScript compiler exports (`compile()`).

## Installation

```bash
npm install --save-dev @generatedpixel/gp-css
```

## CLI Usage

Initialize configuration:

```bash
npx gp-css init
```

Compile CSS:

```bash
npx gp-css build --minify
```

Watch mode:

```bash
npx gp-css watch
```

## Directives

In your primary CSS file (e.g. `src/styles.css`):

```css
@gp-css theme;
@gp-css base;
@gp-css components;

.custom-button {
  @apply flex items-center justify-center bg-accent text-slate-900 rounded-lg p-3;
}

@gp-css utilities;
```

## Token Integration (`gp-theme`)

| Token Class | Utility Description | CSS Variable / Resolved Value |
| :--- | :--- | :--- |
| `bg-panel` | Surface Card background | `var(--gp-surface-card, var(--panel, rgba(15, 23, 42, 0.78)))` |
| `text-accent` | Accent / Primary text color | `var(--gp-primary, var(--accent, #67e8f9))` |
| `glass` | Glassmorphic panel | Backdrop blur, semi-transparent border, shadow |
| `glow` | Cyan glow box-shadow | `0 0 25px rgba(103, 232, 249, 0.35)` |

## Programmatic API

```typescript
import { compile } from '@generatedpixel/gp-css';

const result = compile({
  content: [`<div class="flex items-center p-4 bg-panel glass"></div>`],
  minify: true
});

console.log(result.css);
```

## License

MIT © Generated Pixel
