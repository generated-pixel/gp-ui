# `@generatedpixel/gp-ui`

> Production-grade, independent Angular UI component library and design system for modern enterprise applications.

[![npm version](https://img.shields.io/npm/v/@generatedpixel/gp-ui.svg?style=flat&color=blue)](https://www.npmjs.com/package/@generatedpixel/gp-ui)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

`@generatedpixel/gp-ui` is built from the ground up for Angular 18+ with zero third-party UI framework dependencies. It provides over 50 accessible, high-performance standalone components with first-class support for Angular Signals, `ChangeDetectionStrategy.OnPush`, typed Reactive Forms, bidirectional RTL layouts, and deep design-token theming.

---

## Key Features

- **50+ Standalone Angular Components**:
  - **Form Controls**: InputText, Textarea, Select / Dropdown, MultiSelect, AutoComplete, Checkbox, RadioButton, ToggleSwitch, Slider, DatePicker, ColorPicker, FileUpload, InputNumber, Rating.
  - **Buttons & Actions**: Button, SplitButton, SpeedDial, Ripple directive.
  - **Data Presentation**: Table (DataTable with sorting, multi-column filtering, pagination, selection, striped rows, column resizing), Paginator, Timeline, VirtualScroller.
  - **Trees & Navigation**: Tree, TreeTable, Breadcrumb, Menu, Menubar, TieredMenu, ContextMenu, SlideMenu, MegaMenu, Steps / Stepper, TabView / Tabs.
  - **Overlays & Dialogs**: Dialog, ConfirmDialog, DynamicDialog service, Sidebar / Offcanvas, Tooltip, Popover / OverlayPanel.
  - **Panels & Containers**: Card, Panel, Fieldset, Accordion, Divider, ScrollPanel, Toolbar.
  - **Feedback & Status**: Toast notifications with `GpToastService`, Messages, Message inline, ProgressBar, ProgressSpinner, Skeleton loaders, Badge, Tag, Chip, Avatar.
  - **Media & Display**: Image viewer, Galleria, Carousel.
- **Signals-First & OnPush Architecture**: Designed for maximum change-detection performance with Angular Signals and immutable state flow.
- **Typed Reactive Forms Integration**: Full `ControlValueAccessor` implementation across all form components with validation states (`ng-invalid`, `ng-dirty`, `ng-touched`).
- **Deep Theming Support**: Native integration with `@generatedpixel/gp-ui-theme` tokens and `@generatedpixel/gp-css` utility classes.
- **Accessibility (a11y) & WCAG 2.1**: Full keyboard navigation, ARIA attributes, and built-in focus trapping.
- **Internationalization (i18n) & RTL**: Configurable translation bundles, date/number formatting, and instant RTL layout support.

---

## Installation

Install `@generatedpixel/gp-ui` along with companion theming and icon packages:

```bash
npm install @generatedpixel/gp-ui @generatedpixel/gp-ui-theme @generatedpixel/gp-ui-icons @generatedpixel/gp-css
```

---

## Quick Setup

### 1. Import Theme Styles

In your global stylesheet (e.g. `src/styles.scss` or `src/styles.css`):

```scss
/* Import gp-ui-theme tokens and component styles */
@import '@generatedpixel/gp-ui-theme/src/index.css';
```

If you are using `@generatedpixel/gp-css`, include the utility directives:

```css
@gp-css theme;
@gp-css base;
@gp-css components;
@gp-css utilities;
```

### 2. Initialize Theme in Application Bootstrap

```typescript
// src/app/app.config.ts or src/main.ts
import { GpThemeManager } from '@generatedpixel/gp-ui-theme';

// Initialize with default theme and system/dark/light preference
GpThemeManager.initSystemTheme('default', 'dark');
```

---

## Usage Examples

### 1. Data Table with Sorting and Pagination

```typescript
import { Component } from '@angular/core';
import { GpTableComponent, GpColumnComponent, GpButtonComponent, GpTagComponent } from '@generatedpixel/gp-ui';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
}

@Component({
  selector: 'app-product-table',
  standalone: true,
  imports: [GpTableComponent, GpColumnComponent, GpButtonComponent, GpTagComponent],
  template: `
    <gp-table
      [value]="products"
      [paginator]="true"
      [rows]="5"
      [stripedRows]="true"
      [responsive]="true"
      selectionMode="single"
    >
      <gp-column field="id" header="Code" width="100px" [sortable]="true" />
      <gp-column field="name" header="Product Name" [sortable]="true" />
      <gp-column field="category" header="Category" [sortable]="true" />
      <gp-column field="price" header="Price" [sortable]="true">
        <ng-template gpTemplate="body" let-product>
          {{ product.price | currency }}
        </ng-template>
      </gp-column>
      <gp-column field="status" header="Status">
        <ng-template gpTemplate="body" let-product>
          <gp-tag
            [value]="product.status"
            [severity]="product.status === 'IN_STOCK' ? 'success' : product.status === 'LOW_STOCK' ? 'warning' : 'danger'"
          />
        </ng-template>
      </gp-column>
    </gp-table>
  `
})
export class ProductTableComponent {
  products: Product[] = [
    { id: 'P1001', name: 'Quantum Processor', category: 'Hardware', price: 499.99, status: 'IN_STOCK' },
    { id: 'P1002', name: 'Neural Accelerator', category: 'Hardware', price: 899.99, status: 'LOW_STOCK' },
    { id: 'P1003', name: 'Cloud Sync Engine', category: 'Software', price: 129.00, status: 'IN_STOCK' },
    { id: 'P1004', name: 'Holographic Display', category: 'Peripherals', price: 1250.00, status: 'OUT_OF_STOCK' }
  ];
}
```

---

### 2. Reactive Forms with Form Controls

```typescript
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  GpInputTextComponent,
  GpSelectComponent,
  GpToggleSwitchComponent,
  GpButtonComponent,
  GpToastComponent,
  GpToastService
} from '@generatedpixel/gp-ui';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    GpInputTextComponent,
    GpSelectComponent,
    GpToggleSwitchComponent,
    GpButtonComponent,
    GpToastComponent
  ],
  template: `
    <gp-toast />

    <form [formGroup]="userForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-4 max-w-lg">
      <div class="flex flex-col gap-1">
        <label for="fullName">Full Name</label>
        <gp-input-text id="fullName" formControlName="fullName" placeholder="Jane Doe" [clearable]="true" />
      </div>

      <div class="flex flex-col gap-1">
        <label for="role">Role</label>
        <gp-select
          id="role"
          formControlName="role"
          [options]="roleOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Select a role"
        />
      </div>

      <div class="flex items-center gap-3">
        <gp-toggle-switch id="notifications" formControlName="notifications" />
        <label for="notifications">Enable email alerts</label>
      </div>

      <gp-button
        type="submit"
        label="Save Profile"
        severity="primary"
        [disabled]="userForm.invalid"
      />
    </form>
  `
})
export class UserFormComponent {
  userForm = new FormGroup({
    fullName: new FormControl('', [Validators.required]),
    role: new FormControl(null, [Validators.required]),
    notifications: new FormControl(true)
  });

  roleOptions = [
    { label: 'Administrator', value: 'admin' },
    { label: 'Developer', value: 'dev' },
    { label: 'Viewer', value: 'viewer' }
  ];

  constructor(private toast: GpToastService) {}

  onSubmit(): void {
    if (this.userForm.valid) {
      this.toast.success('Saved', 'User profile updated successfully.');
    }
  }
}
```

---

### 3. Modal Dialogs & Overlays

```typescript
import { Component } from '@angular/core';
import { GpDialogComponent, GpButtonComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'app-modal-demo',
  standalone: true,
  imports: [GpDialogComponent, GpButtonComponent],
  template: `
    <gp-button label="Open Settings Dialog" (onClickEvent)="displayModal = true" />

    <gp-dialog
      header="System Preferences"
      [(visible)]="displayModal"
      [modal]="true"
      [dismissableMask]="true"
      [style]="{ width: '450px' }"
    >
      <p>Configure your workspace synchronization and notification preferences.</p>

      <ng-template gpTemplate="footer">
        <gp-button label="Cancel" severity="secondary" [text]="true" (onClickEvent)="displayModal = false" />
        <gp-button label="Apply Changes" severity="primary" (onClickEvent)="displayModal = false" />
      </ng-template>
    </gp-dialog>
  `
})
export class ModalDemoComponent {
  displayModal = false;
}
```

---

## Companion Ecosystem Packages

| Package | Description |
| :--- | :--- |
| [`@generatedpixel/gp-ui-theme`](https://www.npmjs.com/package/@generatedpixel/gp-ui-theme) | Multi-theme token engine, 8 built-in themes (Light & Dark), and runtime theme switcher |
| [`@generatedpixel/gp-blocks`](https://www.npmjs.com/package/@generatedpixel/gp-blocks) | 50+ pre-built application layouts, dashboards, settings, and dynamic JSON schema engine |
| [`@generatedpixel/gp-grid`](https://www.npmjs.com/package/@generatedpixel/gp-grid) | Reactive draggable/resizable grid and dashboard layout engine with collision resolution |
| [`@generatedpixel/gp-css`](https://www.npmjs.com/package/@generatedpixel/gp-css) | Utility-first JIT CSS engine with native token bridge and glassmorphism / glow effects |
| [`@generatedpixel/gp-ui-icons`](https://www.npmjs.com/package/@generatedpixel/gp-ui-icons) | Lightweight, tree-shakeable SVG icon registry with `<gp-icon>` component |

---

## License

MIT © [Generated Pixel](https://generatedpixel.dev)
