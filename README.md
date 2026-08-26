# `@generatedpixel/gp-ui` — Enterprise Angular UI Component Framework

[![CI - Build & Test](https://github.com/generated-pixel/gp-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/generated-pixel/gp-ui/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@generatedpixel/gp-ui.svg?style=flat&color=blue)](https://www.npmjs.com/package/@generatedpixel/gp-ui)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

`@generatedpixel/gp-ui` is a production-quality, independent Angular component framework inspired by PrimeNG, built from the ground up for modern Angular applications.

---

## 🌟 Key Features

- **50+ High-Performance Components**: Form controls, Buttons, Data presentation, Trees, Navigation, Dialogs/Overlays, Panels, Feedback, and Media display.
- **Design-Token Theming Engine (`@generatedpixel/gp-ui-theme`)**: Full multi-theme architecture where every theme (Default, Ocean, Emerald, Sunset, Amethyst, Rose, Nord, Cyberpunk) includes both Light and Dark modes, CSS variables, runtime theme switching, and dynamic palette injection.
- **Icon Infrastructure (`gp-ui-icons` & `<gp-icon>`)**: Lightweight, tree-shakeable SVG registry with 40+ built-in utility icons.
- **Internationalization (i18n) & Bidirectional RTL**: Configurable translation bundles, date/number formatting, and instant RTL layout support.
- **Modern Angular Architecture**: Standalone components, `ChangeDetectionStrategy.OnPush`, Angular Signals, and typed Reactive Forms (`ControlValueAccessor`).
- **Accessibility (a11y)**: Built-in WCAG 2.1 compliance, ARIA roles, and Focus Trap infrastructure.
- **Developer Tooling**: Component generator CLI, automated linting, test runners, Storybook setup, and NPM release automation.

---

## 📦 Installation

Install `@generatedpixel/gp-ui` and companion packages into any Angular application:

```bash
npm install @generatedpixel/gp-ui @generatedpixel/gp-ui-theme @generatedpixel/gp-ui-icons
```

---

## 🚀 Getting Started

### 1. Include Theming Styles
Import all preset themes and base utilities into your `angular.json` or `styles.scss`:

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
} from 'gp-ui';

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

## 🗂️ Component Suite Index

| Category | Components |
|---|---|
| **Buttons & Actions** | `gp-button`, `gp-button-group`, `gp-split-button`, `gp-speed-dial`, `gp-toggle-button` |
| **Form Controls (20)** | `gp-input-text`, `gp-textarea`, `gp-password`, `gp-input-number`, `gp-checkbox`, `gp-radio-button`, `gp-switch`, `gp-slider`, `gp-rating`, `gp-color-picker`, `gp-input-mask`, `gp-select`, `gp-multi-select`, `gp-listbox`, `gp-autocomplete`, `gp-cascade-select`, `gp-tree-select`, `gp-date-picker`, `gp-time-picker`, `gp-file-upload` |
| **Data Presentation** | `gp-table`, `gp-column`, `gp-paginator`, `gp-tree-table`, `gp-data-view`, `gp-virtual-scroller` |
| **Tree & Hierarchy** | `gp-tree`, `gp-org-chart` |
| **Navigation** | `gp-menu`, `gp-menubar`, `gp-context-menu`, `gp-tiered-menu`, `gp-mega-menu`, `gp-panel-menu`, `gp-breadcrumb`, `gp-tabs`, `gp-tab-panel`, `gp-stepper`, `gp-step`, `gp-dock`, `gp-toolbar` |
| **Overlays & Dialogs** | `gp-dialog`, `gp-confirm-dialog`, `gp-drawer`, `gp-popover`, `gpTooltip` |
| **Panels & Containers** | `gp-card`, `gp-panel`, `gp-accordion`, `gp-accordion-tab`, `gp-fieldset`, `gp-divider`, `gp-splitter`, `gp-scroll-panel` |
| **Feedback & Messages**| `gp-toast` (`GpToastService`), `gp-message`, `gp-progress-bar`, `gp-progress-spinner`, `gp-skeleton`, `gp-badge`, `gp-tag` |
| **Display & Media** | `gp-avatar`, `gp-avatar-group`, `gp-chip`, `gp-image` (lightbox preview), `gp-carousel`, `gp-timeline`, `gp-meter-group`, `gp-empty-state` |

---

## 🛠️ Developer Tooling Commands

| Command | Description |
|---|---|
| `npm run build` | Builds all monorepo packages, libraries, themes, and demo app |
| `npm run start` | Runs the interactive Demo & Documentation application locally |
| `npm run lint` | Validates architectural rules (Standalone, OnPush, isolation) |
| `npm run test` | Runs unit test suites and accessibility verifications |
| `npm run generate component <name>` | Scaffolds a new component, test spec, story, and styles |
| `npm run validate:consumer` | Runs external consumer validation tests |
| `npm run release` | Automates semantic version bump, changelog update, and packaging |

---

## 📄 License
MIT License. Created by Generated Pixel.