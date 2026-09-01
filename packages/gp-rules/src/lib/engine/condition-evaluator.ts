/**
 * @file condition-evaluator.ts
 * Core condition evaluation engine for Dynamic Business Rules.
 */

import { GpRuleCondition, GpRuleOperator } from '../types/condition.types';
import { GpRuleContext } from '../types/context.types';

export class GpConditionEvaluator {
  /**
   * Evaluate a condition or nested composite condition against the execution context.
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

    // 7. Atomic Operator Evaluation on field
    if (condition.field) {
      const actualValue = context.get(condition.field);
      return this.evaluateOperator(condition.operator || 'eq', actualValue, condition.value, context);
    }

    return true;
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
   * Evaluates a safe expression in the context of state variables.
   */
  public static evaluateExpression(expr: string, context: GpRuleContext): boolean {
    try {
      const blocked = /\b(?:window|document|globalThis|Function|constructor|__proto__|prototype|eval|import|require|process)\b/;
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
