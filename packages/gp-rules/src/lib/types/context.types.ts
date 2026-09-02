/**
 * @file context.types.ts
 * Context and execution logging types for the Dynamic Business Rules Engine.
 */

import { FormGroup } from '@angular/forms';

export interface GpRuleExecutionLog {
  ruleId: string;
  ruleName?: string;
  timestamp: Date;
  triggerEvent: string;
  triggerValue?: any;
  targetField?: string;
  conditionMet: boolean;
  actionsExecuted: string[];
  durationMs: number;
  error?: string;
}

export interface GpRuleContext {
  /** Current state of all form fields / values */
  state: Record<string, any>;

  /** Current triggering event name (e.g. 'keypress', 'blur', 'click', 'change') */
  triggerEvent: string;

  /** Value emitted by the triggering element / event */
  triggerValue?: any;

  /** Native event object (if applicable) */
  originalEvent?: Event | CustomEvent;

  /** The FormGroup instance (if rules are attached to an Angular Reactive Form) */
  form?: FormGroup;

  /** Global / external context variables */
  globals?: Record<string, any>;

  /** Function to get a field value by name or path */
  get: (fieldName: string) => any;

  /** Function to set a field value by name */
  set: (fieldName: string, value: any) => void;

  /** Function to patch multiple field values */
  patch: (values: Record<string, any>) => void;

  /** Function to set visibility of a target */
  setVisibility: (fieldName: string, visible: boolean) => void;

  /** Function to set enabled/disabled state */
  setDisabled: (fieldName: string, disabled: boolean) => void;

  /** Function to update options for dynamic select */
  setOptions: (fieldName: string, options: Array<{ label: string; value: any; [key: string]: any }>) => void;

  /** Function to show toast notification */
  showToast?: (message: string, severity?: 'success' | 'info' | 'warning' | 'danger') => void;

  /** Function to emit custom event */
  emit: (eventName: string, payload?: any) => void;
}
