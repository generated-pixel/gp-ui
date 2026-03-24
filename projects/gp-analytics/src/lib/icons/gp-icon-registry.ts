import { GpIconName } from './gp-icon-names';

/**
 * SVG inner-content for every GpIconName.
 *
 * Each value contains only the child elements of the outer <svg> wrapper
 * (paths, circles, rects, lines …).  The wrapper itself is rendered by the
 * GpIcon component with a fixed viewBox="0 0 24 24".
 *
 * All shapes use `currentColor` so they inherit whatever text/icon colour is
 * applied by the consumer.  Stroke widths are chosen to remain crisp at
 * 16 px–32 px; the most common display size is 20 px–24 px.
 *
 * The registry is typed as Record<GpIconName, string> so the TypeScript
 * compiler will raise an error if an icon name is missing.
 */
export const GP_ICON_REGISTRY: Record<GpIconName, string> = {
  // ── Artifact types ────────────────────────────────────────────────────────

  /**
   * Tabular — a table grid with a shaded header row.
   */
  'artifact-tabular': `
    <rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.75"/>
    <rect x="3" y="3" width="18" height="5.5" rx="2" fill="currentColor" opacity="0.15"/>
    <path d="M3 8.5h18M9 8.5v12.5M15 8.5v12.5" stroke="currentColor" stroke-width="1.5"/>
  `,

  /**
   * Graph — three ascending column bars with a baseline.
   */
  'artifact-graph': `
    <line x1="4" y1="20" x2="20" y2="20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <rect x="5" y="13" width="3.5" height="7" rx="1" fill="currentColor" opacity="0.65"/>
    <rect x="10.25" y="8" width="3.5" height="12" rx="1" fill="currentColor"/>
    <rect x="15.5" y="5" width="3.5" height="15" rx="1" fill="currentColor" opacity="0.8"/>
  `,

  /**
   * KPI — a semicircular gauge with a needle and centre dot.
   */
  'artifact-kpi': `
    <path d="M3 15A9 9 0 0 0 21 15" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" opacity="0.2"/>
    <path d="M3 15A9 9 0 0 0 17.3 7.7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
    <path d="M12 15L16 9.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <circle cx="12" cy="15" r="2" fill="currentColor"/>
  `,

  // ── Graph / visualisation types ──────────────────────────────────────────

  /**
   * Pie chart — full circle with one filled slice (~1/3) and dividing lines.
   */
  'graph-pie': `
    <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.75"/>
    <path d="M12 12L12 3A9 9 0 0 1 19.8 16.5Z" fill="currentColor" opacity="0.55"/>
    <line x1="12" y1="12" x2="12" y2="3" stroke="currentColor" stroke-width="1.5"/>
    <line x1="12" y1="12" x2="19.8" y2="16.5" stroke="currentColor" stroke-width="1.5"/>
  `,

  /**
   * Bar chart — three horizontal bars of different lengths with a Y axis.
   */
  'graph-bar': `
    <line x1="4" y1="4" x2="4" y2="20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <rect x="4" y="5.5" width="13" height="3.5" rx="1" fill="currentColor"/>
    <rect x="4" y="10.5" width="9" height="3.5" rx="1" fill="currentColor" opacity="0.7"/>
    <rect x="4" y="15.5" width="15" height="3.5" rx="1" fill="currentColor" opacity="0.85"/>
  `,

  /**
   * Stacked bar chart — three rows, each split into two coloured segments.
   */
  'graph-stacked-bar': `
    <line x1="4" y1="4" x2="4" y2="20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <rect x="4"  y="5.5"  width="8"  height="3.5" rx="0" fill="currentColor"/>
    <rect x="12" y="5.5"  width="5"  height="3.5" rx="0" fill="currentColor" opacity="0.45"/>
    <rect x="4"  y="10.5" width="5"  height="3.5" rx="0" fill="currentColor"/>
    <rect x="9"  y="10.5" width="9"  height="3.5" rx="0" fill="currentColor" opacity="0.45"/>
    <rect x="4"  y="15.5" width="10" height="3.5" rx="0" fill="currentColor"/>
    <rect x="14" y="15.5" width="4"  height="3.5" rx="0" fill="currentColor" opacity="0.45"/>
  `,

  /**
   * Column chart — three vertical bars of different heights with a baseline.
   */
  'graph-column': `
    <line x1="4" y1="20" x2="20" y2="20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <rect x="5"    y="11" width="3.5" height="9"  rx="1" fill="currentColor" opacity="0.65"/>
    <rect x="10.25" y="7" width="3.5" height="13" rx="1" fill="currentColor"/>
    <rect x="15.5" y="14" width="3.5" height="6"  rx="1" fill="currentColor" opacity="0.8"/>
  `,

  /**
   * Stacked column chart — three columns each split into two stacked segments.
   */
  'graph-stacked-column': `
    <line x1="4" y1="20" x2="20" y2="20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <rect x="5"     y="14" width="3.5" height="6"  rx="0" fill="currentColor"/>
    <rect x="5"     y="10" width="3.5" height="4"  rx="0" fill="currentColor" opacity="0.45"/>
    <rect x="10.25" y="10" width="3.5" height="10" rx="0" fill="currentColor"/>
    <rect x="10.25" y="6"  width="3.5" height="4"  rx="0" fill="currentColor" opacity="0.45"/>
    <rect x="15.5"  y="12" width="3.5" height="8"  rx="0" fill="currentColor"/>
    <rect x="15.5"  y="8"  width="3.5" height="4"  rx="0" fill="currentColor" opacity="0.45"/>
  `,

  /**
   * Radial / donut chart — full ring (faint) plus a partial arc overlay.
   * Circumference ≈ 56.5; dash = 37 (65 %), gap = 19.5.
   */
  'graph-radial': `
    <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="3.5" opacity="0.18"/>
    <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="3.5"
            stroke-dasharray="37 19.5" stroke-linecap="round" transform="rotate(-90 12 12)"/>
    <circle cx="12" cy="12" r="4.5" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.25"/>
  `,

  // ── Field data types ─────────────────────────────────────────────────────

  /**
   * String — four horizontal lines of varying width (paragraph / text).
   */
  'type-string': `
    <path d="M4 6h16M4 10h16M4 14h12M4 18h8"
          stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  `,

  /**
   * Number — a hash (#) symbol with an extra decimal dot.
   */
  'type-number': `
    <path d="M8 5L6 19M18 5L16 19M5 10h14M4 15h14"
          stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>
    <circle cx="18" cy="18.5" r="1.5" fill="currentColor"/>
  `,

  /**
   * Integer — a clean hash (#) symbol (no decimal indicator).
   */
  'type-integer': `
    <path d="M8 5L6 19M18 5L16 19M5 10h14M4 15h14"
          stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>
  `,

  /**
   * Boolean — a toggle / pill switch in the ON position.
   */
  'type-boolean': `
    <rect x="2" y="8" width="20" height="8" rx="4" fill="none" stroke="currentColor" stroke-width="2"/>
    <circle cx="16" cy="12" r="3" fill="currentColor"/>
  `,

  /**
   * Date — a calendar with small day squares and a top-bar header.
   */
  'type-date': `
    <rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="1.75"/>
    <path d="M3 10h18" stroke="currentColor" stroke-width="1.5"/>
    <path d="M8 3v4M16 3v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <rect x="7"  y="13" width="2" height="2" rx="0.5" fill="currentColor"/>
    <rect x="11" y="13" width="2" height="2" rx="0.5" fill="currentColor"/>
    <rect x="15" y="13" width="2" height="2" rx="0.5" fill="currentColor"/>
    <rect x="7"  y="17" width="2" height="2" rx="0.5" fill="currentColor"/>
    <rect x="11" y="17" width="2" height="2" rx="0.5" fill="currentColor"/>
  `,

  /**
   * DateTime — a small calendar overlapping a clock face.
   */
  'type-datetime': `
    <rect x="2" y="4" width="14" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.75"/>
    <path d="M2 9h14" stroke="currentColor" stroke-width="1.5"/>
    <path d="M6 2v4M12 2v4" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>
    <circle cx="18" cy="18" r="4.5" fill="none" stroke="currentColor" stroke-width="1.75"/>
    <path d="M18 15.5v2.5L19.5 19" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
  `,

  /**
   * Time — a clock face with hour and minute hands.
   */
  'type-time': `
    <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/>
    <path d="M12 7v5l3.5 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  `,

  // ── Aggregation types ────────────────────────────────────────────────────

  /**
   * None — a single horizontal dash.
   */
  'agg-none': `
    <path d="M8 12h8" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
  `,

  /**
   * Sum — a Σ (sigma) letterform.
   */
  'agg-sum': `
    <path d="M17 5H8L14 12L8 19H17"
          fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  `,

  /**
   * Average — scattered data points around a dashed mean line.
   */
  'agg-avg': `
    <path d="M3 12h18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="3 2"/>
    <circle cx="7"  cy="8"  r="2" fill="currentColor"/>
    <circle cx="13" cy="16" r="2" fill="currentColor"/>
    <circle cx="18" cy="9"  r="2" fill="currentColor"/>
  `,

  /**
   * Minimum — a downward arrow landing on a floor line.
   */
  'agg-min': `
    <path d="M12 5v13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <path d="M8 14l4 4 4-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M7 20h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  `,

  /**
   * Maximum — an upward arrow rising from a ceiling line.
   */
  'agg-max': `
    <path d="M12 19V6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <path d="M8 10l4-4 4 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M7 4h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  `,

  /**
   * Count — a hash (#) symbol.
   */
  'agg-count': `
    <path d="M8 5L6 19M18 5L16 19M5 10h14M4 15h14"
          stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>
  `,

  /**
   * Count Distinct — a smaller hash with an asterisk badge (uniqueness indicator).
   */
  'agg-count-distinct': `
    <path d="M7 5L5 17M15 5L13 17M4 10h13M3 15h13"
          stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>
    <path d="M19 4v6" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>
    <path d="M17 5l2 2 2-2M17 8l2-2 2 2"
          fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  `,

  // ── Graph field roles ────────────────────────────────────────────────────

  /**
   * X-axis — a rightward arrow along the X axis with a faint Y tick.
   */
  'role-x-axis': `
    <path d="M4 12h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <path d="M16 8l4 4-4 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M4 8v8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
  `,

  /**
   * Y-axis — an upward arrow along the Y axis with a faint X baseline.
   */
  'role-y-axis': `
    <path d="M12 20V4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <path d="M8 8l4-4 4 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M8 20h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
  `,

  /**
   * Series — three zigzag lines at descending opacity (multiple data series).
   */
  'role-series': `
    <path d="M3 7l4-2 4 4 4-3 4-2"
          fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M3 13l4-2 4 4 4-3 4-2"
          fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" opacity="0.55"/>
    <path d="M3 19l4-2 4 4 4-3 4-2"
          fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.3"/>
  `,

  /**
   * Tooltip — a speech-bubble with two text lines.
   */
  'role-tooltip': `
    <path d="M4 5a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3v-3H6a2 2 0 01-2-2V5z"
          fill="none" stroke="currentColor" stroke-width="1.75"/>
    <path d="M9 9h6M9 12h4" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>
  `,

  // ── Sort direction ───────────────────────────────────────────────────────

  /**
   * Ascending sort — upward arrow.
   */
  'sort-asc': `
    <path d="M12 20V4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <path d="M7 9l5-5 5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  `,

  /**
   * Descending sort — downward arrow.
   */
  'sort-desc': `
    <path d="M12 4v16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <path d="M7 15l5 5 5-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  `,

  /**
   * No sort / unsorted — two opposing chevrons (up + down).
   */
  'sort-none': `
    <path d="M8 10l4-6 4 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M8 14l4 6 4-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  `,

  // ── General UI ───────────────────────────────────────────────────────────

  /**
   * Add — a plus (+) sign.
   */
  add: `
    <path d="M12 4v16M4 12h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  `,

  /**
   * Check — a tick / checkmark.
   */
  check: `
    <path d="M4 12l5 5L20 6" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  `,

  /**
   * Chevron down — ˅
   */
  'chevron-down': `
    <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  `,

  /**
   * Chevron left — ‹
   */
  'chevron-left': `
    <path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  `,

  /**
   * Chevron right — ›
   */
  'chevron-right': `
    <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  `,

  /**
   * Chevron up — ˄
   */
  'chevron-up': `
    <path d="M18 15l-6-6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  `,

  /**
   * Copy — two overlapping documents.
   */
  copy: `
    <rect x="9" y="9" width="12" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.75"/>
    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"
          fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>
  `,

  /**
   * Dashboard — a 2×2 grid of tiles.
   */
  dashboard: `
    <rect x="3"  y="3"  width="7" height="7" rx="1.5" fill="currentColor" opacity="0.8"/>
    <rect x="3"  y="14" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.45"/>
    <rect x="14" y="3"  width="7" height="7" rx="1.5" fill="currentColor" opacity="0.45"/>
    <rect x="14" y="14" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.8"/>
  `,

  /**
   * Designer — a pencil / edit icon.
   */
  designer: `
    <path d="M15.5 4.5a2.121 2.121 0 013 3L8 18l-4 1 1-4z"
          fill="none" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round"/>
    <path d="M13.5 6.5L17 10" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>
  `,

  /**
   * Drag handle — a 2×3 grid of dots.
   */
  'drag-handle': `
    <circle cx="9"  cy="7"  r="1.5" fill="currentColor"/>
    <circle cx="15" cy="7"  r="1.5" fill="currentColor"/>
    <circle cx="9"  cy="12" r="1.5" fill="currentColor"/>
    <circle cx="15" cy="12" r="1.5" fill="currentColor"/>
    <circle cx="9"  cy="17" r="1.5" fill="currentColor"/>
    <circle cx="15" cy="17" r="1.5" fill="currentColor"/>
  `,

  /**
   * Error — a circle with an × inside.
   */
  error: `
    <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.75"/>
    <path d="M9 9l6 6M15 9l-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  `,

  /**
   * External link — an arrow exiting a box.
   */
  'external-link': `
    <path d="M14 4h6v6M10 14L20 4"
          fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M11 6H5a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-6"
          fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  `,

  /**
   * Filter — a funnel shape.
   */
  filter: `
    <path d="M3 5h18L15 12v7l-6-3v-4z"
          fill="none" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round"/>
  `,

  /**
   * Info — a circle with a lowercase "i".
   */
  info: `
    <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.75"/>
    <path d="M12 11v5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="12" cy="8.5" r="1.25" fill="currentColor"/>
  `,

  /**
   * Preview — an eye icon.
   */
  preview: `
    <path d="M2 12C4 7 8 4 12 4s8 3 10 8c-2 5-6 8-10 8S4 17 2 12z"
          fill="none" stroke="currentColor" stroke-width="1.75"/>
    <circle cx="12" cy="12" r="3.5" fill="none" stroke="currentColor" stroke-width="1.75"/>
    <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
  `,

  /**
   * Refresh — a circular arrow indicating reload.
   */
  refresh: `
    <path d="M4 4v6h6"
          fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M4 10A8 8 0 1 1 12 20"
          fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  `,

  /**
   * Remove / close — an × (cross).
   */
  remove: `
    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  `,

  /**
   * Search — a magnifying glass.
   */
  search: `
    <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="2"/>
    <path d="M15.5 15.5L20 20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  `,

  /**
   * Settings — a cog / gear.
   */
  settings: `
    <circle cx="12" cy="12" r="3.5" fill="none" stroke="currentColor" stroke-width="1.75"/>
    <path d="M12 2v2M12 20v2M2 12h2M20 12h2
             M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41
             M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
          stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>
  `,

  /**
   * Success — a circle with a checkmark inside.
   */
  success: `
    <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.75"/>
    <path d="M8 12l3 3 5-6"
          fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  `,

  /**
   * Warning — a triangle with a "!" exclamation mark.
   */
  warning: `
    <path d="M12 3L22 20H2z" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round"/>
    <path d="M12 9v5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <circle cx="12" cy="17" r="1" fill="currentColor"/>
  `,

  /**
   * Widget — a card with a header bar and content lines.
   */
  widget: `
    <rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="1.75"/>
    <path d="M3 10h18" stroke="currentColor" stroke-width="1.5"/>
    <path d="M8 14h3M8 17h7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.7"/>
  `,
};
