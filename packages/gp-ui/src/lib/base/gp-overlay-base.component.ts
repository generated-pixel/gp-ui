import {
  Directive,
  input,
  output,
  signal,
  effect,
  HostListener,
  inject
} from '@angular/core';
import { GpBaseComponent } from './gp-base.component';
import { ZIndexService } from '../overlay/z-index.service';

/**
 * Base class for all modal and floating overlay components (Dialog, Drawer, ConfirmDialog, Popover).
 * Provides two-way visibility syncing, z-index elevation layering, backdrop mask handling, and Escape key dismissal.
 */
@Directive()
export abstract class GpOverlayBaseComponent extends GpBaseComponent {
  protected zIndexService = inject(ZIndexService);

  /** Overlay header title text */
  public header = input<string>('');

  /** Whether the overlay dims and blocks the background */
  public modal = input<boolean>(true);

  /** Whether a close button is shown */
  public closable = input<boolean>(true);

  /** Whether pressing the Escape key dismisses the overlay */
  public closeOnEscape = input<boolean>(true);

  /** Whether clicking the backdrop mask closes the overlay */
  public dismissableMask = input<boolean>(false);

  /** Two-way bindable visibility input */
  public visibleInput = input<boolean | undefined>(undefined, { alias: 'visibleProp' });
  public visibleBinding = input<boolean | undefined>(undefined, { alias: 'visible' });

  // ==========================================
  // Common Overlay Event Outputs
  // ==========================================

  /** Emitted when visibility changes (for [(visible)] two-way binding) */
  public visibleChange = output<boolean>();

  /** Emitted when overlay opens and becomes visible */
  public onShow = output<void>();

  /** Emitted when overlay closes */
  public onHide = output<void>();

  // ==========================================
  // Internal State Signals
  // ==========================================

  public visible = signal<boolean>(false);
  public zIndex = signal<number>(1100);

  constructor() {
    super();
    effect(() => {
      const v = this.visibleInput() ?? this.visibleBinding();
      if (v !== undefined && v !== this.visible()) {
        if (v) {
          this.show();
        } else {
          this.close();
        }
      }
    });
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.visible() && this.closeOnEscape() && this.closable()) {
      this.close();
    }
  }

  /**
   * Opens the overlay, assigns an elevated z-index, and emits visibility events.
   */
  public show(): void {
    if (this.zIndexService) {
      this.zIndex.set(this.zIndexService.get(this.modal() ? 'modal' : 'overlay'));
    }
    this.visible.set(true);
    this.visibleChange.emit(true);
    this.onShow.emit();
  }

  /**
   * Closes the overlay and emits onHide.
   */
  public close(): void {
    this.visible.set(false);
    this.visibleChange.emit(false);
    this.onHide.emit();
  }

  /**
   * Backdrop mask click handler.
   */
  public onMaskClick(event?: MouseEvent): void {
    if (this.dismissableMask() && this.closable()) {
      this.close();
    }
  }
}
