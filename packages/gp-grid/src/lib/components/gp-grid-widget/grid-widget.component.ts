import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  output,
  computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpGridItem } from '../../models/grid-item.model';

@Component({
  selector: 'gp-grid-widget',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './grid-widget.component.html',
  styleUrl: './grid-widget.component.scss',
  host: {
    class: 'gp-grid-widget-host',
    '[class.gp-grid-widget-locked]': 'isLocked()',
    '[class.gp-grid-widget-fixed]': 'isFixed()',
    '[class.gp-grid-widget-dragging]': 'isDragging()',
    '[class.gp-grid-widget-resizing]': 'isResizing()'
  }
})
export class GpGridWidgetComponent {
  /**
   * Complete item configuration.
   */
  public item = input<GpGridItem | undefined>(undefined);

  /**
   * Widget title displayed in the header.
   */
  public title = input<string>('');

  /**
   * Icon name for the widget header.
   */
  public icon = input<string>('');

  /**
   * Badge text displayed in the header.
   */
  public badge = input<string>('');

  /**
   * Severity styling for badge ('primary' | 'success' | 'warning' | 'danger' | 'info').
   */
  public badgeSeverity = input<string>('primary');

  /**
   * Whether the header bar is rendered.
   * Default: true.
   */
  public showHeader = input<boolean>(true);

  /**
   * Whether the widget is draggable. Overrides item.draggable if provided.
   */
  public draggable = input<boolean | undefined>(undefined);

  /**
   * Whether the widget is resizable. Overrides item.resizable if provided.
   */
  public resizable = input<boolean | undefined>(undefined);

  /**
   * Whether the widget can be closed. Overrides item.closeable if provided.
   */
  public closeable = input<boolean | undefined>(undefined);

  /**
   * Alias for closeable.
   */
  public closable = input<boolean | undefined>(undefined);

  /**
   * Whether the widget is fixed in place.
   */
  public fixed = input<boolean | undefined>(undefined);

  /**
   * Whether the widget is locked in place.
   */
  public locked = input<boolean | undefined>(undefined);

  /**
   * Optional custom CSS class applied to the widget wrapper.
   */
  public customClass = input<string>('');

  /**
   * Runtime flag for active drag state.
   */
  public isDragging = input<boolean>(false);

  /**
   * Runtime flag for active resize state.
   */
  public isResizing = input<boolean>(false);

  // --- OUTPUT EVENTS ---
  public close = output<GpGridItem | undefined>();
  public optionsClick = output<{ event: MouseEvent; item?: GpGridItem }>();
  public lockToggle = output<{ item?: GpGridItem; locked: boolean }>();

  // --- COMPUTED STATE ---
  public effectiveTitle = computed(() => {
    return this.title() || this.item()?.title || '';
  });

  public effectiveIcon = computed(() => {
    return this.icon() || this.item()?.icon || '';
  });

  public isDraggable = computed(() => {
    if (this.isFixed() || this.isLocked()) return false;
    if (this.draggable() !== undefined) return this.draggable()!;
    return this.item()?.draggable ?? true;
  });

  public isResizable = computed(() => {
    if (this.isFixed() || this.isLocked()) return false;
    if (this.resizable() !== undefined) return this.resizable()!;
    return this.item()?.resizable ?? true;
  });

  public isCloseable = computed(() => {
    if (this.closeable() !== undefined) return this.closeable()!;
    if (this.closable() !== undefined) return this.closable()!;
    return this.item()?.closeable ?? true;
  });

  public isFixed = computed(() => {
    if (this.fixed() !== undefined) return this.fixed()!;
    return this.item()?.fixed ?? false;
  });

  public isLocked = computed(() => {
    if (this.locked() !== undefined) return this.locked()!;
    return this.item()?.locked ?? false;
  });

  public onClose(event: MouseEvent): void {
    event.stopPropagation();
    this.close.emit(this.item());
  }

  public onOptions(event: MouseEvent): void {
    event.stopPropagation();
    this.optionsClick.emit({ event, item: this.item() });
  }

  public toggleLock(event: MouseEvent): void {
    event.stopPropagation();
    const nextLocked = !this.isLocked();
    this.lockToggle.emit({ item: this.item(), locked: nextLocked });
  }
}
