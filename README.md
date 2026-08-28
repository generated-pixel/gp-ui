# `@generatedpixel/gp-ui` — Enterprise Angular UI Component Framework & Design System

[![CI - Build & Test](https://github.com/generated-pixel/gp-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/generated-pixel/gp-ui/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@generatedpixel/gp-ui.svg?style=flat&color=blue)](https://www.npmjs.com/package/@generatedpixel/gp-ui)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

`@generatedpixel/gp-ui` is a production-quality, independent Angular component framework and design system built from the ground up for modern enterprise applications.

---

## Key Features

- **50+ High-Performance Components**: Form controls, Buttons, Data presentation, Trees, Navigation, Dialogs/Overlays, Panels, Feedback, and Media display.
- **Utility-First CSS Engine (`@generatedpixel/gp-css`)**: Modern JIT utility scanner & compiler featuring direct `gp-theme` design token integration, glassmorphism (`glass`), glow effects (`glow`), state modifiers (`hover:`, `focus:`, `dark:`, responsive breakpoints), and `@gp-css` directives.
- **Design-Token Theming Engine (`@generatedpixel/gp-ui-theme`)**: Full multi-theme architecture where every theme (Default, Ocean, Emerald, Sunset, Amethyst, Rose, Nord, Cyberpunk) includes both Light and Dark modes, CSS variables, runtime theme switching, and dynamic palette injection.
- **Icon Infrastructure (`gp-ui-icons` & `<gp-icon>`)**: Lightweight, tree-shakeable SVG registry with 40+ built-in utility icons.
- **Internationalization (i18n) & Bidirectional RTL**: Configurable translation bundles, date/number formatting, and instant RTL layout support.
- **Modern Angular Architecture**: Standalone components, `ChangeDetectionStrategy.OnPush`, Angular Signals, and typed Reactive Forms (`ControlValueAccessor`).
- **Accessibility (a11y)**: Built-in WCAG 2.1 compliance, ARIA roles, and Focus Trap infrastructure.
- **Developer Tooling**: Component generator CLI, automated linting, test runners, Storybook setup, and NPM release automation.

---

## Installation

Install the core suite and companion utility/theme packages into any Angular application:

```bash
npm install @generatedpixel/gp-ui @generatedpixel/gp-ui-theme @generatedpixel/gp-css @generatedpixel/gp-ui-icons
```

Detailed package guides:

- [`@generatedpixel/gp-css`](packages/gp-css/README.md): CLI, directives, utilities, configuration, plugins, and troubleshooting.
- [`@generatedpixel/gp-ui-theme`](packages/gp-ui-theme/README.md): token architecture, built-in themes, runtime switching, custom themes, and CSS variables.

---

## Using `@generatedpixel/gp-css`

Include theme tokens and utility directives in your global `styles.css` or CSS entrypoint:

```css
@gp-css theme;
@gp-css base;
@gp-css components;
@gp-css utilities;
```

Or write custom utility classes directly in your templates using `gp-theme` tokens:

```html
<div class="flex items-center justify-between p-6 bg-panel glass rounded-2xl text-accent hover:shadow-glow">
  <span>gp-css + gp-ui + gp-theme</span>
  <gp-button label="Action" severity="primary" />
</div>
```

---

## Getting Started with `gp-ui`

### 1. Include Theming Styles

Import preset themes into your `styles.scss`:

```scss
/* styles.scss */
@import '@generatedpixel/gp-ui-theme/src/index.css';
```

Or switch themes and modes in TypeScript at runtime:

```typescript
import { GpThemeManager } from '@generatedpixel/gp-ui-theme';

// Switch theme ('default', 'ocean', 'emerald', 'sunset', 'amethyst', 'rose', 'nord', 'cyberpunk')
GpThemeManager.setTheme('ocean');

// Switch mode ('light', 'dark', or 'system')
GpThemeManager.setMode('dark');
```

### 2. Use in Standalone Angular Components

```typescript
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  GpButtonComponent,
  GpInputTextComponent,
  GpSelectComponent,
  GpTableComponent,
  GpColumnComponent,
  GpToastComponent,
  GpToastService
} from '@generatedpixel/gp-ui';

@Component({
  selector: 'app-my-view',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    GpButtonComponent,
    GpInputTextComponent,
    GpSelectComponent,
    GpTableComponent,
    GpColumnComponent,
    GpToastComponent
  ],
  template: `
    <gp-toast />

    <h2>Customer Directory</h2>
    <gp-input-text [formControl]="searchControl" placeholder="Search..." [clearable]="true" />
    <gp-button label="Save Changes" severity="primary" (onClickEvent)="save()" />

    <gp-table [value]="customers" [paginator]="true" [rows]="5" [stripedRows]="true">
      <gp-column field="id" header="ID" width="5rem" />
      <gp-column field="name" header="Name" [sortable]="true" />
      <gp-column field="email" header="Email" />
      <gp-column field="status" header="Status" />
    </gp-table>
  `
})
export class MyViewComponent {
  searchControl = new FormControl('');
  customers = [
    { id: 1, name: 'Alice Cooper', email: 'alice@example.com', status: 'Active' },
    { id: 2, name: 'Bob Dylan', email: 'bob@example.com', status: 'Pending' }
  ];

  constructor(private toast: GpToastService) {}

  save(): void {
    this.toast.success('Saved', 'Customer records updated successfully.');
  }
}
```

---

## Monorepo Packages

- **`@generatedpixel/gp-ui`**: Enterprise component library with 50+ standalone Angular components.
- **`@generatedpixel/gp-css`**: Utility-first CSS engine & JIT compiler with native token bridge.
- **`@generatedpixel/gp-ui-theme`**: Multi-theme tokens, CSS variables, and dynamic theme manager.
- **`@generatedpixel/gp-ui-icons`**: Lightweight SVG icon registry.

---

## Developer Tooling Commands

| Command                             | Description                                                                                 |
| ----------------------------------- | ------------------------------------------------------------------------------------------- |
| `npm run build`                     | Builds all monorepo packages (`gp-css`, `gp-ui-theme`, `gp-ui-icons`, `gp-ui`) and demo app |
| `npm run start`                     | Runs the interactive Demo & Documentation application locally                               |
| `npm run lint`                      | Validates architectural rules (Standalone, OnPush, isolation)                               |
| `npm run test`                      | Runs unit test suites (`gp-css` compiler tests & component spec verifications)              |
| `npm run generate component <name>` | Scaffolds a new component, test spec, story, and styles                                     |
| `npm run release`                   | Automates semantic version bump, changelog update, and packaging                            |

---

## License

MIT License. Created by Generated Pixel.
