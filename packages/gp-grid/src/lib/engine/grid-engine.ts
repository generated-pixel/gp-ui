import { GpGridItem } from '../models/grid-item.model';
import { GpGridCompactType } from '../models/grid-config.model';

export class GpGridEngine {
  /**
   * Check if two grid items overlap in 2D grid space.
   */
  public static doItemsOverlap(
    a: { x: number; y: number; w: number; h: number },
    b: { x: number; y: number; w: number; h: number }
  ): boolean {
    return !(
      a.x + a.w <= b.x ||
      b.x + b.w <= a.x ||
      a.y + a.h <= b.y ||
      b.y + b.h <= a.y
    );
  }

  /**
   * Clamp an item's position and size to remain within grid boundaries.
   */
  public static clampItem(
    item: GpGridItem,
    columns: number,
    maxRows = 1000
  ): GpGridItem {
    const minW = Math.max(1, item.minW ?? 1);
    const maxW = Math.min(columns, item.maxW ?? columns);
    const minH = Math.max(1, item.minH ?? 1);
    const maxH = Math.min(maxRows, item.maxH ?? maxRows);

    let w = Math.max(minW, Math.min(maxW, item.w || 1));
    let h = Math.max(minH, Math.min(maxH, item.h || 1));

    w = Math.min(w, columns);

    let x = Math.max(0, Math.min(columns - w, item.x || 0));
    let y = Math.max(0, item.y || 0);

    return {
      ...item,
      x,
      y,
      w,
      h
    };
  }

  /**
   * Check if a candidate position overlaps with any locked items in the grid.
   */
  public static overlapsLockedItem(
    candidate: { id?: string; x: number; y: number; w: number; h: number },
    items: GpGridItem[]
  ): boolean {
    return items.some(
      (item) =>
        item.locked &&
        item.id !== candidate.id &&
        this.doItemsOverlap(candidate, item)
    );
  }

  /**
   * Resolve collisions and realign grid items dynamically.
   * Locked items never move under any circumstances.
   * Non-locked items will dynamically shift downwards out of the way.
   * If a target position overlaps a locked item, placement is blocked and
   * the nearest valid position is used.
   */
  public static realignGrid(
    items: GpGridItem[],
    movingItem: GpGridItem,
    columns: number,
    compactType: GpGridCompactType = 'vertical'
  ): GpGridItem[] {
    // Clone all items
    const result: GpGridItem[] = items.map((it) =>
      it.id === movingItem.id ? { ...movingItem } : { ...it }
    );

    // If movingItem overlaps any locked item, placement cannot occur directly there.
    // In this case, we keep the moving item at its last valid or clamped position.
    if (this.overlapsLockedItem(movingItem, items)) {
      return items;
    }

    // Step 1: Cascade-displace non-locked items that overlap with the moving item
    const placedItem = result.find((it) => it.id === movingItem.id)!;
    this.resolveCascadingCollisions(result, placedItem, columns);

    // Step 2: If vertical compaction is enabled, pack items upwards without violating locked items
    if (compactType === 'vertical') {
      this.compactGrid(result, movingItem.id, columns);
    }

    return result;
  }

  /**
   * Resolve layout during widget resize.
   * Unless the resized widget directly overlaps another widget, none of the other
   * widgets in the grid will move or change positions.
   */
  public static resolveResize(
    items: GpGridItem[],
    resizedItem: GpGridItem,
    columns: number
  ): GpGridItem[] {
    // If resizedItem overlaps any locked item, placement is blocked
    if (this.overlapsLockedItem(resizedItem, items)) {
      return items;
    }

    // Clone all items with the resizedItem's new dimensions
    const result: GpGridItem[] = items.map((it) =>
      it.id === resizedItem.id ? { ...resizedItem } : { ...it }
    );

    // Only cascade-displace items that actually overlap with resizedItem
    const placedItem = result.find((it) => it.id === resizedItem.id)!;
    this.resolveCascadingCollisions(result, placedItem, columns);

    return result;
  }

  /**
   * Cascading collision resolver.
   */
  private static resolveCascadingCollisions(
    items: GpGridItem[],
    triggerItem: GpGridItem,
    columns: number
  ): void {
    const queue: GpGridItem[] = [triggerItem];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (visited.has(current.id)) {
        continue;
      }
      visited.add(current.id);

      // Find all other items that collide with `current`
      const collidingItems = items.filter(
        (it) => it.id !== current.id && !it.locked && this.doItemsOverlap(it, current)
      );

      for (const colItem of collidingItems) {
        // Displace downwards below current item
        let newY = current.y + current.h;

        // Ensure displaced item doesn't land directly on a locked item
        colItem.y = newY;
        let adjusted = true;
        while (adjusted) {
          adjusted = false;
          for (const other of items) {
            if (other.id !== colItem.id && other.locked && this.doItemsOverlap(colItem, other)) {
              colItem.y = other.y + other.h;
              adjusted = true;
            }
          }
        }

        // Clamp item
        colItem.x = Math.max(0, Math.min(columns - colItem.w, colItem.x));
        queue.push(colItem);
      }
    }
  }

  /**
   * Vertically compact all non-locked items towards y=0 without causing overlaps.
   */
  public static compactGrid(
    items: GpGridItem[],
    excludedId?: string,
    columns = 12
  ): GpGridItem[] {
    // Sort items top-to-bottom, left-to-right
    const sorted = [...items].sort((a, b) => {
      if (a.y !== b.y) return a.y - b.y;
      return a.x - b.x;
    });

    for (const item of sorted) {
      // Locked items and the item currently being actively dragged are not compacted
      if (item.locked || (excludedId && item.id === excludedId)) {
        continue;
      }

      // Try decrementing y towards 0
      while (item.y > 0) {
        const testItem = { ...item, y: item.y - 1 };
        const hasCollision = items.some(
          (other) =>
            other.id !== item.id && this.doItemsOverlap(testItem, other)
        );

        if (!hasCollision) {
          item.y -= 1;
        } else {
          break;
        }
      }
    }

    return items;
  }

  /**
   * Find the next available non-overlapping position in the grid for a new item.
   */
  public static findAvailablePosition(
    items: GpGridItem[],
    w: number,
    h: number,
    columns: number
  ): { x: number; y: number } {
    const clampedW = Math.max(1, Math.min(columns, w));
    const clampedH = Math.max(1, h);

    let y = 0;
    while (true) {
      for (let x = 0; x <= columns - clampedW; x++) {
        const candidate = { x, y, w: clampedW, h: clampedH };
        const hasCollision = items.some((item) =>
          this.doItemsOverlap(candidate, item)
        );

        if (!hasCollision) {
          return { x, y };
        }
      }
      y++;
    }
  }

  /**
   * Calculate the total row count needed to enclose all grid items.
   */
  public static calculateRowCount(items: GpGridItem[], minRows = 1): number {
    let max = minRows;
    for (const item of items) {
      const bottom = (item.y || 0) + (item.h || 1);
      if (bottom > max) {
        max = bottom;
      }
    }
    return max;
  }
}
