# gp-analytics

Foundational metadata models for analytics applications: groups, tables, field groupings, fields, relationships, and localized values.

## Overview

`gp-analytics` is intentionally framework-agnostic at this stage. It defines the metadata contract that later reporting and visualization features can build on.

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
  tables: [],
};
```

## Scripts

- `npm run build:lib` - Builds `gp-analytics` via `ng-packagr` to `dist/gp-analytics`
- `npm run test` - Runs Vitest unit tests for the library
