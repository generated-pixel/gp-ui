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

`gp-css` is a build-time compiler. It does not add a runtime stylesheet loader. Add its generated CSS to the
application's normal global stylesheet pipeline or copy the generated file into the application's static assets.

## Recommended Project Setup

Create a global entry stylesheet and keep the directives in this order:

```css
/* src/styles.css */
@gp-css theme;
@gp-css base;
@gp-css components;

.profile-card {
  @apply flex items-center gap-4 p-6 bg-surface-card rounded-xl shadow-md;
}

@gp-css utilities;
```

The `theme` directive emits the compiler's `--gp-color-*`, `--gp-radius-*`, and `--gp-space-*` variables. The
`base` directive emits the reset, body defaults, and shared keyframes. The `components` directive emits the built-in
`.gp-card`, `.gp-btn`, and `.gp-btn-primary` helpers. The `utilities` directive is where rules found in application
content are emitted.

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

### CLI behavior

- `init` creates `gp-css.config.mjs` in the current directory.
- `build` and `watch` scan `src` and `public` recursively.
- Scanned file types are `.html`, `.ts`, `.tsx`, `.js`, `.jsx`, `.vue`, `.svelte`, and `.css`.
- `node_modules`, `dist`, hidden directories, and unreadable files are skipped.
- `src/styles.css` is used as the input stylesheet when it exists; otherwise the four standard directives are used.
- Output is written to `dist/gp-css.css`.
- Add `--minify` to `build` for compact output. The current `watch` command performs the same compilation path but
  does not yet keep a file watcher running.

After compiling, include the output in the application, for example:

```html
<link rel="stylesheet" href="/dist/gp-css.css" />
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

Directives are replaced during compilation and are not valid browser CSS on their own. Keep `@gp-css utilities;`
after authored `@apply` rules when those rules need utility declarations to be inlined first.

## Token Integration (`gp-theme`)

| Token Class   | Utility Description         | CSS Variable / Resolved Value                                  |
| :------------ | :-------------------------- | :------------------------------------------------------------- |
| `bg-panel`    | Surface Card background     | `var(--gp-surface-card, var(--panel, rgba(15, 23, 42, 0.78)))` |
| `text-accent` | Accent / Primary text color | `var(--gp-primary, var(--accent, #67e8f9))`                    |
| `glass`       | Glassmorphic panel          | Backdrop blur, semi-transparent border, shadow                 |
| `glow`        | Cyan glow box-shadow        | `0 0 25px rgba(103, 232, 249, 0.35)`                           |

## Programmatic API

```typescript
import { compile } from '@generatedpixel/gp-css';

const result = compile({
  content: [`<div class="flex items-center p-4 bg-panel glass"></div>`],
  minify: true
});

console.log(result.css);
```

`compile` returns `{ css, scannedCandidatesCount, matchedRulesCount }`. `inputCss` can replace the default directive
stylesheet, and `minify` removes comments and unnecessary whitespace:

```typescript
import { compile, definePlugin } from '@generatedpixel/gp-css';

const result = compile({
  content: ['<div class="stack"></div>'],
  inputCss: '@gp-css theme;\n@gp-css utilities;',
  plugins: [
    definePlugin(({ addUtility }) => {
      addUtility('stack', 'display: flex; flex-direction: column; gap: 1rem;');
    })
  ]
});
```

Plugins receive the active tokens and can register a utility with `addUtility(name, css)` or a selector with
`addComponent(selector, css)`. Other exports include `GpCssGenerator`, `processDirectives`, `defaultTokens`, and
`scanContent`.

## Content Scanning and Variants

The compiler generates only classes it discovers in the supplied content. Prefer complete, statically discoverable
class names:

```html
<div class="md:grid md:grid-cols-2 gap-4 hover:shadow-glow"></div>
```

Classes assembled from fragments are not reliable because the scanner does not execute application code. For
programmatic builds, pass every source string in `content`. Use `scanContent` when a build tool needs the candidate set
without generating CSS.

Common variants include `sm:`, `md:`, `lg:`, `xl:`, `2xl:`, `hover:`, `focus:`, `focus-visible:`, `active:`,
`disabled:`, `group-hover:`, `peer-hover:`, `peer-focus:`, and `dark:`. Arbitrary values use square brackets; replace
spaces with underscores:

```html
<div class="w-[min(100%,_42rem)] bg-[#102a43] p-[1.125rem]"></div>
```

`dark:` targets a `.dark` ancestor. For component styles that must follow runtime theme switching, use the CSS
variables emitted by `@generatedpixel/gp-ui-theme` rather than relying on the `dark:` variant.

## Troubleshooting

**A class does not appear in the output:** confirm the source is under `src` or `public`, uses a supported extension,
and contains the complete class name. For a custom build, confirm that its text was passed in `content`.

**`@apply` emits no declaration:** check that each applied class is supported by the generator. Unsupported classes are
ignored during `@apply` expansion.

**The stylesheet has no utilities:** ensure the input CSS contains `@gp-css utilities;`, or verify that the custom
build receives the expected content.

**Theme values do not update:** `gp-css` tokens are compiled into CSS. Runtime theme switching requires the separate
`@generatedpixel/gp-ui-theme` package and its `GpThemeManager`.

## License

MIT © Generated Pixel
