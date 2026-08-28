import { Directive, input, output, signal } from '@angular/core';
import { GpBaseComponent } from './gp-base.component';

/**
 * Base class for all Panel, Card, and Container components (Panel, Card, Fieldset).
 * Provides header/subheader metadata, collapsible toggle states, and expansion lifecycle events.
 */
@Directive()
export abstract class GpPanelBaseComponent extends GpBaseComponent {
  /** Primary title header text */
  public header = input<string>('');

  /** Secondary subtitle text */
  public subheader = input<string>('');

  /** Whether the panel can be expanded and collapsed interactively */
  public toggleable = input<boolean>(false);

  // ==========================================
  // Common Panel Event Outputs
  // ==========================================

  /** Emitted whenever the collapsed state toggles */
  public onToggle = output<{ collapsed: boolean }>();

  /** Emitted when panel expands */
  public onExpand = output<void>();

  /** Emitted when panel collapses */
  public onCollapse = output<void>();

  // ==========================================
  // Internal State Signals
  // ==========================================

  public collapsed = signal<boolean>(false);

  /**
   * Toggles the collapsed state.
   */
  public toggle(): void {
    if (!this.toggleable()) {
      return;
    }
    const next = !this.collapsed();
    this.collapsed.set(next);
    this.onToggle.emit({ collapsed: next });
    if (next) {
      this.onCollapse.emit();
    } else {
      this.onExpand.emit();
    }
  }

  /**
   * Expands the panel.
   */
  public expand(): void {
    if (this.collapsed()) {
      this.collapsed.set(false);
      this.onToggle.emit({ collapsed: false });
      this.onExpand.emit();
    }
  }

  /**
   * Collapses the panel.
   */
  public collapse(): void {
    if (!this.collapsed()) {
      this.collapsed.set(true);
      this.onToggle.emit({ collapsed: true });
      this.onCollapse.emit();
    }
  }
}
