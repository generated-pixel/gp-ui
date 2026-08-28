import { Directive, input, output, computed } from '@angular/core';
import { GpBaseComponent } from './gp-base.component';

export type GpButtonVariant = 'filled' | 'outlined' | 'text' | 'tonal' | 'elevated' | 'link';
export type GpButtonSeverity = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'contrast';
export type GpButtonSize = 'sm' | 'md' | 'lg';
export type GpIconPosition = 'left' | 'right' | 'top' | 'bottom';

/**
 * Base class for all Button and interactive Trigger components in gp-ui.
 * Provides unified inputs, shorthand flags, accessibility, styling tokens,
 * and comprehensive mouse/keyboard/focus lifecycle event outputs.
 */
@Directive()
export abstract class GpButtonBaseComponent extends GpBaseComponent {
  /** Text label displayed on the button */
  public label = input<string>('');

  /** Icon name to display */
  public icon = input<string>('');

  /** Position of the icon relative to the label */
  public iconPos = input<GpIconPosition>('left');

  /** Visual variant style */
  public variant = input<GpButtonVariant>('filled');

  /** Semantic severity color */
  public severity = input<GpButtonSeverity>('primary');

  /** Size scale */
  public size = input<GpButtonSize>('md');

  /** Fully rounded pill shape */
  public rounded = input<boolean>(false);

  /** Elevated drop shadow appearance */
  public raised = input<boolean>(false);

  /** Shorthand for text/transparent variant */
  public text = input<boolean>(false);

  /** Shorthand for outlined border variant */
  public outlined = input<boolean>(false);

  /** Shorthand for link variant */
  public link = input<boolean>(false);

  /** Plain unstyled monochromatic appearance */
  public plain = input<boolean>(false);

  /** Stretch full width (100%) */
  public fluid = input<boolean>(false);

  /** Explicitly mark as icon-only button */
  public iconOnly = input<boolean>(false);

  /** Loading spinner active state */
  public loading = input<boolean>(false);

  /** Custom spinner icon when loading */
  public loadingIcon = input<string>('spinner');

  /** Optional badge text or count */
  public badge = input<string>('');

  /** Severity color for badge */
  public badgeSeverity = input<GpButtonSeverity>('danger');

  /** Native HTML button type */
  public type = input<'button' | 'submit' | 'reset'>('button');

  /** HTML autofocus attribute */
  public autofocus = input<boolean>(false);

  /** HTML tabindex attribute */
  public tabindex = input<number | undefined>(undefined);

  // ==========================================
  // Standard Button Event Outputs
  // ==========================================

  /** Primary click event output */
  public onClickEvent = output<MouseEvent>();

  /** Focus event output */
  public onFocusEvent = output<FocusEvent>();

  /** Blur event output */
  public onBlurEvent = output<FocusEvent>();

  /** Keydown event output */
  public onKeyDownEvent = output<KeyboardEvent>();

  /** Keyup event output */
  public onKeyUpEvent = output<KeyboardEvent>();

  /** Mouse enter event output */
  public onMouseEnterEvent = output<MouseEvent>();

  /** Mouse leave event output */
  public onMouseLeaveEvent = output<MouseEvent>();

  /** Double click event output */
  public onDoubleClickEvent = output<MouseEvent>();

  /**
   * Evaluates the effective visual variant taking shorthand flags into account.
   */
  public effectiveVariant = computed<GpButtonVariant>(() => {
    if (this.text()) {
      return 'text';
    }
    if (this.outlined()) {
      return 'outlined';
    }
    if (this.link()) {
      return 'link';
    }
    if (this.raised()) {
      return 'elevated';
    }
    return this.variant();
  });

  /**
   * Generates standard base CSS classes for button styling.
   */
  protected baseButtonClasses = computed(() => {
    const isIconOnly = this.iconOnly() || (!this.label() && !!this.icon());
    const variant = this.effectiveVariant();

    return [
      'gp-button',
      `gp-button-${variant}`,
      `gp-button-${this.severity()}`,
      `gp-button-${this.size()}`,
      this.rounded() ? 'gp-button-rounded' : '',
      this.raised() ? 'gp-button-raised' : '',
      this.plain() ? 'gp-button-plain' : '',
      this.fluid() ? 'gp-button-fluid' : '',
      isIconOnly ? 'gp-button-icon-only' : '',
      this.loading() ? 'gp-button-loading' : '',
      this.styleClass()
    ]
      .filter(Boolean)
      .join(' ');
  });

  /**
   * Safe click handler that checks disabled and loading states.
   */
  public onButtonClick(event: MouseEvent): void {
    if (this.disabled() || this.loading()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    this.onClickEvent.emit(event);
  }

  public onButtonFocus(event: FocusEvent): void {
    if (!this.disabled()) {
      this.onFocusEvent.emit(event);
    }
  }

  public onButtonBlur(event: FocusEvent): void {
    if (!this.disabled()) {
      this.onBlurEvent.emit(event);
    }
  }

  public onButtonKeyDown(event: KeyboardEvent): void {
    if (!this.disabled()) {
      this.onKeyDownEvent.emit(event);
    }
  }

  public onButtonKeyUp(event: KeyboardEvent): void {
    if (!this.disabled()) {
      this.onKeyUpEvent.emit(event);
    }
  }

  public onButtonMouseEnter(event: MouseEvent): void {
    if (!this.disabled()) {
      this.onMouseEnterEvent.emit(event);
    }
  }

  public onButtonMouseLeave(event: MouseEvent): void {
    if (!this.disabled()) {
      this.onMouseLeaveEvent.emit(event);
    }
  }

  public onButtonDoubleClick(event: MouseEvent): void {
    if (!this.disabled() && !this.loading()) {
      this.onDoubleClickEvent.emit(event);
    }
  }
}
