import { Directive, input, output, signal, ElementRef, HostListener, inject } from '@angular/core';
import { GpBase } from './gp-base';
import { GpMenuItem } from '../components/button/split-button/split-button';

/**
 * Base class for all Menu and Navigation overlay components in gp-ui (Menu, TieredMenu, ContextMenu, Menubar, MegaMenu, PanelMenu, Dock, Breadcrumb).
 * Provides popup mode, dynamic viewport-safe coordinate positioning, outside-click auto-dismissal, escape key listener, and standard item click lifecycle.
 */
@Directive()
export abstract class GpMenuBase<T extends GpMenuItem = GpMenuItem> extends GpBase {
  protected menuHostEl = inject(ElementRef);

  /** Array of menu item items or nodes */
  public model = input<T[]>([]);

  /** Whether the menu operates as an anchored popup overlay or inline */
  public popup = input<boolean>(false);

  /** Automatically manage z-index elevation layering */
  public autoZIndex = input<boolean>(true);

  /** Base z-index value for popup overlays */
  public baseZIndex = input<number>(1100);

  // ==========================================
  // Common Menu Event Outputs
  // ==========================================

  /** Emitted when any menu item is clicked */
  public onItemClickEvent = output<{ originalEvent: Event; item: T }>();

  /** Emitted when popup menu opens */
  public onShow = output<void>();

  /** Emitted when popup menu closes */
  public onHide = output<void>();

  // ==========================================
  // Reactive State Signals
  // ==========================================

  /** Visibility state for popup menus */
  public visible = signal<boolean>(false);

  /** Calculated absolute pixel coordinates */
  public position = signal<{ top: number; left: number }>({ top: 0, left: 0 });

  /** Currently hovered or active menu item */
  public activeItem = signal<T | null>(null);

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (
      this.popup() &&
      this.visible() &&
      this.menuHostEl?.nativeElement &&
      !this.menuHostEl.nativeElement.contains(event.target)
    ) {
      this.hide();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.popup() && this.visible()) {
      this.hide();
    }
  }

  /**
   * Toggles the menu popup visibility anchored to the trigger target element or mouse event.
   */
  public toggle(event: MouseEvent | HTMLElement): void {
    if (this.visible()) {
      this.hide();
    } else {
      this.show(event);
    }
  }

  /**
   * Shows the popup menu anchored to the given target or coordinates with screen boundary collision protection.
   */
  public show(event: MouseEvent | HTMLElement): void {
    if (event instanceof Event) {
      event.stopPropagation();
      const target = (event.currentTarget || event.target) as HTMLElement;
      if (target && target.getBoundingClientRect) {
        const rect = target.getBoundingClientRect();
        let top = rect.bottom + 4;
        let left = rect.left;

        const menuWidth = 220;
        const menuHeight = 260;
        if (left + menuWidth > window.innerWidth) {
          left = Math.max(8, window.innerWidth - menuWidth - 8);
        }
        if (top + menuHeight > window.innerHeight) {
          top = Math.max(8, rect.top - menuHeight - 4);
        }

        this.position.set({ top, left });
      } else {
        let top = event.clientY + 4;
        let left = event.clientX;
        const menuWidth = 220;
        const menuHeight = 260;
        if (left + menuWidth > window.innerWidth) {
          left = Math.max(8, window.innerWidth - menuWidth - 8);
        }
        if (top + menuHeight > window.innerHeight) {
          top = Math.max(8, window.innerHeight - menuHeight - 8);
        }
        this.position.set({ top, left });
      }
    } else if (event && (event as HTMLElement).getBoundingClientRect) {
      const rect = (event as HTMLElement).getBoundingClientRect();
      let top = rect.bottom + 4;
      let left = rect.left;
      const menuWidth = 220;
      if (left + menuWidth > window.innerWidth) {
        left = Math.max(8, window.innerWidth - menuWidth - 8);
      }
      this.position.set({ top, left });
    }

    this.visible.set(true);
    this.onShow.emit();
  }

  /**
   * Hides the popup menu and resets active items.
   */
  public hide(): void {
    if (this.visible()) {
      this.visible.set(false);
      this.activeItem.set(null);
      this.onHide.emit();
    }
  }

  /**
   * Handles click on a menu item executing its command callback, emitting onItemClickEvent, and auto-dismissing if in popup mode.
   */
  public handleMenuItemClick(item: T, event: MouseEvent): void {
    if (item.disabled) {
      return;
    }
    if (item.command) {
      item.command({ originalEvent: event, item });
    }
    this.onItemClickEvent.emit({ originalEvent: event, item });
    if (this.popup()) {
      this.hide();
    }
  }
}
