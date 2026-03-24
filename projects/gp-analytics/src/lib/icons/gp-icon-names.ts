/**
 * All named icons available in the gp-analytics icon set.
 *
 * Icons are grouped by concept:
 *  - artifact-*       DesignerArtifactType icons (tabular, graph, kpi)
 *  - graph-*          GraphVisualizationType icons (pie, bar, column …)
 *  - type-*           FieldDataType icons (string, number, date …)
 *  - agg-*            AggregationType icons (sum, avg, min …)
 *  - role-*           GraphFieldRole icons (x-axis, y-axis, series, tooltip)
 *  - sort-*           Sort-direction icons
 *  - Everything else  General-purpose UI icons
 */
export type GpIconName =
  // ── Artifact types ────────────────────────────────────────────────────────
  | 'artifact-tabular'
  | 'artifact-graph'
  | 'artifact-kpi'
  // ── Graph / visualisation types ──────────────────────────────────────────
  | 'graph-pie'
  | 'graph-bar'
  | 'graph-stacked-bar'
  | 'graph-column'
  | 'graph-stacked-column'
  | 'graph-radial'
  // ── Field data types ─────────────────────────────────────────────────────
  | 'type-string'
  | 'type-number'
  | 'type-integer'
  | 'type-boolean'
  | 'type-date'
  | 'type-datetime'
  | 'type-time'
  // ── Aggregation types ────────────────────────────────────────────────────
  | 'agg-none'
  | 'agg-sum'
  | 'agg-avg'
  | 'agg-min'
  | 'agg-max'
  | 'agg-count'
  | 'agg-count-distinct'
  // ── Graph field roles ────────────────────────────────────────────────────
  | 'role-x-axis'
  | 'role-y-axis'
  | 'role-series'
  | 'role-tooltip'
  // ── Sort direction ───────────────────────────────────────────────────────
  | 'sort-asc'
  | 'sort-desc'
  | 'sort-none'
  // ── General UI ───────────────────────────────────────────────────────────
  | 'add'
  | 'check'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right'
  | 'chevron-up'
  | 'copy'
  | 'dashboard'
  | 'designer'
  | 'drag-handle'
  | 'error'
  | 'external-link'
  | 'filter'
  | 'info'
  | 'preview'
  | 'refresh'
  | 'remove'
  | 'search'
  | 'settings'
  | 'success'
  | 'warning'
  | 'widget';
