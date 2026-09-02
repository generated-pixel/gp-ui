# `@generatedpixel/gp-grid`

> Reactive, high-performance Grid & Dashboard Layout Engine for Angular with drag-and-drop, interactive resizing, and collision resolution.

[![npm version](https://img.shields.io/npm/v/@generatedpixel/gp-grid.svg?style=flat&color=blue)](https://www.npmjs.com/package/@generatedpixel/gp-grid)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

`@generatedpixel/gp-grid` provides a modern, 100% Signal-driven dashboard grid system for Angular 18+. It enables users to drag, resize, lock, and organize widgets across multi-column responsive grid canvases with automated collision detection and vertical compaction.

---

## Features

- **Signals-First Reactivity**: Built with Angular Signals (`model()`, `input()`, `computed()`, `output()`) for zero-overhead change detection and optimal 60fps interaction.
- **Interactive Drag & Drop**: Smooth pointer and touch drag interactions with live placeholder previews and snap-to-grid calculations.
- **Interactive Corner Resizing**: Intuitive 2D resizing with configurable `minW`, `maxW`, `minH`, `maxH` constraints.
- **Smart Collision Resolution & Compaction**: Automatic displacement resolution prevents overlap and packs widgets upward (`compactType="vertical"` or `'none'`).
- **Locked & Fixed Modes**:
  - `locked`: Anchored permanently in place — will never be displaced by other widgets and blocks drops over it.
  - `fixed`: Static widget that cannot be dragged or resized by users.
- **Custom Widget Templates**: Render arbitrary Angular templates and components inside `<gp-grid-widget>`.
- **Theming & Localization**: Built-in support for `@generatedpixel/gp-ui-theme` tokens, glassmorphic panels, and `GpTranslationService` i18n keys.

---

## Installation

```bash
npm install @generatedpixel/gp-grid @generatedpixel/gp-ui @generatedpixel/gp-ui-theme @generatedpixel/gp-ui-icons @generatedpixel/gp-css
```

---

## Quick Start

### 1. Basic Dashboard Grid Example

```typescript
import { Component, signal } from '@angular/core';
import { GpGrid, GpGridItem } from '@generatedpixel/gp-grid';
import { GpButton } from '@generatedpixel/gp-ui';

@Component({
  selector: 'app-dashboard-view',
  standalone: true,
  imports: [GpGrid, GpButton],
  template: `
    <div class="p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold">Analytics Dashboard</h2>
        <gp-button label="Add Widget" icon="plus" (onClickEvent)="addWidget()" />
      </div>

      <gp-grid
        [(items)]="widgets"
        [columns]="12"
        [rowHeight]="90"
        [gap]="16"
        compactType="vertical"
        [animate]="true"
        (layoutChanged)="onLayoutChanged($event)"
        (itemRemoved)="onWidgetRemoved($event)"
      >
        <ng-template #widgetTemplate let-item>
          <div class="p-4 flex flex-col justify-center h-full">
            <span class="text-sm text-secondary">{{ item.title }}</span>
            <div class="text-2xl font-bold mt-2">{{ item.customData?.value || 'Active' }}</div>
          </div>
        </ng-template>
      </gp-grid>
    </div>
  `
})
export class DashboardViewComponent {
  widgets = signal<GpGridItem[]>([
    {
      id: 'kpi-revenue',
      x: 0,
      y: 0,
      w: 4,
      h: 2,
      minW: 2,
      minH: 2,
      title: 'Total Revenue',
      icon: 'star',
      badge: '+18.4%',
      badgeSeverity: 'success',
      customData: { value: '$128,450.00' }
    },
    {
      id: 'kpi-users',
      x: 4,
      y: 0,
      w: 4,
      h: 2,
      minW: 2,
      minH: 2,
      title: 'Active Users',
      icon: 'users',
      customData: { value: '42,890' }
    },
    {
      id: 'kpi-conversion',
      x: 8,
      y: 0,
      w: 4,
      h: 2,
      minW: 2,
      minH: 2,
      title: 'Conversion Rate',
      icon: 'chart',
      customData: { value: '3.64%' }
    },
    {
      id: 'chart-sales',
      x: 0,
      y: 2,
      w: 8,
      h: 4,
      minW: 4,
      minH: 3,
      title: 'Sales Performance',
      icon: 'layer-group',
      customData: { value: 'Monthly Growth Trends' }
    },
    {
      id: 'notice-locked',
      x: 8,
      y: 2,
      w: 4,
      h: 4,
      title: 'Pinned System Status',
      icon: 'lock',
      locked: true,
      customData: { value: 'All Systems Operational' }
    }
  ]);

  onLayoutChanged(newLayout: GpGridItem[]): void {
    console.log('Layout updated:', newLayout);
  }

  onWidgetRemoved(item: GpGridItem): void {
    console.log('Widget closed:', item.id);
  }

  addWidget(): void {
    const id = 'widget-' + Date.now();
    this.widgets.update((list) => [
      ...list,
      {
        id,
        x: 0,
        y: 6,
        w: 4,
        h: 2,
        title: 'New Metric',
        icon: 'box',
        customData: { value: '0' }
      }
    ]);
  }
}
```

---

## Grid Configuration (`<gp-grid>`)

### Inputs & Models

| Property          | Type                          | Default      | Description                                                                                         |
| :---------------- | :---------------------------- | :----------- | :-------------------------------------------------------------------------------------------------- |
| `[(items)]`       | `model<GpGridItem[]>`         | `[]`         | Two-way bound signal holding the array of grid widget configurations.                               |
| `[columns]`       | `input<number>`               | `12`         | Number of columns in the grid layout canvas.                                                        |
| `[rowHeight]`     | `input<number>`               | `80`         | Height in pixels for each grid row unit.                                                            |
| `[gap]`           | `input<number>`               | `16`         | Gutter / spacing between widgets in pixels.                                                         |
| `[minRows]`       | `input<number>`               | `2`          | Minimum number of rows rendered in the container.                                                   |
| `[compactType]`   | `input<'vertical' \| 'none'>` | `'vertical'` | Compaction strategy: `'vertical'` shifts items up to fill voids; `'none'` preserves free placement. |
| `[animate]`       | `input<boolean>`              | `true`       | Enables smooth CSS layout realignment transitions.                                                  |
| `[readonly]`      | `input<boolean>`              | `false`      | Disables all user drag, resize, and remove interactions.                                            |
| `[showGridLines]` | `input<boolean>`              | `false`      | Renders a subtle background grid alignment guide.                                                   |

### Outputs

| Event                | Type                        | Description                                                  |
| :------------------- | :-------------------------- | :----------------------------------------------------------- |
| `(layoutChanged)`    | `output<GpGridItem[]>`      | Emitted when any widget move or resize modifies coordinates. |
| `(itemMoved)`        | `output<GpGridChangeEvent>` | Emitted after a widget completes a drag-and-drop move.       |
| `(itemResized)`      | `output<GpGridChangeEvent>` | Emitted after a widget completes an interactive resize.      |
| `(itemRemoved)`      | `output<GpGridItem>`        | Emitted when a widget's close button is clicked.             |
| `(itemOptionsClick)` | `output<{ event, item }>`   | Emitted when a widget's header options button is clicked.    |

---

## Grid Item Interface (`GpGridItem`)

```typescript
export interface GpGridItem<T = any> {
  id: string; // Unique identifier
  x: number; // Column index (0-based)
  y: number; // Row index (0-based)
  w: number; // Width in columns (>= 1)
  h: number; // Height in rows (>= 1)
  minW?: number; // Minimum allowable width
  maxW?: number; // Maximum allowable width
  minH?: number; // Minimum allowable height
  maxH?: number; // Maximum allowable height
  title?: string; // Widget header title
  icon?: string; // Header icon name
  badge?: string; // Header badge text
  badgeSeverity?: string; // 'primary' | 'success' | 'warning' | 'danger' | 'info'
  draggable?: boolean; // Enable/disable dragging for this widget (default: true)
  resizable?: boolean; // Enable/disable resizing for this widget (default: true)
  closeable?: boolean; // Enable/disable close button for this widget (default: true)
  fixed?: boolean; // Cannot be moved/resized by user (default: false)
  locked?: boolean; // Cannot move and cannot be displaced by other widgets (default: false)
  customData?: T; // Application-specific payload
  customClass?: string; // Custom CSS class on the widget card
}
```

---

## Custom Drag Handles (`gpGridDragHandle`)

By default, the entire widget header acts as the drag handle. You can designate any nested element as a custom handle using the `gpGridDragHandle` directive:

```html
<gp-grid [(items)]="widgets">
  <ng-template #widgetTemplate let-item>
    <div class="custom-card">
      <div gpGridDragHandle class="cursor-move p-2 bg-panel flex items-center gap-2">
        <gp-icon name="grip-vertical" />
        <span>Drag Me</span>
      </div>
      <div class="content p-4">Custom body content</div>
    </div>
  </ng-template>
</gp-grid>
```

---

## License

MIT © [Generated Pixel](https://generatedpixel.dev)
