import { Directive, Input, Output, EventEmitter, signal } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { GpBaseComponent } from './gp-base.component';

/**
 * Editable Base Component for all value-bearing and form-related gp-ui components.
 * Inherits core identity and styling from GpBaseComponent, adding value state management,
 * validation flags, and ControlValueAccessor support.
 */
@Directive()
export abstract class GpEditableBaseComponent<T = any> extends GpBaseComponent implements ControlValueAccessor {
  /** Value bound to the component */
  @Input() value: any = null;

  /** Form field name */
  @Input() name = '';

  /** Field placeholder text */
  @Input() placeholder = '';

  /** Required field flag */
  @Input() required = false;

  /** Readonly state */
  @Input() readonly = false;

  /** Invalid / validation error state */
  @Input() invalid = false;

  /** Output emitted whenever the value changes */
  @Output() valueChange = new EventEmitter<T>();

  /** Reactive signal holding current internal value */
  protected internalValue: any = signal<T | null>(null);

  /** Internal change callback for Angular reactive/template-driven forms */
  protected onChangeCallback: (value: any) => void = () => {};

  /** Internal touched callback for Angular forms */
  protected onTouchedCallback: () => void = () => {};

  /** Writes a new value to the element from the forms API or model */
  public writeValue(val: any): void {
    this.value = val;
    this.internalValue.set(val !== undefined ? val : null);
  }

  /** Registers a callback function for changes */
  public registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  /** Registers a callback function for touched events */
  public registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  /** Sets the disabled state from forms API */
  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /** Helper method to update value, trigger CVA callbacks, and emit valueChange */
  public updateValue(newVal: T): void {
    this.value = newVal;
    this.internalValue.set(newVal);
    this.onChangeCallback(newVal);
    this.valueChange.emit(newVal);
  }

  /** Marks the control as touched */
  public markAsTouched(): void {
    this.onTouchedCallback();
  }
}

/**
 * Backward-compatible alias for GpEditableBaseComponent
 */
export { GpEditableBaseComponent as GpBaseControlValueAccessor };
