/**
 * @file rule-context.ts
 * Context factory for Dynamic Business Rules Engine.
 */

import { FormGroup } from '@angular/forms';
import { GpRuleContext } from '../types/context.types';

export interface GpRuleContextOptions {
  state?: Record<string, any>;
  triggerEvent: string;
  triggerValue?: any;
  originalEvent?: Event | CustomEvent;
  form?: FormGroup;
  globals?: Record<string, any>;
  onStateChange?: (fieldName: string, value: any) => void;
  onVisibilityChange?: (fieldName: string, visible: boolean) => void;
  onDisabledChange?: (fieldName: string, disabled: boolean) => void;
  onOptionsChange?: (fieldName: string, options: Array<{ label: string; value: any; [key: string]: any }>) => void;
  onToast?: (message: string, severity?: 'success' | 'info' | 'warning' | 'danger') => void;
  onEmit?: (eventName: string, payload?: any) => void;
}

export class GpRuleContextFactory {
  public static create(options: GpRuleContextOptions): GpRuleContext {
    const internalState: Record<string, any> = {
      ...(options.form ? options.form.getRawValue() : {}),
      ...(options.state || {})
    };

    const get = (fieldName: string): any => {
      if (options.form && options.form.contains(fieldName)) {
        return options.form.get(fieldName)?.value;
      }
      return internalState[fieldName];
    };

    const set = (fieldName: string, value: any): void => {
      internalState[fieldName] = value;
      if (options.form && options.form.contains(fieldName)) {
        options.form.get(fieldName)?.setValue(value, { emitEvent: true });
      }
      if (options.onStateChange) {
        options.onStateChange(fieldName, value);
      }
    };

    const patch = (values: Record<string, any>): void => {
      Object.entries(values).forEach(([k, v]) => {
        set(k, v);
      });
    };

    const setVisibility = (fieldName: string, visible: boolean): void => {
      internalState[`_visible_${fieldName}`] = visible;
      if (options.onVisibilityChange) {
        options.onVisibilityChange(fieldName, visible);
      }
    };

    const setDisabled = (fieldName: string, disabled: boolean): void => {
      internalState[`_disabled_${fieldName}`] = disabled;
      if (options.form && options.form.contains(fieldName)) {
        const ctrl = options.form.get(fieldName);
        if (disabled) {
          ctrl?.disable({ emitEvent: false });
        } else {
          ctrl?.enable({ emitEvent: false });
        }
      }
      if (options.onDisabledChange) {
        options.onDisabledChange(fieldName, disabled);
      }
    };

    const setOptions = (fieldName: string, opts: Array<{ label: string; value: any; [key: string]: any }>): void => {
      internalState[`_options_${fieldName}`] = opts;
      if (options.onOptionsChange) {
        options.onOptionsChange(fieldName, opts);
      }
    };

    const emit = (eventName: string, payload?: any): void => {
      if (options.onEmit) {
        options.onEmit(eventName, payload);
      }
    };

    const showToast = (message: string, severity?: 'success' | 'info' | 'warning' | 'danger'): void => {
      if (options.onToast) {
        options.onToast(message, severity);
      }
    };

    return {
      state: internalState,
      triggerEvent: options.triggerEvent,
      triggerValue: options.triggerValue,
      originalEvent: options.originalEvent,
      form: options.form,
      globals: options.globals,
      get,
      set,
      patch,
      setVisibility,
      setDisabled,
      setOptions,
      showToast,
      emit
    };
  }
}
