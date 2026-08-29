import { GpGridItem } from './grid-item.model';

/**
 * Event emitted when an item changes its position or dimensions.
 */
export interface GpGridChangeEvent {
  item: GpGridItem;
  oldX: number;
  oldY: number;
  oldW: number;
  oldH: number;
  newX: number;
  newY: number;
  newW: number;
  newH: number;
  allItems: GpGridItem[];
}

/**
 * Event emitted during or after item drag operations.
 */
export interface GpGridDragEvent {
  item: GpGridItem;
  x: number;
  y: number;
  pixelX: number;
  pixelY: number;
  rawEvent?: MouseEvent | TouchEvent | PointerEvent;
}

/**
 * Event emitted during or after item resize operations.
 */
export interface GpGridResizeEvent {
  item: GpGridItem;
  w: number;
  h: number;
  pixelWidth: number;
  pixelHeight: number;
  rawEvent?: MouseEvent | TouchEvent | PointerEvent;
}

/**
 * Event emitted when a widget close action is triggered.
 */
export interface GpGridCloseEvent {
  item: GpGridItem;
  removed: boolean;
}

/**
 * Event emitted when a widget lock state is toggled.
 */
export interface GpGridLockToggleEvent {
  item: GpGridItem;
  locked: boolean;
}
