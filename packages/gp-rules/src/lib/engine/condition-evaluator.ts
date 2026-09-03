/**
 * @file condition-evaluator.ts
 * Core condition evaluation engine for Dynamic Business Rules.
 */

import { GpRuleCondition, GpRuleOperator } from '../types/condition.types';
import { GpRuleContext } from '../types/context.types';

export class GpConditionEvaluator {
  /**
   * Evaluate a condition or nested composite condition synchronously against the execution context.
   */
  public static evaluate(condition: GpRuleCondition | undefined, context: GpRuleContext): boolean {
    if (!condition) {
      return true;
    }

    // 1. Composite: NOT
    if (condition.not) {
      return !this.evaluate(condition.not, context);
    }

    // 2. Composite: ALL (AND)
    if (condition.all && Array.isArray(condition.all)) {
      if (condition.all.length === 0) {
        return true;
      }
      return condition.all.every((sub) => this.evaluate(sub, context));
    }

    // 3. Composite: ANY (OR)
    if (condition.any && Array.isArray(condition.any)) {
      if (condition.any.length === 0) {
        return true;
      }
      return condition.any.some((sub) => this.evaluate(sub, context));
    }

    // 4. Composite: NONE (NOR)
    if (condition.none && Array.isArray(condition.none)) {
      if (condition.none.length === 0) {
        return true;
      }
      return !condition.none.some((sub) => this.evaluate(sub, context));
    }

    // 5. Custom Predicate
    if (condition.customPredicate && typeof condition.customPredicate === 'function') {
      try {
        return !!condition.customPredicate(context);
      } catch (err) {
        console.warn('[GpConditionEvaluator] Error in customPredicate:', err);
        return false;
      }
    }

    // 6. Expression String (e.g. "total > 100 && country === 'US'")
    if (condition.expression && typeof condition.expression === 'string') {
      return this.evaluateExpression(condition.expression, context);
    }

    // 7. Atomic Operator Evaluation on field or field-to-field comparison
    if (condition.field) {
      const actualValue = context.get(condition.field);
      const expectedValue =
        condition.compareToField !== undefined ? context.get(condition.compareToField) : condition.value;
      return this.evaluateOperator(condition.operator || 'eq', actualValue, expectedValue, context);
    }

    return true;
  }

  /**
   * Evaluate a condition or nested composite condition asynchronously against the execution context.
   */
  public static async evaluateAsync(condition: GpRuleCondition | undefined, context: GpRuleContext): Promise<boolean> {
    if (!condition) {
      return true;
    }

    // 1. Composite: NOT
    if (condition.not) {
      const res = await this.evaluateAsync(condition.not, context);
      return !res;
    }

    // 2. Composite: ALL (AND)
    if (condition.all && Array.isArray(condition.all)) {
      if (condition.all.length === 0) {
        return true;
      }
      for (const sub of condition.all) {
        const res = await this.evaluateAsync(sub, context);
        if (!res) {
          return false;
        }
      }
      return true;
    }

    // 3. Composite: ANY (OR)
    if (condition.any && Array.isArray(condition.any)) {
      if (condition.any.length === 0) {
        return true;
      }
      for (const sub of condition.any) {
        const res = await this.evaluateAsync(sub, context);
        if (res) {
          return true;
        }
      }
      return false;
    }

    // 4. Composite: NONE (NOR)
    if (condition.none && Array.isArray(condition.none)) {
      if (condition.none.length === 0) {
        return true;
      }
      for (const sub of condition.none) {
        const res = await this.evaluateAsync(sub, context);
        if (res) {
          return false;
        }
      }
      return true;
    }

    // 5. Async Predicate
    if (condition.asyncPredicate && typeof condition.asyncPredicate === 'function') {
      try {
        return !!(await condition.asyncPredicate(context));
      } catch (err) {
        console.warn('[GpConditionEvaluator] Error in asyncPredicate:', err);
        return false;
      }
    }

    // Fallback to standard synchronous evaluator for non-async parts
    return this.evaluate(condition, context);
  }

