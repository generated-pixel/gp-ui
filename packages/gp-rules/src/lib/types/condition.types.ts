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
  | 'between'
  | 'notBetween'
  | 'contains'
  | 'notContains'
  | 'startsWith'
  | 'endsWith'
  | 'matches'
  | 'in'
  | 'notIn'
  | 'allIn'
  | 'anyIn'
  | 'noneIn'
  | 'empty'
  | 'notEmpty'
  | 'truthy'
  | 'falsy'
  | 'hasLength'
  | 'lengthGt'
  | 'lengthLt'
  | 'isBefore'
  | 'isAfter'
  | 'isSameDay'
  | 'isBetweenDates'
  | 'isFuture'
  | 'isPast'
  | 'custom'
  | 'expression';

export interface GpRuleCondition {
  /** The field name or dot-notated property path in form state to test */
  field?: string;

  /** The comparison operator */
  operator?: GpRuleOperator;

  /** The expected value or [min, max] range to compare against */
  value?: any;

  /**
   * Optional field name to compare against dynamically (e.g. compare 'confirmPassword' with 'password').
   * If provided, the value of this field from context will be used as the comparison target.
   */
  compareToField?: string;

  /** JavaScript / mathematical expression string to evaluate (e.g. 'totalAmount > 1000 && country === "US"') */
  expression?: string;

  /** Custom synchronous programmatic predicate */
  customPredicate?: (context: GpRuleContext) => boolean;

  /** Custom asynchronous programmatic predicate */
  asyncPredicate?: (context: GpRuleContext) => Promise<boolean>;

  /** Logical AND: all nested conditions must pass */
  all?: GpRuleCondition[];

  /** Logical OR: at least one nested condition must pass */
  any?: GpRuleCondition[];

  /** Logical NOR: none of the nested conditions may pass */
  none?: GpRuleCondition[];

  /** Logical NOT: negates the inner condition */
  not?: GpRuleCondition;
}
