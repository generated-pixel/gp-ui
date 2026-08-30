# `@generatedpixel/gp-ui-icons`

> Lightweight, tree-shakeable SVG icon system & `<gp-icon>` component for Angular.

[![npm version](https://img.shields.io/npm/v/@generatedpixel/gp-ui-icons.svg?style=flat&color=blue)](https://www.npmjs.com/package/@generatedpixel/gp-ui-icons)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

`@generatedpixel/gp-ui-icons` provides an optimized, zero-dependency SVG icon system built specifically for Angular 18+ and the Generated Pixel design ecosystem. It features over 40 built-in utility icons, runtime icon registration via `GpIconRegistry`, and first-class standalone component support.

---

## Features

- **Lightweight & High Performance**: Clean SVG path injection with `ChangeDetectionStrategy.OnPush` and Angular DOM sanitization.
- **40+ Built-in Utility Icons**: Pre-registered common UI icons (arrows, checks, close, search, user, actions, spinners, layout, theme toggles).
- **Extensible Icon Registry (`GpIconRegistry`)**: Register custom application icons at runtime or bootstrap.
- **Dynamic Sizing, Rotation & Spin**: Control icon dimensions via CSS units or pixel numbers, rotate by arbitrary angles, and add smooth continuous spin animations.
- **Theme & Color Inheritance**: Icons use `currentColor` by default to seamlessly blend with surrounding text and design tokens (`--gp-primary`, `text-accent`, etc.).
- **Accessible by Default**: Supports `ariaHidden`, `ariaLabel`, and WCAG compliance.

---

## Installation

```bash
npm install @generatedpixel/gp-ui-icons
```

---

## Quick Start

### 1. Using `<gp-icon>` in Standalone Components

```typescript
import { Component } from '@angular/core';
import { GpIconComponent } from '@generatedpixel/gp-ui-icons';

@Component({
  selector: 'app-icon-demo',
  standalone: true,
  imports: [GpIconComponent],
  template: `
    <!-- Standard Icon -->
    <gp-icon name="check" />

    <!-- Sized and Colored -->
    <gp-icon name="search" size="24" color="#67e8f9" />
    <gp-icon name="trash" size="1.5rem" class="text-rose-500" />

    <!-- Animated Loading Spinner -->
    <gp-icon name="spinner" [spin]="true" size="20" />

    <!-- Rotated Icon -->
    <gp-icon name="chevron-down" [rotate]="90" />

    <!-- Accessible Icon with Screen-Reader Label -->
    <gp-icon name="lock" [ariaHidden]="false" ariaLabel="Secured Transaction" />
  `
})
export class IconDemoComponent {}
```

---

## Component Properties (`<gp-icon>`)

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `name` | `string` | `''` | Name of the registered icon to render. |
| `size` | `string \| number` | `'1em'` | Dimension of the icon. Numbers are treated as `px` (e.g. `24` -> `24px`). |
| `color` | `string` | `''` | Custom CSS color override. Defaults to inheriting `currentColor`. |
| `spin` | `boolean` | `false` | When `true`, applies a continuous 360° rotation animation. |
| `rotate` | `number` | `0` | Degree of rotation (e.g. `90`, `180`, `270`). |
| `ariaHidden`| `boolean \| string` | `true` | Hides icon from accessibility tree when purely decorative. |
| `ariaLabel` | `string` | `''` | Accessible label for screen readers when `ariaHidden` is `false`. |

---

## Built-in Icons

The following icons are included out of the box:

- **Navigation & Arrows**: `chevron-down`, `chevron-up`, `chevron-left`, `chevron-right`, `angle-double-left`, `angle-double-right`, `bars`, `external-link`
- **Actions & Status**: `check`, `close`, `times`, `plus`, `minus`, `edit`, `trash`, `copy`, `refresh`, `filter`, `sort-up`, `sort-down`, `sort-alt`
- **Feedback & Indicators**: `info-circle`, `check-circle`, `exclamation-triangle`, `times-circle`, `spinner`, `lock`, `lock-open`
- **Media & UI**: `search`, `calendar`, `clock`, `user`, `users`, `eye`, `eye-slash`, `star`, `star-fill`, `upload`, `download`, `home`, `folder`, `folder-open`, `file`, `code`, `play`, `pause`, `moon`, `sun`, `globe`, `sliders`, `palette`, `box`, `tag`, `layout-grid`, `grip-vertical`, `grip-horizontal`

---

## Registering Custom Icons

Use `GpIconRegistry` to register your own SVG icons across the application:

```typescript
import { Component, inject } from '@angular/core';
import { GpIconRegistry, GpIconComponent } from '@generatedpixel/gp-ui-icons';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [GpIconComponent],
  template: `
    <gp-icon name="custom-rocket" size="24" />
  `
})
export class AppComponent {
  private iconRegistry = inject(GpIconRegistry);

  constructor() {
    // Register a single SVG icon (SVG inner paths or elements)
    this.iconRegistry.registerIcon(
      'custom-rocket',
      '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>'
    );

    // Or register multiple icons at once
    this.iconRegistry.registerIcons({
      'icon-a': '<circle cx="12" cy="12" r="10" />',
      'icon-b': '<rect x="3" y="3" width="18" height="18" rx="2" />'
    });
  }
}
```

---

## License

MIT © [Generated Pixel](https://generatedpixel.dev)
