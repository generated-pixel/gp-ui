import {
  Directive,
  input,
  output,
  signal,
  computed,
  inject,
  ElementRef,
  OnInit,
  OnDestroy
} from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { GpBaseComponent } from './gp-base.component';
import {
  GpValidatorFn,
  GpValidationError,
  GpValidationTrigger,
  GpValueEffectFn,
  GpValidationState
} from '../validation/types';

/**
 * Editable Base Component for all value-bearing and form-related gp-ui components.
 * Inherits core identity and styling from GpBaseComponent, adding value state management,
 * integrated validation pipeline, async side effects, and ControlValueAccessor support.
 */
@Directive()
export abstract class GpEditableBaseComponent<T = any>
  extends GpBaseComponent
  implements ControlValueAccessor, OnInit, OnDestroy
{
  /** Initial or bound value property */
  public valueInput = input<any>(null, { alias: 'value' });

  /** Form field identifier name */
  public name = input<string>('');

  /** Field placeholder text */
  public placeholder = input<string>('');

  /** Required field flag */
  public required = input<boolean>(false);

  /** Readonly state */
  public readonly = input<boolean>(false);

  /** Override invalid / validation error state */
  public invalid = input<boolean>(false);

  /** Array of validator functions to execute against this control */
  public validators = input<GpValidatorFn<T>[]>([]);

  /** Triggers on which validation automatically runs */
  public validateOn = input<GpValidationTrigger[]>(['change', 'blur']);

  /** Custom static override error message */
  public errorMessage = input<string>('');

  /** Informational helper text displayed below the field */
  public helperText = input<string>('');

  /** Custom side-effect function executed whenever the value changes or validates */
  public valueEffect = input<GpValueEffectFn<T> | undefined>(undefined);

  /** Output emitted whenever the value changes */
  public valueChange = output<T>();

  /** Output emitted whenever validation completes with current validation state */
  public onValidate = output<GpValidationState<T>>();

  /** Output emitted when the component passes validation */
  public onValid = output<T>();

  /** Output emitted when validation fails with error details */
  public onInvalid = output<GpValidationError[]>();

  /** Output emitted after a side effect execution completes */
  public onEffectComplete = output<{ value: T; error?: any }>();

  /** Reactive signals for internal state */
  public internalValue = signal<T | null>(null);
  public errors = signal<GpValidationError[]>([]);
  public isPending = signal<boolean>(false);
  public isTouched = signal<boolean>(false);
  public isDirty = signal<boolean>(false);
  public internalDisabled = signal<boolean>(false);

  /** Value accessor getter / setter for compatibility with template & CVA */
  public get value(): any {
    return this.internalValue();
  }
  public set value(val: any) {
    this.internalValue.set(val !== undefined ? val : null);
  }

  /** Effective disabled state taking into account both input signal and CVA forms API */
  public isEffectivelyDisabled = computed(() => this.disabled() || this.internalDisabled());

  /** Computed validation flags */
  public isValid = computed(() => this.errors().length === 0 && !this.invalid());
  public isInvalid = computed(() => this.invalid() || this.errors().length > 0);
  public firstError = computed(() => {
    const customMsg = this.errorMessage();
    if (customMsg) {
      return customMsg;
    }
    const errs = this.errors();
    return errs.length > 0 ? errs[0].message : null;
  });

  /** Internal change callback for Angular reactive/template-driven forms */
  protected onChangeCallback: (value: any) => void = () => {};

  /** Internal touched callback for Angular forms */
  protected onTouchedCallback: () => void = () => {};

  private lastValidatedValue: any = undefined;

  private hostEl = inject(ElementRef, { optional: true });

  public ngOnInit(): void {
    const val = this.valueInput();
    if (val !== null && val !== undefined) {
      this.internalValue.set(val);
    }
  }

  public ngOnDestroy(): void {}

  /** Writes a new value to the element from the forms API or model */
  public writeValue(val: any): void {
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
    this.internalDisabled.set(isDisabled);
  }

  /**
   * Updates component value, triggers validation (if configured for 'change'),
   * executes side-effects, and notifies listeners.
   */
  public async updateValue(newVal: T): Promise<void> {
    const prevVal = this.internalValue();
    this.internalValue.set(newVal);
    this.isDirty.set(true);

    this.onChangeCallback(newVal);
    this.valueChange.emit(newVal);

    // Run validation if trigger includes 'change'
    if (this.validateOn().includes('change')) {
      await this.validate();
    }

    // Execute custom side-effect if provided
    const effect = this.valueEffect();
    if (effect) {
      try {
        this.isPending.set(true);
        await effect(newVal, prevVal as any, this);
        this.onEffectComplete.emit({ value: newVal });
      } catch (err) {
        this.onEffectComplete.emit({ value: newVal, error: err });
      } finally {
        this.isPending.set(false);
      }
    }
  }

  /**
   * Handles control blur events, marks control as touched,
   * and runs validation if configured for 'blur'.
   */
  public async handleControlBlur(): Promise<void> {
    this.markAsTouched();
    if (this.validateOn().includes('blur')) {
      await this.validate();
    }
  }

  /**
   * Manually executes validation pipeline against current value.
   * Returns true if valid, false if invalid.
   */
  public async validate(): Promise<boolean> {
    const currentVal = this.internalValue() as T;
    const collectedErrors: GpValidationError[] = [];

    // Built-in 'required' check if required() is set and not already in validators
    if (this.required()) {
      const isRequiredEmpty =
        currentVal === null ||
        currentVal === undefined ||
        (typeof currentVal === 'string' && currentVal.trim().length === 0) ||
        (Array.isArray(currentVal) && currentVal.length === 0) ||
        (typeof currentVal === 'boolean' && !currentVal);

      if (isRequiredEmpty) {
        collectedErrors.push({
          rule: 'required',
          message: this.errorMessage() || `${this.name() || 'This field'} is required`
        });
      }
    }

    // Run configured validators
    const validatorList = this.validators();
    if (validatorList && validatorList.length > 0) {
      this.isPending.set(true);
      try {
        for (const validator of validatorList) {
          const err = await validator(currentVal, this);
          if (err) {
            collectedErrors.push(err);
          }
        }
      } finally {
        this.isPending.set(false);
      }
    }

    this.errors.set(collectedErrors);
    this.lastValidatedValue = currentVal;

    const state: GpValidationState<T> = {
      value: currentVal,
      isValid: collectedErrors.length === 0 && !this.invalid(),
      isInvalid: collectedErrors.length > 0 || this.invalid(),
      isPending: this.isPending(),
      isTouched: this.isTouched(),
      isDirty: this.isDirty(),
      errors: collectedErrors,
      firstError: this.firstError()
    };

    this.onValidate.emit(state);

    if (state.isValid) {
      this.onValid.emit(currentVal);
      return true;
    } else {
      this.onInvalid.emit(collectedErrors);
      return false;
    }
  }

  /**
   * Sets external validation errors (e.g. from server API response or custom validation).
   */
  public setErrors(errors: GpValidationError[] | string[]): void {
    if (!errors || errors.length === 0) {
      this.clearErrors();
      return;
    }

    const normalized: GpValidationError[] = errors.map((err) =>
      typeof err === 'string' ? { rule: 'external', message: err } : err
    );

    this.errors.set(normalized);
    this.onInvalid.emit(normalized);
  }

  /**
   * Clears all validation errors from the control.
   */
  public clearErrors(): void {
    this.errors.set([]);
  }

  /**
   * Resets the control value and clears touched/dirty/validation states.
   */
  public reset(defaultValue: T | null = null): void {
    this.internalValue.set(defaultValue);
    this.isDirty.set(false);
    this.isTouched.set(false);
    this.clearErrors();
    this.onChangeCallback(defaultValue);
    this.valueChange.emit(defaultValue as T);
  }

  /** Marks the control as touched */
  public markAsTouched(): void {
    this.isTouched.set(true);
    this.onTouchedCallback();
  }

  /** Marks the control as dirty */
  public markAsDirty(): void {
    this.isDirty.set(true);
  }

  /** Focuses the native element if available */
  public focus(): void {
    if (typeof document !== 'undefined' && this.hostEl?.nativeElement) {
      const inputEl = this.hostEl.nativeElement.querySelector('input, textarea, select, button, [tabindex="0"]');
      if (inputEl) {
        inputEl.focus();
      } else {
        this.hostEl.nativeElement.focus?.();
      }
    }
  }
}

/**
 * Backward-compatible alias for GpEditableBaseComponent
 */
export { GpEditableBaseComponent as GpBaseControlValueAccessor };
