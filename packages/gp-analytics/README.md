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

The former standalone demo is preserved under `legacy/gp-analytics/apps/demo` for later integration into gp-ui-demo.
