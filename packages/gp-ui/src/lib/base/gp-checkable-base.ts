import { Directive, input, output, signal } from '@angular/core';
import { GpEditableBase } from './gp-editable-base';

export type GpCheckableSize = 'sm' | 'md' | 'lg';
export type GpCheckableSeverity = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger';

/**
 * Base class for all checkable, boolean, and toggleable form controls (Checkbox, RadioButton, Switch).
 * Provides checked state management, keyboard Space/Enter toggle handling, focus lifecycle, and change events.
 */
@Directive()
export abstract class GpCheckableBase extends GpEditableBase<boolean | any> {
  /** In binary mode, value is a boolean true/false; otherwise bound value matches option value */
  public binary = input<boolean>(true);

  /** Size scale */
  public size = input<GpCheckableSize>('md');

  /** Semantic severity accent color */
  public severity = input<GpCheckableSeverity>('primary');

  /** HTML autofocus attribute */
  public autofocus = input<boolean>(false);

  /** HTML tabindex attribute */
  public tabindex = input<number | undefined>(undefined);

  // ==========================================
  // Common Checkable Event Outputs
  // ==========================================

  /** Emitted when checked state changes */
  public onChange = output<{ checked: boolean; originalEvent: Event }>();

  /** Emitted on native click or keyboard activation */
  public onClickEvent = output<Event>();

  /** Emitted when control receives focus */
  public onFocusEvent = output<FocusEvent>();

  /** Emitted when control loses focus */
  public onBlurEvent = output<FocusEvent>();

  /** Emitted when key is pressed */
  public onKeyDownEvent = output<KeyboardEvent>();

  /** Reactive internal checked state */
  public checked = signal<boolean>(false);

  public override writeValue(value: any): void {
    const valInput = this.valueInput();
    if (this.binary()) {
      this.checked.set(!!value);
    } else {
      if (Array.isArray(value)) {
        this.checked.set(value.includes(valInput));
      } else {
        this.checked.set(value === valInput);
      }
    }
  }

  public handleToggle(event?: Event): void {
    if (this.isEffectivelyDisabled() || this.readonly()) {
      return;
    }

    const next = !this.checked();
    this.checked.set(next);

    const valInput = this.valueInput();
    let modelValue: any = next;
    if (!this.binary()) {
      modelValue = next ? valInput : null;
    }

    this.updateValue(modelValue);
    this.onChange.emit({ checked: next, originalEvent: event || new CustomEvent('change') });
  }

  public handleFocus(event: FocusEvent): void {
    this.onFocusEvent.emit(event);
  }

  public handleBlur(event: FocusEvent): void {
    this.handleControlBlur();
    this.onBlurEvent.emit(event);
  }

  public handleKeyDown(event: KeyboardEvent): void {
    if (this.isEffectivelyDisabled() || this.readonly()) {
      return;
    }
    this.onKeyDownEvent.emit(event);
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      this.handleToggle(event);
    }
  }
}
