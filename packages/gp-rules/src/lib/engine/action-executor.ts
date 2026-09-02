/**
 * @file action-executor.ts
 * Core action executor for Dynamic Business Rules.
 */

import { GpRuleAction, GpTransformType } from '../types/action.types';
import { GpRuleContext } from '../types/context.types';

export class GpActionExecutor {
  /**
   * Execute an array of actions sequentially against the context.
   */
  public static async executeAll(
    actions: GpRuleAction | GpRuleAction[] | undefined,
    context: GpRuleContext
  ): Promise<string[]> {
    if (!actions) {
      return [];
    }

    const actionList = Array.isArray(actions) ? actions : [actions];
    const executed: string[] = [];

    for (const action of actionList) {
      const desc = await this.execute(action, context);
      if (desc) {
        executed.push(desc);
      }
    }

    return executed;
  }

  /**
   * Execute a single action on the context.
   */
  public static async execute(action: GpRuleAction, context: GpRuleContext): Promise<string> {
    switch (action.type) {
      case 'setValue': {
        if (action.target) {
          context.set(action.target, action.value);
          return `setValue(${action.target} = ${JSON.stringify(action.value)})`;
        }
        break;
      }

      case 'patchValues': {
        if (action.value && typeof action.value === 'object') {
          context.patch(action.value);
          return `patchValues(${JSON.stringify(action.value)})`;
        }
        break;
      }

      case 'copyValue': {
        if (action.target && action.fromField) {
          const val = context.get(action.fromField);
          context.set(action.target, val);
          return `copyValue(${action.fromField} -> ${action.target} = ${JSON.stringify(val)})`;
        }
        break;
      }

      case 'transformValue': {
        const target = action.target || action.fromField;
        const sourceField = action.fromField || action.target;
        if (target && sourceField) {
          const rawVal = context.get(sourceField);
          const transformed = this.applyTransformation(rawVal, action.transformType || 'trim');
          context.set(target, transformed);
          return `transformValue(${sourceField} -> ${target} via "${action.transformType}")`;
        }
        break;
      }

      case 'clear': {
        if (action.target) {
          context.set(action.target, null);
          return `clear(${action.target})`;
        }
        break;
      }

      case 'reset': {
        if (action.target) {
          context.set(action.target, action.value !== undefined ? action.value : null);
          return `reset(${action.target})`;
        }
        break;
      }

      case 'show': {
        if (action.target) {
          context.setVisibility(action.target, true);
          return `show(${action.target})`;
        }
        break;
      }

      case 'hide': {
        if (action.target) {
          context.setVisibility(action.target, false);
          return `hide(${action.target})`;
        }
        break;
      }

      case 'toggleVisibility': {
        if (action.target) {
          const current = context.state[`_visible_${action.target}`] !== false;
          context.setVisibility(action.target, !current);
          return `toggleVisibility(${action.target} -> ${!current})`;
        }
        break;
      }

      case 'enable': {
        if (action.target) {
          context.setDisabled(action.target, false);
          return `enable(${action.target})`;
        }
        break;
      }

      case 'disable': {
        if (action.target) {
          context.setDisabled(action.target, true);
          return `disable(${action.target})`;
        }
        break;
      }

      case 'setValidationError': {
        if (action.target && context.setValidationError) {
          const errorKey = action.errorKey || 'ruleValidationError';
          const errorMsg = action.errorMessage || action.message || 'Validation rule failed';
          context.setValidationError(action.target, errorKey, errorMsg);
          return `setValidationError(${action.target}, ${errorKey}: "${errorMsg}")`;
        }
        break;
      }

      case 'clearValidationError': {
        if (action.target && context.clearValidationError) {
          context.clearValidationError(action.target, action.errorKey);
          return `clearValidationError(${action.target}${action.errorKey ? ', ' + action.errorKey : ''})`;
        }
        break;
      }

      case 'setClass': {
        if (action.target && context.setClass) {
          if (action.className) {
            context.setClass(action.target, action.className, false);
          }
          if (action.removeClassName) {
            context.setClass(action.target, action.removeClassName, true);
          }
          return `setClass(${action.target}, add: ${action.className || 'none'}, remove: ${action.removeClassName || 'none'})`;
        }
        break;
      }

      case 'setStyle': {
        if (action.target && action.styles && context.setStyle) {
          context.setStyle(action.target, action.styles);
          return `setStyle(${action.target}, ${JSON.stringify(action.styles)})`;
        }
        break;
      }

      case 'setFocus': {
        if (action.target && context.setFocus) {
          context.setFocus(action.target);
          return `setFocus(${action.target})`;
        }
        break;
      }

      case 'setOptions': {
        if (action.target && action.options) {
          context.setOptions(action.target, action.options);
          return `setOptions(${action.target}, ${action.options.length} items)`;
        }
        break;
      }

      case 'filterOptions': {
        if (action.target && action.options) {
          const filterVal = action.value !== undefined ? action.value : context.triggerValue;
          const filtered = action.options.filter((opt) => {
            if (opt['parentValue'] !== undefined) {
              return opt['parentValue'] === filterVal;
            }
            if (opt['groupId'] !== undefined) {
              return opt['groupId'] === filterVal;
            }
            return true;
          });
          context.setOptions(action.target, filtered);
          return `filterOptions(${action.target}, ${filtered.length} items matching "${filterVal}")`;
        }
        break;
      }

      case 'compute':
      case 'calculate': {
        if (action.target && action.formula) {
          const result = this.evaluateFormula(action.formula, context);
          context.set(action.target, result);
          return `calculate(${action.target} = ${result} via "${action.formula}")`;
        }
        break;
      }

      case 'toast': {
        if (action.message && context.showToast) {
          context.showToast(action.message, action.severity || 'info');
          return `toast("${action.message}", ${action.severity || 'info'})`;
        }
        break;
      }

      case 'emit': {
        if (action.eventName) {
          context.emit(action.eventName, action.payload !== undefined ? action.payload : context.state);
          return `emit("${action.eventName}")`;
        }
        break;
      }

      case 'apiCall': {
        if (action.url) {
          try {
            const method = action.method || 'GET';
            const headers = { 'Content-Type': 'application/json', ...(action.headers || {}) };
            const reqInit: RequestInit = { method, headers };
            if (method !== 'GET' && action.payload) {
              reqInit.body = typeof action.payload === 'string' ? action.payload : JSON.stringify(action.payload);
            }
            const res = await fetch(action.url, reqInit);
            const json = await res.json();

            if (action.responseMapping) {
              Object.entries(action.responseMapping).forEach(([resKey, formField]) => {
                if (json[resKey] !== undefined) {
                  context.set(formField, json[resKey]);
                }
              });
            }
            return `apiCall(${method} ${action.url} -> ${res.status})`;
          } catch (err: any) {
            console.warn('[GpActionExecutor] apiCall failed:', err);
            return `apiCall(error: ${err?.message || err})`;
          }
        }
        break;
      }

      case 'custom': {
        if (action.execute) {
          await action.execute(context);
          return 'customAction()';
        }
        break;
      }

      default:
        break;
    }

    return '';
  }

