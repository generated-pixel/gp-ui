# `@generatedpixel/gp-ui-theme`

> Design-token theming system for `gp-ui` with built-in light and dark themes, CSS custom properties, and runtime theme switching.

## What This Package Provides

`gp-ui-theme` separates design decisions from component styles through three token layers:

1. **Primitives** are reusable scales such as colors, spacing, typography, radii, shadows, and transitions.
2. **Semantic tokens** describe intent, such as `primary`, `danger`, `surfaces.card`, `text.secondary`, and focus rings.
3. **Component tokens** hold component-specific values such as button height, input borders, dialog padding, and table row colors.

Every theme contains a complete `light` and `dark` mode. The compiler converts those definitions into `--gp-*` CSS
custom properties, while `GpThemeManager` applies the selected theme to the document.

## Installation

```bash
npm install @generatedpixel/gp-ui-theme
```

For the full component suite:

```bash
npm install @generatedpixel/gp-ui @generatedpixel/gp-ui-theme @generatedpixel/gp-css @generatedpixel/gp-ui-icons
```

## Stylesheet Setup

Import the package stylesheet from the application's global stylesheet entry point:

```scss
/* src/styles.scss */
@import '@generatedpixel/gp-ui-theme/src/index.css';
```

The package stylesheet contains the built-in theme rules. If the application also uses `gp-css`, add its directives to
the same global pipeline as described in [`@generatedpixel/gp-css`](../gp-css/README.md).

## Initialize the Theme Manager

Initialize once during browser application startup, before rendering themed components:

```typescript
import { GpThemeManager } from '@generatedpixel/gp-ui-theme';

GpThemeManager.initSystemTheme('default', 'system');
```

The first argument is the fallback theme ID. The second is the initial mode: `light`, `dark`, or `system`. The
manager reads later selections from `localStorage`, listens for operating-system color-scheme changes in `system`
mode, and sets these attributes on `<html>`:

```html
<html data-gp-theme="default" data-gp-mode="dark" class="gp-theme-default gp-dark"></html>
```

The `gp-dark` and `gp-light` classes are compatibility helpers. Prefer `data-gp-theme` and `data-gp-mode` for new
selectors.

## Switching Themes and Modes

```typescript
GpThemeManager.setTheme('ocean');
GpThemeManager.setMode('dark');

// Follow the operating system again.
GpThemeManager.setMode('system');

// Toggle between the effective light and dark modes.
const activeMode = GpThemeManager.toggleMode();

console.log(GpThemeManager.getState());
// { theme: 'ocean', mode: 'dark', activeMode: 'dark', isDark: true }
```

`setTheme` and `setMode` persist by default. Pass `false` as the second argument for a temporary change:

```typescript
GpThemeManager.setTheme('sunset', false);
GpThemeManager.setMode('light', false);
```

Useful read APIs include `getThemeName()`, `getMode()`, `getActiveMode()`, `isDark()`, `getState()`,
`getAvailableThemes()`, and `getThemeDefinition(themeId)`. Subscribe to changes with `onChange`; it returns an
unsubscribe function and immediately calls the listener with the current state:

```typescript
const unsubscribe = GpThemeManager.onChange((state) => {
  document.title = `${state.theme} - ${state.activeMode}`;
});

// Call when the listener is no longer needed.
unsubscribe();
```

## Built-in Themes

The package includes these theme IDs:

| ID          | Description                  |
| ----------- | ---------------------------- |
| `default`   | Neutral indigo foundation    |
| `ocean`     | Cyan and azure palette       |
| `emerald`   | Green and teal palette       |
| `sunset`    | Warm orange and rose palette |
| `amethyst`  | Violet palette               |
| `rose`      | Rose and pink palette        |
| `nord`      | Cool Nordic palette          |
| `cyberpunk` | High-contrast neon palette   |

The definitive metadata list is available at `GpThemeManager.BUILT_IN_THEMES` or through `getAvailableThemes()`.

## Using Theme Variables in CSS

Theme variables are scoped to the active theme and mode. Use semantic variables in authored CSS so components respond to
both theme and mode changes:

```css
.dashboard-card {
  background: var(--gp-surface-card);
  border: 1px solid var(--gp-surface-border);
  border-radius: var(--gp-border-radius-lg);
  color: var(--gp-text-color);
  box-shadow: var(--gp-shadow-md);
}

.dashboard-card:focus-visible {
  box-shadow: var(--gp-focus-ring);
}
```

