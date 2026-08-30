import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  output,
  model,
  signal,
  computed,
  ElementRef,
  inject,
  NgZone,
  OnInit,
  OnDestroy,
  ContentChild,
  TemplateRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpGridItem } from '../../models/grid-item.model';
import { GpGridCompactType } from '../../models/grid-config.model';
import { GpGridChangeEvent } from '../../models/grid-events.model';
import { GpGridEngine } from '../../engine/grid-engine';
import { GpIconComponent, GpEmptyStateComponent, GpTranslationService, GpBadgeSeverity } from '@generatedpixel/gp-ui';
import { GpGridWidgetComponent } from '../gp-grid-widget/grid-widget.component';
import { GpGridKpiWidgetComponent } from '../gp-grid-kpi-widget/grid-kpi-widget.component';
import { GpGridChartWidgetComponent } from '../gp-grid-chart-widget/grid-chart-widget.component';
import { GpGridTableWidgetComponent } from '../gp-grid-table-widget/grid-table-widget.component';
import { GpGridListWidgetComponent } from '../gp-grid-list-widget/grid-list-widget.component';
import { GpGridProgressWidgetComponent } from '../gp-grid-progress-widget/grid-progress-widget.component';

export interface DragState {
  itemId: string;
  startX: number;
  startY: number;
  startPixelX: number;
  startPixelY: number;
  currentPixelX: number;
  currentPixelY: number;
  targetCol: number;
  targetRow: number;
  originalItem: GpGridItem;
}

export interface ResizeState {
  itemId: string;
  startX: number;
  startY: number;
  startW: number;
  startH: number;
  targetW: number;
  targetH: number;
  originalItem: GpGridItem;
}

