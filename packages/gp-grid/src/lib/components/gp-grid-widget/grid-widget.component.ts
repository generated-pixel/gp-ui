import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  output,
  computed,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GpIconComponent, GpBadgeComponent, GpTranslationService, GpBadgeSeverity } from '@generatedpixel/gp-ui';
import { GpGridItem } from '../../models/grid-item.model';
import { GpWidgetAction } from '../../models/grid-widget.model';
import { executeWidgetNavigation } from '../../services/widget-data-resolver';

@Component({
  selector: 'gp-grid-widget',
  standalone: true,
  imports: [CommonModule, GpIconComponent, GpBadgeComponent],
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
  private translationService = inject(GpTranslationService, { optional: true });
  private router = inject(Router, { optional: true });

  /**
   * Complete item configuration.
   */
  public item = input<GpGridItem | undefined>(undefined);

  /**
   * Widget title displayed in the header.
   */
  public title = input<string>('');

  /**
   * Widget subtitle displayed in the header.
   */
  public subtitle = input<string>('');

  /**
   * Icon name for the widget header.
   */
  public icon = input<string>('');

  /**
   * Badge text displayed in the header.
   */
  public badge = input<string>('');

  /**
   * Severity styling for badge ('primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info').
   */
  public badgeSeverity = input<GpBadgeSeverity>('primary');

  /**
   * Header action buttons.
   */
  public actions = input<GpWidgetAction[] | undefined>(undefined);

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

  /**
   * Localizable tooltip for the drag handle.
   */
  public dragHandleTitle = input<string>('');

  /**
   * Localizable accessibility aria-label for the drag handle.
   */
  public dragHandleAriaLabel = input<string>('');

  /**
   * Localizable tooltip for the locked badge.
   */
  public lockedBadgeTitle = input<string>('');

  /**
   * Localizable accessibility aria-label for the locked badge.
   */
  public lockedBadgeAriaLabel = input<string>('');

  /**
   * Localizable tooltip for options menu button.
   */
  public optionsTitle = input<string>('');

  /**
   * Localizable accessibility aria-label for options menu button.
   */
  public optionsAriaLabel = input<string>('');

  /**
   * Localizable tooltip for close button.
   */
  public closeTitle = input<string>('');

  /**
   * Localizable accessibility aria-label for close button.
   */
  public closeAriaLabel = input<string>('');

  /**
   * Localizable tooltip for resize handle.
   */
  public resizeHandleTitle = input<string>('');

  /**
   * Localizable accessibility aria-label for resize handle.
   */
  public resizeHandleAriaLabel = input<string>('');

  // --- OUTPUT EVENTS ---
  public close = output<GpGridItem | undefined>();
  public optionsClick = output<{ event: MouseEvent; item?: GpGridItem }>();
  public lockToggle = output<{ item?: GpGridItem; locked: boolean }>();
  public actionClick = output<{ event: MouseEvent; action: GpWidgetAction; item?: GpGridItem }>();
  public navigate = output<{ routerLink: string | any[]; queryParams?: Record<string, any> }>();

  // --- COMPUTED STATE ---
  public effectiveTitle = computed(() => {
    return this.title() || this.item()?.title || '';
  });

  public effectiveSubtitle = computed(() => {
    return this.subtitle() || this.item()?.subtitle || '';
  });

  public effectiveIcon = computed(() => {
    return this.icon() || this.item()?.icon || '';
  });

  public effectiveActions = computed<GpWidgetAction[]>(() => {
    if (this.actions() && this.actions()!.length > 0) return this.actions()!;
    if (this.item()?.actions && this.item()!.actions!.length > 0) return this.item()!.actions!;
    return [];
  });

  public effectiveDragHandleTitle = computed(() => {
    return this.dragHandleTitle() || this.translationService?.translation().grid?.dragHandle || 'Drag to reposition widget';
  });

  public effectiveDragHandleAriaLabel = computed(() => {
    return this.dragHandleAriaLabel() || this.effectiveDragHandleTitle();
  });

  public effectiveLockedBadgeTitle = computed(() => {
    return this.lockedBadgeTitle() || this.translationService?.translation().grid?.lockedBadge || 'Widget is locked in place';
  });

  public effectiveLockedBadgeAriaLabel = computed(() => {
    return this.lockedBadgeAriaLabel() || this.effectiveLockedBadgeTitle();
  });

  public effectiveOptionsTitle = computed(() => {
    return this.optionsTitle() || this.translationService?.translation().grid?.options || 'Widget options';
  });

  public effectiveOptionsAriaLabel = computed(() => {
    return this.optionsAriaLabel() || this.effectiveOptionsTitle();
  });

  public effectiveCloseTitle = computed(() => {
    return this.closeTitle() || this.translationService?.translation().grid?.close || 'Remove widget';
  });

  public effectiveCloseAriaLabel = computed(() => {
    return this.closeAriaLabel() || this.effectiveCloseTitle();
  });

  public effectiveResizeTitle = computed(() => {
    return this.resizeHandleTitle() || this.translationService?.translation().grid?.resizeHandle || 'Drag to resize';
  });

  public effectiveResizeAriaLabel = computed(() => {
    return this.resizeHandleAriaLabel() || this.effectiveResizeTitle();
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

  public onActionClick(action: GpWidgetAction, event: MouseEvent): void {
    event.stopPropagation();

    if (action.routerLink) {
      const navConfig = {
        routerLink: action.routerLink,
        queryParams: action.queryParams
      };
      const navigated = executeWidgetNavigation(navConfig, this.router, event);
      if (navigated) {
        this.navigate.emit(navConfig);
      }
    }

    if (action.onClick) {
      action.onClick(event, action, this.item());
    }

    this.actionClick.emit({ event, action, item: this.item() });
  }

  public toggleLock(event: MouseEvent): void {
    event.stopPropagation();
    const nextLocked = !this.isLocked();
    this.lockToggle.emit({ item: this.item(), locked: nextLocked });
  }
}