Common variables include `--gp-primary`, `--gp-success`, `--gp-danger`, `--gp-surface-ground`,
`--gp-surface-section`, `--gp-surface-card`, `--gp-text-color`, `--gp-text-color-secondary`,
`--gp-font-family`, `--gp-border-radius`, and `--gp-transition-duration`. Component tokens are flattened, for example
`components.button.height` becomes `--gp-button-height`.

Use a fallback when a custom element may render before the theme stylesheet is available:

```css
color: var(--gp-text-color, #1e293b);
```

## Creating a Custom Theme

Use `extendTheme` with a partial override. The remaining values are inherited from `baseTheme`, so a theme only needs to
define the decisions that differ:

```typescript
import { extendTheme, GpThemeManager } from '@generatedpixel/gp-ui-theme';

const graphiteTheme = extendTheme({
  id: 'graphite',
  name: 'Graphite',
  description: 'A restrained neutral theme for dense interfaces.',
  light: {
    semantic: {
      primary: {
        main: '#475569',
        text: '#ffffff',
        hover: '#334155',
        active: '#1e293b',
        light: '#f1f5f9'
      }
    }
  },
  dark: {
    semantic: {
      primary: {
        main: '#cbd5e1',
        text: '#0f172a',
        hover: '#e2e8f0',
        active: '#f8fafc',
        light: '#1e293b'
      }
    }
  }
});

GpThemeManager.registerTheme(graphiteTheme);
GpThemeManager.setTheme('graphite');
```

For a one-off runtime definition, `setTheme(graphiteTheme)` registers and activates it. `registerTheme` also accepts a
partial `GpThemeOverride` and returns the completed `GpThemeDefinition`.

## Token Aliases

Theme definitions can reference another token with a W3C-style alias. Aliases are resolved separately for light and dark
mode:

```typescript
const compactTheme = extendTheme({
  id: 'compact',
  name: 'Compact',
  light: {
    components: {
      card: {
        bg: '{semantic.surfaces.card}',
        borderRadius: '{primitives.borderRadius.sm}'
      }
    }
  },
  dark: {
    components: {
      card: {
        bg: '{semantic.surfaces.card}',
        borderRadius: '{primitives.borderRadius.sm}'
      }
    }
  }
});
```

The supported roots are `semantic`, `primitives`, and `components`. Use the exported `resolveTokenAlias` and
`modeTokensToCssVars` helpers when building custom tooling.

## Scoped Themes

The generated stylesheet supports theme selectors below the document root, which is useful for previews or embedded
surfaces:

```html
<section data-gp-theme="ocean" data-gp-mode="dark">
  <p class="preview">This subtree uses the Ocean dark tokens.</p>
</section>
```

The manager still controls the document-level theme. For an isolated subtree, set both attributes explicitly and use
`var(--gp-*)` values in its styles.

## Server-side Rendering

`GpThemeManager` guards access to `window`, `document`, and `localStorage`. On the server, `initSystemTheme` returns
`light` and does not inject styles. Load the stylesheet during SSR and initialize the manager in the browser bootstrap
path to apply persisted preferences after hydration.

## Compiler Exports

The package exports the theme manager and token APIs from its public entry point:

- `GpThemeManager`
- `baseTheme`, `defaultTheme`, and all built-in theme presets
- `extendTheme`, `deepMerge`, `themeToCss`, `modeTokensToCssVars`, and `resolveTokenAlias`
- TypeScript definitions such as `GpThemeDefinition`, `GpThemeOverride`, `GpThemeState`, and `GpPrimitives`

## Troubleshooting

**The page stays on the default theme:** call `initSystemTheme()` before `setTheme`, verify the requested ID, and check
that the theme stylesheet is loaded globally.

**A custom token is missing:** confirm both `light` and `dark` mode structures are present when constructing a complete
`GpThemeDefinition`, or use `extendTheme`/`registerTheme` with a partial override.

**A component ignores a token:** inspect the generated CSS variable name. Nested keys are flattened to kebab case, so
`components.dialog.header.fontSize` becomes `--gp-dialog-header-font-size`.

**A subtree does not change:** set `data-gp-theme` and `data-gp-mode` on the same subtree and ensure its CSS is present;
root-level classes alone do not replace subtree attributes.

## License

MIT © Generated Pixel