  /**
   * Applies string and value transformations.
   */
  public static applyTransformation(val: any, type: GpTransformType): any {
    if (val === null || val === undefined) return val;
    const str = String(val);

    switch (type) {
      case 'uppercase':
        return str.toUpperCase();
      case 'lowercase':
        return str.toLowerCase();
      case 'trim':
        return str.trim();
      case 'capitalize':
        return str.charAt(0).toUpperCase() + str.slice(1);
      case 'titlecase':
        return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
      case 'slugify':
        return str
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '');
      case 'currency': {
        const num = parseFloat(str.replace(/[^0-9.-]+/g, ''));
        return isNaN(num) ? '$0.00' : `$${num.toFixed(2)}`;
      }
      case 'phone': {
        const digits = str.replace(/\D/g, '');
        if (digits.length === 10) {
          return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
        }
        return str;
      }
      default:
        return val;
    }
  }

  /**
   * Safely calculates mathematical, string, and logical formulas replacing context state variables.
   * Built-in helper functions: SUM, AVG, MIN, MAX, ROUND, ABS, CEIL, FLOOR, IF, CONCAT, UPPER, LOWER, TRIM, DATE_DIFF
   * Example: 'SUM(price, tax) * (1 - discount / 100)' or 'IF(quantity > 10, price * 0.9, price)'
   */
  public static evaluateFormula(formula: string, context: GpRuleContext): any {
    try {
      const blocked =
        /\b(?:window|document|globalThis|Function|constructor|__proto__|prototype|eval|import|require|process)\b/;
      if (blocked.test(formula)) {
        console.warn(`[GpActionExecutor] Blocked potentially unsafe formula "${formula}"`);
        return 0;
      }

      // Helper functions injected into formula execution scope
      const helpers = {
        SUM: (...args: any[]) => args.reduce((a, b) => Number(a || 0) + Number(b || 0), 0),
        AVG: (...args: any[]) => (args.length === 0 ? 0 : helpers.SUM(...args) / args.length),
        MIN: (...args: any[]) => Math.min(...args.map(Number)),
        MAX: (...args: any[]) => Math.max(...args.map(Number)),
        ROUND: (val: any, dec = 2) => {
          const factor = Math.pow(10, dec);
          return Math.round(Number(val) * factor) / factor;
        },
        ABS: (val: any) => Math.abs(Number(val)),
        CEIL: (val: any) => Math.ceil(Number(val)),
        FLOOR: (val: any) => Math.floor(Number(val)),
        IF: (condition: any, trueVal: any, falseVal: any) => (Boolean(condition) ? trueVal : falseVal),
        CONCAT: (...args: any[]) => args.join(''),
        UPPER: (s: any) => String(s || '').toUpperCase(),
        LOWER: (s: any) => String(s || '').toLowerCase(),
        TRIM: (s: any) => String(s || '').trim(),
        DATE_DIFF: (d1: any, d2: any, unit: 'days' | 'hours' | 'minutes' = 'days') => {
          const t1 = new Date(d1).getTime();
          const t2 = new Date(d2).getTime();
          const diffMs = Math.abs(t2 - t1);
          if (unit === 'hours') return diffMs / (1000 * 60 * 60);
          if (unit === 'minutes') return diffMs / (1000 * 60);
          return diffMs / (1000 * 60 * 60 * 24);
        }
      };

      const keys = Object.keys(context.state).filter((k) => !k.startsWith('_'));
      const helperKeys = Object.keys(helpers);
      const allKeys = [...helperKeys, ...keys];

      const stateValues = keys.map((k) => {
        const val = context.state[k];
        return typeof val === 'number' ? val : !isNaN(Number(val)) && val !== '' && val !== null ? Number(val) : val;
      });
      const helperValues = helperKeys.map((k) => (helpers as any)[k]);
      const allValues = [...helperValues, ...stateValues];

      const sanitized = formula.replace(/[^a-zA-Z0-9_\s\.\+\-\*\/\%\(\)\?\:\>\<\=\!\&\|\'\"\,]/g, '');
      const fn = new Function(...allKeys, `"use strict"; return (${sanitized});`);
      return fn(...allValues);
    } catch (err) {
      console.warn(`[GpActionExecutor] Failed to calculate formula "${formula}":`, err);
      return 0;
    }
  }
}
