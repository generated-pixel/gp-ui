/**
 * Vertical compaction packs widgets upwards to eliminate empty rows.
 * 'none' preserves free-form placement.
 */
export type GpGridCompactType = 'vertical' | 'none';

/**
 * Configuration options for a GpGrid instance.
 */
export interface GpGridOptions {
  /**
   * Total number of columns in the grid.
   * Default: 12.
   */
  columns?: number;

  /**
   * Height of each row in pixels.
   * Default: 80.
   */
  rowHeight?: number;

  /**
   * Spacing/gap between grid items in pixels.
   * Default: 16.
   */
  gap?: number;

  /**
   * Minimum rows rendered in the grid container.
   * Default: 1.
   */
  minRows?: number;

  /**
   * Maximum rows allowed in the grid.
   * Default: 1000.
   */
  maxRows?: number;

  /**
   * Compaction mode.
   * Default: 'vertical'.
   */
  compactType?: GpGridCompactType;

  /**
   * Whether to animate repositioning and realignment transitions.
   * Default: true.
   */
  animate?: boolean;

  /**
   * Read-only mode prevents all drag, resize, and delete operations.
   * Default: false.
   */
  readonly?: boolean;

  /**
   * Whether to display subtle grid column/row guide lines.
   * Default: false.
   */
  showGridLines?: boolean;
}
