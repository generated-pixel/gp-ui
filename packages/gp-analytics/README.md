# gp-analytics

Foundational metadata models for analytics applications: groups, tables, field groupings, fields, relationships, and localized values.

## Overview

`gp-analytics` contains metadata models and Angular components and services for datasets, reporting, and dashboards. It is developed as a separate package in the gp-ui monorepo.

## Features

- **Table metadata**: Group tables and their field groupings under a named grouping.
- **Field capabilities**: Describe whether a field is reportable, filterable, sortable, groupable, indexed, or usable for joins.
- **Relationships**: Model one-to-one and one-to-many joins by source and target field IDs.
- **Localized values**: Keep a stable stored value separate from language-specific display values.

## Installation

```bash
npm install gp-analytics
```

## Theming

`gp-analytics` components read colors, surfaces, and radii from the same `--gp-*` custom properties published by
`@generatedpixel/gp-ui-theme`, so switching a theme or toggling dark mode automatically restyles every analytics
component alongside the rest of `gp-ui`.

On top of that, it publishes its own `--gp-analytics-*` token layer (widget surfaces, code blocks, up/down metric
colors, chart palette, designer/inspector chrome) for anything analytics-specific that isn't part of the core
design system. Each token falls back to a `--gp-*` theme token, so it stays in sync with the active theme unless you
override it.

Import the token stylesheet once alongside the core theme CSS:

```scss
@import '@generatedpixel/gp-ui-theme/src/index.css';
@import '@generatedpixel/gp-analytics/src/lib/styles/analytics-theme-tokens.scss';
```

Override any analytics-only token per-app, e.g. to give KPI cards a custom accent:

```css
:root {
  --gp-analytics-chart-1: #22c55e;
  --gp-analytics-widget-radius: 1rem;
}
```

## Quick Start

### Define metadata

```ts
import { Grouping } from 'gp-analytics';

const commerce: Grouping = {
  groupingId: 'commerce',
  groupingName: 'Commerce',
  tables: []
};
```

## Scripts

Run these commands from the gp-ui repository root:

- `npm run build:analytics` - Builds gp-ui, gp-grid, and then gp-analytics to `dist/packages/gp-analytics`.
- `npm run test:analytics` - Runs the analytics Vitest unit tests.
- `npm run build` / `npm test` - Builds or tests the complete monorepo, including analytics.

Every gp-analytics component has its own standalone demo page under `apps/gp-ui-demo` (see the "Analytics" section of
the sidebar), so each component can be explored in isolation with a live demo and a full properties/events reference.
The original standalone gp-analytics demo app has been fully superseded by this integration; its history remains
accessible via `git log --full-history -- packages/gp-analytics`.