  /**
   * Evaluate atomic operator between actualValue and expectedValue.
   */
  public static evaluateOperator(
    operator: GpRuleOperator,
    actual: any,
    expected: any,
    context: GpRuleContext
  ): boolean {
    switch (operator) {
      case 'eq':
      case 'equals':
        return actual === expected || (actual == expected && actual !== undefined && expected !== undefined);

      case 'neq':
      case 'notEquals':
        return actual !== expected && actual != expected;

      case 'gt':
      case 'greaterThan':
        return Number(actual) > Number(expected);

      case 'gte':
      case 'greaterThanOrEqual':
        return Number(actual) >= Number(expected);

      case 'lt':
      case 'lessThan':
        return Number(actual) < Number(expected);

      case 'lte':
      case 'lessThanOrEqual':
        return Number(actual) <= Number(expected);

      case 'between':
        if (Array.isArray(expected) && expected.length === 2) {
          const num = Number(actual);
          return num >= Number(expected[0]) && num <= Number(expected[1]);
        }
        return false;

      case 'notBetween':
        if (Array.isArray(expected) && expected.length === 2) {
          const num = Number(actual);
          return num < Number(expected[0]) || num > Number(expected[1]);
        }
        return true;

      case 'contains':
        if (typeof actual === 'string') {
          return actual.toLowerCase().includes(String(expected).toLowerCase());
        }
        if (Array.isArray(actual)) {
          return actual.includes(expected);
        }
        return false;

      case 'notContains':
        if (typeof actual === 'string') {
          return !actual.toLowerCase().includes(String(expected).toLowerCase());
        }
        if (Array.isArray(actual)) {
          return !actual.includes(expected);
        }
        return true;

      case 'startsWith':
        return typeof actual === 'string' && actual.toLowerCase().startsWith(String(expected).toLowerCase());

      case 'endsWith':
        return typeof actual === 'string' && actual.toLowerCase().endsWith(String(expected).toLowerCase());

      case 'matches':
        if (typeof actual !== 'string') {
          return false;
        }
        try {
          const regex = typeof expected === 'string' ? new RegExp(expected) : (expected as RegExp);
          return regex.test(actual);
        } catch {
          return false;
        }

      case 'in':
        if (Array.isArray(expected)) {
          return expected.includes(actual);
        }
        return false;

      case 'notIn':
        if (Array.isArray(expected)) {
          return !expected.includes(actual);
        }
        return true;

      case 'allIn':
        if (Array.isArray(actual) && Array.isArray(expected)) {
          return expected.every((exp) => actual.includes(exp));
        }
        return false;

      case 'anyIn':
        if (Array.isArray(actual) && Array.isArray(expected)) {
          return expected.some((exp) => actual.includes(exp));
        }
        return false;

      case 'noneIn':
        if (Array.isArray(actual) && Array.isArray(expected)) {
          return !expected.some((exp) => actual.includes(exp));
        }
        return true;

      case 'hasLength':
        if (typeof actual === 'string' || Array.isArray(actual)) {
          return actual.length === Number(expected);
        }
        return false;

      case 'lengthGt':
        if (typeof actual === 'string' || Array.isArray(actual)) {
          return actual.length > Number(expected);
        }
        return false;

      case 'lengthLt':
        if (typeof actual === 'string' || Array.isArray(actual)) {
          return actual.length < Number(expected);
        }
        return false;

      case 'isBefore': {
        const t1 = this.toTimestamp(actual);
        const t2 = this.toTimestamp(expected);
        return t1 !== null && t2 !== null && t1 < t2;
      }

      case 'isAfter': {
        const t1 = this.toTimestamp(actual);
        const t2 = this.toTimestamp(expected);
        return t1 !== null && t2 !== null && t1 > t2;
      }

      case 'isSameDay': {
        const d1 = this.toDate(actual);
        const d2 = this.toDate(expected);
        return (
          d1 !== null &&
          d2 !== null &&
          ((d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate()) ||
            (d1.getUTCFullYear() === d2.getUTCFullYear() &&
              d1.getUTCMonth() === d2.getUTCMonth() &&
              d1.getUTCDate() === d2.getUTCDate()))
        );
      }

      case 'isBetweenDates': {
        if (Array.isArray(expected) && expected.length === 2) {
          const t = this.toTimestamp(actual);
          const tStart = this.toTimestamp(expected[0]);
          const tEnd = this.toTimestamp(expected[1]);
          return t !== null && tStart !== null && tEnd !== null && t >= tStart && t <= tEnd;
        }
        return false;
      }

      case 'isFuture': {
        const t = this.toTimestamp(actual);
        return t !== null && t > Date.now();
      }

      case 'isPast': {
        const t = this.toTimestamp(actual);
        return t !== null && t < Date.now();
      }

      case 'empty':
        return (
          actual === null ||
          actual === undefined ||
          actual === '' ||
          (Array.isArray(actual) && actual.length === 0) ||
          (typeof actual === 'object' && Object.keys(actual).length === 0)
        );

      case 'notEmpty':
        return (
          actual !== null &&
          actual !== undefined &&
          actual !== '' &&
          (!Array.isArray(actual) || actual.length > 0) &&
          (typeof actual !== 'object' || Object.keys(actual).length > 0)
        );

      case 'truthy':
        return !!actual;

      case 'falsy':
        return !actual;

      default:
        return actual === expected;
    }
  }

  /**
   * Helper to parse timestamps safely.
   */
  private static toTimestamp(val: any): number | null {
    if (!val) {
      return null;
    }
    if (val instanceof Date) {
      return val.getTime();
    }
    const parsed = new Date(val);
    const time = parsed.getTime();
    return isNaN(time) ? null : time;
  }

  /**
   * Helper to parse Date object safely.
   */
  private static toDate(val: any): Date | null {
    if (!val) {
      return null;
    }
    if (val instanceof Date) {
      return val;
    }
    const parsed = new Date(val);
    return isNaN(parsed.getTime()) ? null : parsed;
  }

  /**
   * Evaluates a safe expression in the context of state variables.
   */
  public static evaluateExpression(expr: string, context: GpRuleContext): boolean {
    try {
      const blocked =
        /\b(?:window|document|globalThis|Function|constructor|__proto__|prototype|eval|import|require|process)\b/;
      if (blocked.test(expr)) {
        console.warn(`[GpConditionEvaluator] Blocked potentially unsafe expression "${expr}"`);
        return false;
      }
      const sanitized = expr.replace(/[^a-zA-Z0-9_\s\.\+\-\*\/\%\(\)\?\:\>\<\=\!\&\|\'\"\,]/g, '');
      const keys = Object.keys(context.state);
      const values = keys.map((k) => context.state[k]);
      const fn = new Function(...keys, `"use strict"; return Boolean(${sanitized});`);
      return Boolean(fn(...values));
    } catch (err) {
      console.warn(`[GpConditionEvaluator] Failed to evaluate expression "${expr}":`, err);
      return false;
    }
  }
}
