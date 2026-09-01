/**
 * @file action-executor.ts
 * Core action executor for Dynamic Business Rules.
 */

import { GpRuleAction } from '../types/action.types';
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
   * Safely calculates mathematical/string formulas replacing context state variables.
   * Example: 'quantity * unitPrice * (1 - discountPercent / 100)'
   */
  public static evaluateFormula(formula: string, context: GpRuleContext): any {
    try {
      // Replace field names with state lookups
      const keys = Object.keys(context.state).filter((k) => !k.startsWith('_'));
      const values = keys.map((k) => {
        const val = context.state[k];
        return typeof val === 'number' ? val : !isNaN(Number(val)) && val !== '' ? Number(val) : val;
      });

      const sanitized = formula.replace(/[^a-zA-Z0-9_\s\.\+\-\*\/\%\(\)\?\:\>\<\=\!\&\|\'\"\,]/g, '');
      const fn = new Function(...keys, `return (${sanitized});`);
      return fn(...values);
    } catch (err) {
      console.warn(`[GpActionExecutor] Failed to calculate formula "${formula}":`, err);
      return 0;
    }
  }
}
