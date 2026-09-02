import { GpEditableBase } from '../base/gp-editable-base';

/**
 * Validation Error structure for gp-ui editable components.
 */
export interface GpValidationError {
  rule: string;
  message: string;
  params?: any;
}

/**
 * Validator function signature supporting sync and async validation.
 */
export type GpValidatorFn<T = any> = (
  value: T,
  control: GpEditableBase<T>
) => GpValidationError | null | Promise<GpValidationError | null>;

/**
 * Trigger event that initiates validation on an editable component.
 */
export type GpValidationTrigger = 'change' | 'blur' | 'submit' | 'manual';

/**
 * Side-effect function executed whenever a component's value changes or validates.
 */
export type GpValueEffectFn<T = any> = (
  newValue: T,
  oldValue: T | null,
  control: GpEditableBase<T>
) => void | Promise<void>;

/**
 * Complete snapshot of a component's validation & dirty state.
 */
export interface GpValidationState<T = any> {
  value: T;
  isValid: boolean;
  isInvalid: boolean;
  isPending: boolean;
  isTouched: boolean;
  isDirty: boolean;
  errors: GpValidationError[];
  firstError: string | null;
}

/**
 * Form Submit Event payload emitted by GpFormDirective when valid.
 */
export interface GpFormSubmitEvent {
  values: Record<string, any>;
  controls: Record<string, GpEditableBase>;
  originalEvent?: Event;
}

/**
 * Form Invalid Submit Event payload emitted by GpFormDirective when validation fails.
 */
export interface GpFormInvalidEvent {
  errors: Record<string, GpValidationError[]>;
  firstInvalidControl: GpEditableBase | null;
  values: Record<string, any>;
  originalEvent?: Event;
}
