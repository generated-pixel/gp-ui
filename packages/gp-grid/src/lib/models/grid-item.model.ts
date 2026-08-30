import { GpGridWidgetType } from './grid-widget.model';

/**
 * GpGridItem defines the layout coordinates, constraints, and configuration
 * for a single widget within a GpGrid system.
 */
export interface GpGridItem<T = any> {
  /**
   * Unique identifier for the grid widget item.
   */
  id: string;

  /**
   * Column index (0-based) where the item starts.
   */
  x: number;

  /**
   * Row index (0-based) where the item starts.
   */
  y: number;

  /**
   * Width of the item measured in grid columns (minimum 1).
   */
  w: number;

  /**
   * Height of the item measured in grid rows (minimum 1).
   */
  h: number;

  /**
   * Minimum allowable width in columns.
   */
  minW?: number;

  /**
   * Maximum allowable width in columns.
   */
  maxW?: number;

  /**
   * Minimum allowable height in rows.
   */
  minH?: number;

  /**
   * Maximum allowable height in rows.
   */
  maxH?: number;

  /**
   * Title displayed in the widget header.
   */
  title?: string;

  /**
   * Icon name displayed alongside the title in the header.
   */
  icon?: string;

  /**
   * Badge text displayed in the header.
   */
  badge?: string;

  /**
   * Badge color severity ('primary' | 'success' | 'warning' | 'danger' | 'info').
   */
  badgeSeverity?: string;

  /**
   * Whether this widget can be dragged by the user.
   * Default is true.
   */
  draggable?: boolean;

  /**
   * Whether this widget can be resized by the user.
   * Default is true.
   */
  resizable?: boolean;

  /**
   * Whether this widget can be closed/removed by the user via the close button.
   * Default is true.
   */
  closeable?: boolean;

  /**
   * Fixed in place: cannot be moved or resized by user dragging, but may still
   * be realigned if displaced, unless also locked.
   * Default is false.
   */
  fixed?: boolean;

  /**
   * Locked in place: will NEVER move under any circumstance when other widgets
   * are dragged around. Moving widgets CANNOT be dropped on top of a locked widget.
   * Default is false.
   */
  locked?: boolean;

  /**
   * Built-in widget renderer type.
   */
  widgetType?: GpGridWidgetType;

  /**
   * Structured data payload for typed widgets (KPI, Chart, Table, List, Progress).
   */
  widgetData?: any;

  /**
   * Whether the widget is currently in a loading state.
   */
  loading?: boolean;

  /**
   * Whether the widget body is collapsed.
   */
  collapsed?: boolean;

  /**
   * Custom application payload attached to this item.
   */
  customData?: T;

  /**
   * Optional custom CSS class applied to the widget card.
   */
  customClass?: string;

  /**
   * Additional metadata properties.
   */
  [key: string]: any;
}

/**
 * Internal position state used for pixel-level calculations during interaction.
 */
export interface GpGridItemPosition {
  x: number;
  y: number;
  w: number;
  h: number;
  leftPx: number;
  topPx: number;
  widthPx: number;
  heightPx: number;
}
