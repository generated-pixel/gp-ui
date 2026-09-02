/**
 * @file condition.types.ts
 * Condition and expression types for the Dynamic Business Rules Engine.
 */

import { GpRuleContext } from './context.types';

export type GpRuleOperator =
  | 'eq'
  | 'equals'
  | 'neq'
  | 'notEquals'
  | 'gt'
  | 'greaterThan'
  | 'gte'
  | 'greaterThanOrEqual'
  | 'lt'
  | 'lessThan'
  | 'lte'
  | 'lessThanOrEqual'
  | 'contains'
  | 'notContains'
  | 'startsWith'
  | 'endsWith'
  | 'matches'
  | 'in'
  | 'notIn'
  | 'empty'
  | 'notEmpty'
  | 'truthy'
  | 'falsy'
  | 'custom'
  | 'expression';

export interface GpRuleCondition {
  /** The field name or dot-notated property path in form state to test */
  field?: string;

  /** The comparison operator */
  operator?: GpRuleOperator;

  /** The expected value to compare against */
  value?: any;

  /** JavaScript / mathematical expression string to evaluate (e.g. 'totalAmount > 1000 && country === "US"') */
  expression?: string;

  /** Custom programmatic predicate */
  customPredicate?: (context: GpRuleContext) => boolean;

  /** Logical AND: all nested conditions must pass */
  all?: GpRuleCondition[];

  /** Logical OR: at least one nested condition must pass */
  any?: GpRuleCondition[];

  /** Logical NOR: none of the nested conditions may pass */
  none?: GpRuleCondition[];

  /** Logical NOT: negates the inner condition */
  not?: GpRuleCondition;
}