@Component({
  selector: 'gp-grid',
  standalone: true,
  imports: [
    CommonModule,
    GpGridWidgetComponent,
    GpGridKpiWidgetComponent,
    GpGridChartWidgetComponent,
    GpGridTableWidgetComponent,
    GpGridListWidgetComponent,
    GpGridProgressWidgetComponent,
    GpEmptyStateComponent,
    GpIconComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss',
  host: {
    class: 'gp-grid-host',
    '[class.gp-grid--dragging]': 'isDragging()',
    '[class.gp-grid--resizing]': 'isResizing()',
    '[class.gp-grid--show-gridlines]': 'showGridLines()',
    '[style.min-height.px]': 'gridPixelHeight()'
  }
})
export class GpGridComponent implements OnInit, OnDestroy {
  private elementRef = inject(ElementRef);
  private ngZone = inject(NgZone);
  private translationService = inject(GpTranslationService, { optional: true });

  // --- SIGNALS (Inputs & Model) ---
  /**
   * Two-way bound signal for grid items.
   */
  public items = model<GpGridItem[]>([]);

  /**
   * Number of columns in the grid layout (e.g. 12).
   */
  public columns = input<number>(12);

  /**
   * Height of each row in pixels.
   */
  public rowHeight = input<number>(80);

  /**
   * Spacing / gap between widgets in pixels.
   */
  public gap = input<number>(16);

  /**
   * Minimum rows rendered in the grid container.
   */
  public minRows = input<number>(2);

  /**
   * Compaction mode: 'vertical' packs items upwards; 'none' allows free placement.
   */
  public compactType = input<GpGridCompactType>('vertical');

  /**
   * Whether to animate layout transitions.
   */
  public animate = input<boolean>(true);

  /**
   * Read-only mode disables all dragging and resizing.
   */
  public readonly = input<boolean>(false);

  /**
   * Whether to display subtle grid column and row guide lines.
   */
  public showGridLines = input<boolean>(false);

  /**
   * Localizable title text when grid is empty.
   */
  public emptyTitle = input<string>('');

  /**
   * Localizable description text when grid is empty.
   */
  public emptyMessage = input<string>('');

  /**
   * Localizable tooltip for the widget corner resize handle.
   */
  public resizeHandleTitle = input<string>('');

  /**
   * Localizable accessibility aria-label for the widget corner resize handle.
   */
  public resizeHandleAriaLabel = input<string>('');

  /**
   * Localizable aria-label for the grid container landmark region.
   */
  public ariaLabel = input<string>('');

  /**
   * Custom empty state template.
   */
  @ContentChild('emptyTemplate') public emptyTemplate?: TemplateRef<any>;

  /**
   * Custom widget content template.
   */
  @ContentChild('widgetTemplate') public widgetTemplate?: TemplateRef<{ $implicit: GpGridItem }>;

  // --- LOCALIZATION & ACCESSIBILITY COMPUTED PROPERTIES ---
  public effectiveEmptyTitle = computed(() => {
    return this.emptyTitle() || this.translationService?.translation().grid?.emptyTitle || 'Grid Canvas is Empty';
  });

  public effectiveEmptyMessage = computed(() => {
    return this.emptyMessage() || this.translationService?.translation().grid?.emptyMessage || 'No widgets placed on this grid. Add widgets dynamically using the grid controls or API.';
  });

  public effectiveResizeHandleTitle = computed(() => {
    return this.resizeHandleTitle() || this.translationService?.translation().grid?.resizeHandle || 'Drag to resize';
  });

  public effectiveResizeHandleAriaLabel = computed(() => {
    return this.resizeHandleAriaLabel() || this.effectiveResizeHandleTitle();
  });

  public effectiveAriaLabel = computed(() => {
    return this.ariaLabel() || this.translationService?.translation().grid?.ariaLabel || 'Grid layout';
  });

  // --- OUTPUT EVENTS ---
  public itemMoved = output<GpGridChangeEvent>();
  public itemResized = output<GpGridChangeEvent>();
  public itemRemoved = output<GpGridItem>();
  public itemOptionsClick = output<{ event: MouseEvent; item: GpGridItem }>();
  public itemNavigate = output<{ routerLink: string | any[]; queryParams?: Record<string, any>; item: GpGridItem }>();
  public itemClick = output<{ data?: any; item: GpGridItem }>();
  public layoutChanged = output<GpGridItem[]>();

  // --- INTERNAL REACTIVE STATE ---
  public containerWidth = signal<number>(1200);
  public previewItems = signal<GpGridItem[] | null>(null);
  public activeDrag = signal<DragState | null>(null);
  public activeResize = signal<ResizeState | null>(null);
  public placeholderPos = signal<{ x: number; y: number; w: number; h: number; valid: boolean } | null>(null);

  private resizeObserver?: ResizeObserver;
  private cleanupListeners: (() => void)[] = [];

  // --- COMPUTED STATE ---
  public isDragging = computed(() => this.activeDrag() !== null);
  public isResizing = computed(() => this.activeResize() !== null);

  public displayItems = computed(() => {
    return this.previewItems() ?? this.items();
  });

  public columnWidth = computed(() => {
    const cols = Math.max(1, this.columns());
    const g = this.gap();
    const width = this.containerWidth();
    const available = Math.max(0, width - (cols - 1) * g);
    return available / cols;
  });

  public totalRows = computed(() => {
    const itemsList = this.displayItems();
    return GpGridEngine.calculateRowCount(itemsList, this.minRows());
  });

  public gridPixelHeight = computed(() => {
    const rows = this.totalRows();
    const rHeight = this.rowHeight();
    const g = this.gap();
    return rows * rHeight + Math.max(0, rows - 1) * g;
  });

  public gridGuideCols = computed(() => {
    return Array.from({ length: this.columns() }, (_, i) => i);
  });

  public gridGuideRows = computed(() => {
    return Array.from({ length: Math.max(this.totalRows(), this.minRows()) }, (_, i) => i);
  });

  public ngOnInit(): void {
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const w = entry.contentRect.width;
          if (w > 0) {
            this.containerWidth.set(w);
          }
        }
      });
      this.resizeObserver.observe(this.elementRef.nativeElement);
    }
  }

  public asBadgeSeverity(sev?: string): GpBadgeSeverity {
    if (
      sev === 'primary' ||
      sev === 'secondary' ||
      sev === 'success' ||
      sev === 'warning' ||
      sev === 'danger' ||
      sev === 'info' ||
      sev === 'contrast'
    ) {
      return sev;
    }
    return 'primary';
  }

  public ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.removeGlobalListeners();
  }

  /**
   * Computes CSS style object for positioning and sizing a grid widget item.
   */
  public getItemStyle(item: GpGridItem): Record<string, string> {
    const colW = this.columnWidth();
    const rowH = this.rowHeight();
    const g = this.gap();

    const isDraggingThis = this.activeDrag()?.itemId === item.id;
    const isResizingThis = this.activeResize()?.itemId === item.id;

    let leftPx: number;
    let topPx: number;
    let widthPx: number;
    let heightPx: number;

    if (isDraggingThis && this.activeDrag()) {
      const drag = this.activeDrag()!;
      leftPx = drag.currentPixelX;
      topPx = drag.currentPixelY;
      widthPx = item.w * colW + (item.w - 1) * g;
      heightPx = item.h * rowH + (item.h - 1) * g;
    } else if (isResizingThis && this.activeResize()) {
      const res = this.activeResize()!;
      leftPx = item.x * (colW + g);
      topPx = item.y * (rowH + g);
      widthPx = res.targetW * colW + (res.targetW - 1) * g;
      heightPx = res.targetH * rowH + (res.targetH - 1) * g;
    } else {
      leftPx = item.x * (colW + g);
      topPx = item.y * (rowH + g);
      widthPx = item.w * colW + (item.w - 1) * g;
      heightPx = item.h * rowH + (item.h - 1) * g;
    }

    return {
      transform: `translate3d(${Math.round(leftPx)}px, ${Math.round(topPx)}px, 0)`,
      width: `${Math.max(20, Math.round(widthPx))}px`,
      height: `${Math.max(20, Math.round(heightPx))}px`,
      transition:
        isDraggingThis || !this.animate()
          ? 'none'
          : 'transform 0.22s cubic-bezier(0.2, 0, 0, 1), width 0.22s cubic-bezier(0.2, 0, 0, 1), height 0.22s cubic-bezier(0.2, 0, 0, 1)',
      zIndex: isDraggingThis ? '100' : isResizingThis ? '90' : '1'
    };
  }

  /**
   * Computes CSS style for the drop destination ghost placeholder.
   */
  public getPlaceholderStyle(): Record<string, string> {
    const ph = this.placeholderPos();
    if (!ph) return { display: 'none' };

    const colW = this.columnWidth();
    const rowH = this.rowHeight();
    const g = this.gap();

    const leftPx = ph.x * (colW + g);
    const topPx = ph.y * (rowH + g);
    const widthPx = ph.w * colW + (ph.w - 1) * g;
    const heightPx = ph.h * rowH + (ph.h - 1) * g;

    return {
      transform: `translate3d(${Math.round(leftPx)}px, ${Math.round(topPx)}px, 0)`,
      width: `${Math.round(widthPx)}px`,
      height: `${Math.round(heightPx)}px`,
      transition: this.animate()
        ? 'transform 0.15s cubic-bezier(0.2, 0, 0, 1), width 0.15s ease, height 0.15s ease'
        : 'none'
    };
  }

  // --- DRAG INTERACTION ---
  public onWidgetPointerDown(event: PointerEvent, item: GpGridItem): void {
    if (this.readonly() || item.fixed || item.locked || item.draggable === false) {
      return;
    }

    const target = event.target as HTMLElement;

    // Check if clicked inside resize handle, close button, or options button
    if (
      target.closest('.gp-grid-widget-resize-handle') ||
      target.closest('.gp-grid-widget-action-btn') ||
      target.closest('button') ||
      target.closest('input') ||
      target.closest('select') ||
      target.closest('textarea')
    ) {
      return;
    }

    const isHeaderOrHandle =
      target.closest('.gp-grid-widget-drag-handle') ||
      target.closest('.gp-grid-drag-handle') ||
      target.closest('.gp-grid-widget-header');

    if (!isHeaderOrHandle) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const colW = this.columnWidth();
    const rowH = this.rowHeight();
    const g = this.gap();

    const startPixelX = item.x * (colW + g);
    const startPixelY = item.y * (rowH + g);

    const dragState: DragState = {
      itemId: item.id,
      startX: event.clientX,
      startY: event.clientY,
      startPixelX,
      startPixelY,
      currentPixelX: startPixelX,
      currentPixelY: startPixelY,
      targetCol: item.x,
      targetRow: item.y,
      originalItem: { ...item }
    };

    this.activeDrag.set(dragState);
    this.placeholderPos.set({ x: item.x, y: item.y, w: item.w, h: item.h, valid: true });

    this.ngZone.runOutsideAngular(() => {
      const onPointerMove = (e: PointerEvent) => this.handleDragMove(e);
      const onPointerUp = (e: PointerEvent) => this.handleDragEnd(e);

      window.addEventListener('pointermove', onPointerMove, { passive: false });
      window.addEventListener('pointerup', onPointerUp);
      window.addEventListener('pointercancel', onPointerUp);

      this.cleanupListeners.push(() => {
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
        window.removeEventListener('pointercancel', onPointerUp);
      });
    });
  }

  private handleDragMove(e: PointerEvent): void {
    const drag = this.activeDrag();
    if (!drag) return;

    e.preventDefault();

    const deltaX = e.clientX - drag.startX;
    const deltaY = e.clientY - drag.startY;

    const currentPixelX = drag.startPixelX + deltaX;
    const currentPixelY = drag.startPixelY + deltaY;

    const colW = this.columnWidth();
    const rowH = this.rowHeight();
    const g = this.gap();
    const cols = this.columns();

    // Calculate tentative grid column & row
    let tentativeCol = Math.round(currentPixelX / (colW + g));
    let tentativeRow = Math.round(currentPixelY / (rowH + g));

    tentativeCol = Math.max(0, Math.min(cols - drag.originalItem.w, tentativeCol));
    tentativeRow = Math.max(0, tentativeRow);

    const candidate: GpGridItem = {
      ...drag.originalItem,
      x: tentativeCol,
      y: tentativeRow
    };

    // Check collision with locked items
    const isOverlappingLocked = GpGridEngine.overlapsLockedItem(candidate, this.items());

    this.ngZone.run(() => {
      this.activeDrag.set({
        ...drag,
        currentPixelX,
        currentPixelY,
        targetCol: tentativeCol,
        targetRow: tentativeRow
      });

      if (isOverlappingLocked) {
        // Locked items cannot be displaced or dropped on!
        this.placeholderPos.set({
          x: tentativeCol,
          y: tentativeRow,
          w: drag.originalItem.w,
          h: drag.originalItem.h,
          valid: false
        });
      } else {
        this.placeholderPos.set({
          x: tentativeCol,
          y: tentativeRow,
          w: drag.originalItem.w,
          h: drag.originalItem.h,
          valid: true
        });

        // Realign non-locked items in live preview
        const realigned = GpGridEngine.realignGrid(
          this.items(),
          candidate,
          cols,
          this.compactType()
        );
        this.previewItems.set(realigned);
      }
    });
  }

  private handleDragEnd(e: PointerEvent): void {
    const drag = this.activeDrag();
    this.removeGlobalListeners();

    if (!drag) return;

    this.ngZone.run(() => {
      const ph = this.placeholderPos();
      let updatedItems: GpGridItem[];

      if (ph && ph.valid) {
        const finalItem: GpGridItem = {
          ...drag.originalItem,
          x: ph.x,
          y: ph.y
        };

        updatedItems = GpGridEngine.realignGrid(
          this.items(),
          finalItem,
          this.columns(),
          this.compactType()
        );

        const changeEvent: GpGridChangeEvent = {
          item: finalItem,
          oldX: drag.originalItem.x,
          oldY: drag.originalItem.y,
          oldW: drag.originalItem.w,
          oldH: drag.originalItem.h,
          newX: finalItem.x,
          newY: finalItem.y,
          newW: finalItem.w,
          newH: finalItem.h,
          allItems: updatedItems
        };

        this.items.set(updatedItems);
        this.itemMoved.emit(changeEvent);
        this.layoutChanged.emit(updatedItems);
      } else {
        // Drop was invalid / over a locked item - revert to previous state
        updatedItems = this.items();
      }

      this.previewItems.set(null);
      this.activeDrag.set(null);
      this.placeholderPos.set(null);
    });
  }

  // --- RESIZE INTERACTION ---
  public onResizePointerDown(event: PointerEvent, item: GpGridItem): void {
    if (this.readonly() || item.fixed || item.locked || item.resizable === false) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const resizeState: ResizeState = {
      itemId: item.id,
      startX: event.clientX,
      startY: event.clientY,
      startW: item.w,
      startH: item.h,
      targetW: item.w,
      targetH: item.h,
      originalItem: { ...item }
    };

    this.activeResize.set(resizeState);
    this.placeholderPos.set({ x: item.x, y: item.y, w: item.w, h: item.h, valid: true });

    this.ngZone.runOutsideAngular(() => {
      const onPointerMove = (e: PointerEvent) => this.handleResizeMove(e);
      const onPointerUp = (e: PointerEvent) => this.handleResizeEnd(e);

      window.addEventListener('pointermove', onPointerMove, { passive: false });
      window.addEventListener('pointerup', onPointerUp);
      window.addEventListener('pointercancel', onPointerUp);

      this.cleanupListeners.push(() => {
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
        window.removeEventListener('pointercancel', onPointerUp);
      });
    });
  }

  private handleResizeMove(e: PointerEvent): void {
    const res = this.activeResize();
    if (!res) return;

    e.preventDefault();

    const deltaX = e.clientX - res.startX;
    const deltaY = e.clientY - res.startY;

    const colW = this.columnWidth();
    const rowH = this.rowHeight();
    const g = this.gap();
    const cols = this.columns();

    const deltaCols = Math.round(deltaX / (colW + g));
    const deltaRows = Math.round(deltaY / (rowH + g));

    const minW = Math.max(1, res.originalItem.minW ?? 1);
    const maxW = Math.min(cols - res.originalItem.x, res.originalItem.maxW ?? cols);
    const minH = Math.max(1, res.originalItem.minH ?? 1);
    const maxH = res.originalItem.maxH ?? 1000;

    const targetW = Math.max(minW, Math.min(maxW, res.startW + deltaCols));
    const targetH = Math.max(minH, Math.min(maxH, res.startH + deltaRows));

    const candidate: GpGridItem = {
      ...res.originalItem,
      w: targetW,
      h: targetH
    };

    const isOverlappingLocked = GpGridEngine.overlapsLockedItem(candidate, this.items());

    this.ngZone.run(() => {
      this.activeResize.set({
        ...res,
        targetW,
        targetH
      });

      if (isOverlappingLocked) {
        this.placeholderPos.set({
          x: res.originalItem.x,
          y: res.originalItem.y,
          w: targetW,
          h: targetH,
          valid: false
        });
      } else {
        this.placeholderPos.set({
          x: res.originalItem.x,
          y: res.originalItem.y,
          w: targetW,
          h: targetH,
          valid: true
        });

        const realigned = GpGridEngine.resolveResize(
          this.items(),
          candidate,
          cols
        );
        this.previewItems.set(realigned);
      }
    });
  }

  private handleResizeEnd(e: PointerEvent): void {
    const res = this.activeResize();
    this.removeGlobalListeners();

    if (!res) return;

    this.ngZone.run(() => {
      const ph = this.placeholderPos();
      let updatedItems: GpGridItem[];

      if (ph && ph.valid) {
        const finalItem: GpGridItem = {
          ...res.originalItem,
          w: ph.w,
          h: ph.h
        };

        updatedItems = GpGridEngine.resolveResize(
          this.items(),
          finalItem,
          this.columns()
        );

        const changeEvent: GpGridChangeEvent = {
          item: finalItem,
          oldX: res.originalItem.x,
          oldY: res.originalItem.y,
          oldW: res.originalItem.w,
          oldH: res.originalItem.h,
          newX: finalItem.x,
          newY: finalItem.y,
          newW: finalItem.w,
          newH: finalItem.h,
          allItems: updatedItems
        };

        this.items.set(updatedItems);
        this.itemResized.emit(changeEvent);
        this.layoutChanged.emit(updatedItems);
      } else {
        updatedItems = this.items();
      }

      this.previewItems.set(null);
      this.activeResize.set(null);
      this.placeholderPos.set(null);
    });
  }

  // --- ITEM ACTIONS ---
  public onWidgetClose(item: GpGridItem): void {
    if (this.readonly()) return;

    const remaining = this.items().filter((i) => i.id !== item.id);
    this.items.set(remaining);
    this.itemRemoved.emit(item);
    this.layoutChanged.emit(remaining);
  }

  public onWidgetOptions(event: { event: MouseEvent; item?: GpGridItem }, fallbackItem: GpGridItem): void {
    const it = event.item || fallbackItem;
    this.itemOptionsClick.emit({ event: event.event, item: it });
  }

  public onWidgetLockToggle(event: { item?: GpGridItem; locked: boolean }, fallbackItem: GpGridItem): void {
    const targetItem = event.item || fallbackItem;
    const updated = this.items().map((it) =>
      it.id === targetItem.id ? { ...it, locked: event.locked } : it
    );
    this.items.set(updated);
    this.layoutChanged.emit(updated);
  }

  /**
   * Helper method to programmatically add a new widget at the next available position.
   */
  public addWidget(
    widgetPartial: Partial<GpGridItem> & { id: string },
    w = 4,
    h = 2
  ): GpGridItem {
    const pos = GpGridEngine.findAvailablePosition(
      this.items(),
      widgetPartial.w || w,
      widgetPartial.h || h,
      this.columns()
    );

    const newItem: GpGridItem = {
      x: pos.x,
      y: pos.y,
      w: widgetPartial.w || w,
      h: widgetPartial.h || h,
      draggable: true,
      resizable: true,
      closeable: true,
      fixed: false,
      locked: false,
      ...widgetPartial
    };

    const nextList = [...this.items(), newItem];
    this.items.set(nextList);
    this.layoutChanged.emit(nextList);
    return newItem;
  }

  /**
   * Helper method to remove a widget by ID.
   */
  public removeWidget(id: string): void {
    const item = this.items().find((i) => i.id === id);
    if (item) {
      this.onWidgetClose(item);
    }
  }

  /**
   * Compact the grid layout immediately.
   */
  public compact(): void {
    const current = this.items();
    const compacted = GpGridEngine.compactGrid(
      current.map((i) => ({ ...i })),
      undefined,
      this.columns()
    );
    this.items.set(compacted);
    this.layoutChanged.emit(compacted);
  }

  private removeGlobalListeners(): void {
    while (this.cleanupListeners.length > 0) {
      const cleanup = this.cleanupListeners.pop();
      if (cleanup) cleanup();
    }
  }
}
