/**
 * @file action.types.ts
 * Action types for the Dynamic Business Rules Engine.
 */

import { GpRuleContext } from './context.types';

export type GpRuleActionType =
  | 'setValue'
  | 'patchValues'
  | 'reset'
  | 'clear'
  | 'show'
  | 'hide'
  | 'toggleVisibility'
  | 'enable'
  | 'disable'
  | 'setRequired'
  | 'setReadonly'
  | 'setOptions'
  | 'filterOptions'
  | 'compute'
  | 'calculate'
  | 'toast'
  | 'emit'
  | 'apiCall'
  | 'executeRule'
  | 'custom';

export interface GpRuleAction {
  /** Type of action to perform */
  type: GpRuleActionType;

  /** The target field name or control identifier */
  target?: string;

  /** Value to set or payload to pass */
  value?: any;

  /** Mathematical/string formula for calculate/compute actions (e.g. 'quantity * unitPrice * (1 - discountPercent / 100)') */
  formula?: string;

  /** Options array for 'setOptions' or dynamic select population */
  options?: Array<{ label: string; value: any; [key: string]: any }>;

  /** Toast notification message */
  message?: string;

  /** Toast severity */
  severity?: 'success' | 'info' | 'warning' | 'danger';

  /** Event name for 'emit' action */
  eventName?: string;

  /** Event payload or API request body */
  payload?: any;

  /** Custom programmatic execution function */
  execute?: (context: GpRuleContext) => void | Promise<void>;
}
