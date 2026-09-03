import { Directive, input, output, signal, computed } from '@angular/core';
import { GpBase } from './gp-base';

export type GpFeedbackSeverity =
  'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'error' | 'contrast';

export type GpFeedbackSize = 'sm' | 'md' | 'lg';

/**
 * Base class for all Feedback, Badge, Tag, Chip, and Alert components.
 * Provides unified severity themes, icon mapping, dismissal state, and sizing.
 */
@Directive()
export abstract class GpFeedbackBase extends GpBase {
  /** Severity variant */
  public severity = input<GpFeedbackSeverity>('info');

  /** Sizing variant */
  public size = input<GpFeedbackSize>('md');

  /** Custom or override icon name */
  public icon = input<string>('');

  /** Display text or payload value */
  public value = input<string | number | undefined>(undefined);

  /** Whether the feedback item can be dismissed/closed */
  public closable = input<boolean>(false);

  /** Emitted when the component is closed or dismissed */
  public onClose = output<void>();

  /** Internal visibility signal */
  public visible = signal<boolean>(true);

  /** Computed standard icon according to severity */
  public defaultIcon = computed(() => {
    if (this.icon()) {
      return this.icon();
    }
    const s = this.severity();
    switch (s) {
      case 'success':
        return 'check-circle';
      case 'warning':
        return 'exclamation-triangle';
      case 'danger':
      case 'error':
        return 'times-circle';
      case 'info':
      default:
        return 'info-circle';
    }
  });

  /**
   * Closes or dismisses the feedback element.
   */
  public close(): void {
    this.visible.set(false);
    this.onClose.emit();
  }
}
