import { GpValidatorFn, GpValidationError } from './types';

/**
 * Built-in validation rules for all gp-ui editable components.
 */
export class GpValidators {
  /**
   * Requires a non-empty, non-null value.
   */
  public static required(message = 'This field is required'): GpValidatorFn {
    return (value: any): GpValidationError | null => {
      const isEmpty =
        value === null ||
        value === undefined ||
        (typeof value === 'string' && value.trim().length === 0) ||
        (Array.isArray(value) && value.length === 0) ||
        (typeof value === 'boolean' && !value);

      if (isEmpty) {
        return { rule: 'required', message };
      }
      return null;
    };
  }

  /**
   * Validates standard email address format.
   */
  public static email(message = 'Please enter a valid email address'): GpValidatorFn {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return (value: any): GpValidationError | null => {
      if (!value || typeof value !== 'string') {
        return null;
      }
      if (!emailRegex.test(value.trim())) {
        return { rule: 'email', message };
      }
      return null;
    };
  }

  /**
   * Requires a minimum character length (for strings) or item count (for arrays).
   */
  public static minLength(min: number, message?: string): GpValidatorFn {
    const msg = message || `Must be at least ${min} characters`;
    return (value: any): GpValidationError | null => {
      if (value == null) {
        return null;
      }
      const length = typeof value === 'string' || Array.isArray(value) ? value.length : 0;
      if (length < min) {
        return { rule: 'minLength', message: msg, params: { min, actual: length } };
      }
      return null;
    };
  }

  /**
   * Limits maximum character length (for strings) or item count (for arrays).
   */
  public static maxLength(max: number, message?: string): GpValidatorFn {
    const msg = message || `Must be at most ${max} characters`;
    return (value: any): GpValidationError | null => {
      if (value == null) {
        return null;
      }
      const length = typeof value === 'string' || Array.isArray(value) ? value.length : 0;
      if (length > max) {
        return { rule: 'maxLength', message: msg, params: { max, actual: length } };
      }
      return null;
    };
  }

  /**
   * Requires a numeric value greater than or equal to the minimum.
   */
  public static min(minValue: number, message?: string): GpValidatorFn {
    const msg = message || `Value must be at least ${minValue}`;
    return (value: any): GpValidationError | null => {
      if (value == null || value === '') {
        return null;
      }
      const num = Number(value);
      if (isNaN(num) || num < minValue) {
        return { rule: 'min', message: msg, params: { min: minValue, actual: num } };
      }
      return null;
    };
  }

  /**
   * Limits a numeric value to less than or equal to the maximum.
   */
  public static max(maxValue: number, message?: string): GpValidatorFn {
    const msg = message || `Value must not exceed ${maxValue}`;
    return (value: any): GpValidationError | null => {
      if (value == null || value === '') {
        return null;
      }
      const num = Number(value);
      if (isNaN(num) || num > maxValue) {
        return { rule: 'max', message: msg, params: { max: maxValue, actual: num } };
      }
      return null;
    };
  }

  /**
   * Validates against a regular expression pattern.
   */
  public static pattern(pattern: RegExp | string, message = 'Invalid format'): GpValidatorFn {
    const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
    return (value: any): GpValidationError | null => {
      if (!value || typeof value !== 'string') {
        return null;
      }
      if (!regex.test(value)) {
        return { rule: 'pattern', message, params: { pattern: regex.toString() } };
      }
      return null;
    };
  }

  /**
   * Validates that the value matches another control's value (e.g. Password Confirmation).
   */
  public static match(targetValueGetter: () => any, message = 'Values do not match'): GpValidatorFn {
    return (value: any): GpValidationError | null => {
      const target = targetValueGetter();
      if (value !== target) {
        return { rule: 'match', message };
      }
      return null;
    };
  }

  /**
   * Custom synchronous validator function.
   * Returns true (valid), false (invalid using default message), or a custom error string.
   */
  public static custom(
    fn: (value: any, control: any) => boolean | string | null | undefined,
    rule = 'custom',
    defaultMessage = 'Invalid value'
  ): GpValidatorFn {
    return (value: any, control: any): GpValidationError | null => {
      const result = fn(value, control);
      if (result === true || result === null || result === undefined) {
        return null;
      }
      const message = typeof result === 'string' ? result : defaultMessage;
      return { rule, message };
    };
  }

  /**
   * Asynchronous validator function (e.g. API username availability checks, remote verification).
   */
  public static async(
    fn: (value: any, control: any) => Promise<boolean | string | null | undefined>,
    rule = 'async',
    defaultMessage = 'Validation failed'
  ): GpValidatorFn {
    return async (value: any, control: any): Promise<GpValidationError | null> => {
      try {
        const result = await fn(value, control);
        if (result === true || result === null || result === undefined) {
          return null;
        }
        const message = typeof result === 'string' ? result : defaultMessage;
        return { rule, message };
      } catch (err: any) {
        return { rule, message: err?.message || defaultMessage };
      }
    };
  }

  /**
   * Composes multiple validators into a single validation pipeline.
   */
  public static compose(...validators: GpValidatorFn[]): GpValidatorFn {
    return async (value: any, control: any): Promise<GpValidationError | null> => {
      for (const validator of validators) {
        const error = await validator(value, control);
        if (error) {
          return error;
        }
      }
      return null;
    };
  }
}
