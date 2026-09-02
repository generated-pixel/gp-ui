/**
 * @file action.types.ts
 * Action types for the Dynamic Business Rules Engine.
 */

import { GpRuleContext } from './context.types';

export type GpTransformType =
  | 'uppercase'
  | 'lowercase'
  | 'trim'
  | 'titlecase'
  | 'capitalize'
  | 'slugify'
  | 'currency'
  | 'phone';

export type GpRuleActionType =
  | 'setValue'
  | 'patchValues'
  | 'copyValue'
  | 'transformValue'
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
  | 'setValidationError'
  | 'clearValidationError'
  | 'setClass'
  | 'setStyle'
  | 'setFocus'
  | 'compute'
  | 'calculate'
  | 'toast'
  | 'emit'
  | 'apiCall'
  | 'executeRule'
  | 'runRules'
  | 'custom';

export interface GpRuleAction {
  /** Type of action to perform */
  type: GpRuleActionType;

  /** The target field name or control identifier */
  target?: string;

  /** Source field name when copying or transforming values (e.g. fromField -> target) */
  fromField?: string;

  /** Value to set or payload to pass */
  value?: any;

  /** Transformation function or built-in transform format */
  transformType?: GpTransformType;

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

  /** Error key when setting validation errors (e.g. 'mismatch', 'invalidFormat') */
  errorKey?: string;

  /** Error message when setting validation errors */
  errorMessage?: string;

  /** CSS class name(s) to add or toggle */
  className?: string;

  /** CSS class name(s) to remove */
  removeClassName?: string;

  /** Inline styles to apply */
  styles?: Record<string, string>;

  /** URL for 'apiCall' action */
  url?: string;

  /** HTTP Method for 'apiCall' action */
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

  /** Custom HTTP Headers for 'apiCall' action */
  headers?: Record<string, string>;

  /** Key mappings from response JSON into context state: { "resField": "formTargetField" } */
  responseMapping?: Record<string, string>;

  /** Target rule ID or list of rule IDs to trigger */
  ruleIds?: string[];

  /** Custom programmatic execution function */
  execute?: (context: GpRuleContext) => void | Promise<void>;
}
