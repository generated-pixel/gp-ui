/**
 * @file trigger.types.ts
 * Trigger definitions and event types for Dynamic Business Rules.
 */

export type GpRuleEventType =
  | 'keypress'
  | 'keydown'
  | 'keyup'
  | 'input'
  | 'blur'
  | 'focus'
  | 'focusin'
  | 'focusout'
  | 'change'
  | 'valueChange'
  | 'click'
  | 'select'
  | 'init'
  | 'mount'
  | 'custom';

export interface GpRuleTrigger {
  /** The DOM or component event to listen for */
  event: GpRuleEventType;

  /** Debounce delay in milliseconds (useful for live keypress/input searching and formulas) */
  debounce?: number;

  /** Throttle interval in milliseconds */
  throttle?: number;

  /** Only trigger when the emitted value has changed */
  distinctUntilChanged?: boolean;

  /** Optional target field name to scope this trigger to */
  targetField?: string;

  /** Key filter for keyboard events (e.g. 'Enter', 'Escape') */
  keyFilter?: string | string[];

  /** Custom event name when event is 'custom' */
  customEventName?: string;
}

export type GpTriggerDefinition = GpRuleEventType | GpRuleTrigger;
