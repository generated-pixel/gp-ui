/**
 * @file rule-validator.ts
 * Static analysis, linting, and dependency validator for business rules.
 */

import { GpBusinessRule, GpRuleValidationError, GpRuleValidationResult } from '../types/rule.types';
import { GpRuleCondition } from '../types/condition.types';
import { GpRuleAction } from '../types/action.types';

export class GpRuleValidator {
  /**
   * Validate a single business rule or an entire collection of rules.
   */
  public static validate(rules: GpBusinessRule | GpBusinessRule[]): GpRuleValidationResult {
    const ruleList = Array.isArray(rules) ? rules : [rules];
    const errors: GpRuleValidationError[] = [];
    const warnings: GpRuleValidationError[] = [];
    const seenIds = new Set<string>();

    for (const rule of ruleList) {
      // 1. ID Validation
      if (!rule.id || typeof rule.id !== 'string' || rule.id.trim() === '') {
        errors.push({
          ruleId: rule.id || 'unknown',
          field: 'id',
          message: 'Rule must have a non-empty string "id".',
          severity: 'error',
          code: 'INVALID_RULE_ID'
        });
      } else if (seenIds.has(rule.id)) {
        errors.push({
          ruleId: rule.id,
          field: 'id',
          message: `Duplicate rule id "${rule.id}" detected.`,
          severity: 'error',
          code: 'DUPLICATE_RULE_ID'
        });
      } else {
        seenIds.add(rule.id);
      }

      // 2. Trigger Validation
      this.validateTriggers(rule, errors, warnings);

      // 3. Condition Validation
      if (rule.condition) {
        this.validateCondition(rule.id, rule.condition, errors, warnings);
      }

      // 4. Actions Validation
      this.validateActions(rule.id, rule.actions, false, errors, warnings);
      if (rule.elseActions) {
        this.validateActions(rule.id, rule.elseActions, true, errors, warnings);
      }

      // 5. Dependency Validation
      if (rule.dependsOn && Array.isArray(rule.dependsOn)) {
        for (const depId of rule.dependsOn) {
          if (depId === rule.id) {
            errors.push({
              ruleId: rule.id,
              field: 'dependsOn',
              message: `Rule cannot depend on itself ("${depId}").`,
              severity: 'error',
              code: 'SELF_DEPENDENCY'
            });
          }
        }
      }
    }

    // 6. Cyclic Dependency Graph Check
    const cyclicDependencies = this.detectCycles(ruleList);
    for (const cycle of cyclicDependencies) {
      errors.push({
        ruleId: cycle[0],
        field: 'dependsOn',
        message: `Cyclic dependency cycle detected: ${cycle.join(' -> ')}`,
        severity: 'error',
        code: 'CYCLIC_DEPENDENCY'
      });
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      cyclicDependencies: cyclicDependencies.length > 0 ? cyclicDependencies : undefined
    };
  }

  private static validateTriggers(
    rule: GpBusinessRule,
    errors: GpRuleValidationError[],
    warnings: GpRuleValidationError[]
  ): void {
    if (!rule.trigger) {
      errors.push({
        ruleId: rule.id,
        field: 'trigger',
        message: 'Rule must define at least one trigger.',
        severity: 'error',
        code: 'MISSING_TRIGGER'
      });
      return;
    }

    const triggers = Array.isArray(rule.trigger) ? rule.trigger : [rule.trigger];
    if (triggers.length === 0) {
      errors.push({
        ruleId: rule.id,
        field: 'trigger',
        message: 'Rule trigger array cannot be empty.',
        severity: 'error',
        code: 'EMPTY_TRIGGER_ARRAY'
      });
      return;
    }

    for (const trig of triggers) {
      const eventName = typeof trig === 'string' ? trig : trig.event;
      if (!eventName || typeof eventName !== 'string' || eventName.trim() === '') {
        errors.push({
          ruleId: rule.id,
          field: 'trigger.event',
          message: 'Trigger event name cannot be empty.',
          severity: 'error',
          code: 'INVALID_TRIGGER_EVENT'
        });
      }

      if (typeof trig === 'object') {
        if (trig.debounce !== undefined && (typeof trig.debounce !== 'number' || trig.debounce < 0)) {
          errors.push({
            ruleId: rule.id,
            field: 'trigger.debounce',
            message: 'Debounce delay must be a non-negative number.',
            severity: 'error',
            code: 'INVALID_DEBOUNCE'
          });
        }
      }
    }
  }

  private static validateCondition(
    ruleId: string,
    cond: GpRuleCondition,
    errors: GpRuleValidationError[],
    warnings: GpRuleValidationError[]
  ): void {
    const isComposite = Boolean(cond.all || cond.any || cond.none || cond.not);
    const hasField = Boolean(cond.field);
    const hasExpr = Boolean(cond.expression);
    const hasPred = Boolean(cond.customPredicate || cond.asyncPredicate);

    if (!isComposite && !hasField && !hasExpr && !hasPred) {
      warnings.push({
        ruleId,
        field: 'condition',
        message: 'Condition specifies neither a target field, expression, predicate, nor nested composites.',
        severity: 'warning',
        code: 'EMPTY_CONDITION'
      });
    }

    if (cond.operator === 'matches' && cond.value) {
      try {
        new RegExp(cond.value);
      } catch (err) {
        errors.push({
          ruleId,
          field: 'condition.value',
          message: `Invalid Regular Expression pattern "${cond.value}".`,
          severity: 'error',
          code: 'INVALID_REGEX'
        });
      }
    }

    if ((cond.operator === 'between' || cond.operator === 'notBetween') && cond.value !== undefined) {
      if (!Array.isArray(cond.value) || cond.value.length !== 2) {
        errors.push({
          ruleId,
          field: 'condition.value',
          message: `Operator "${cond.operator}" expects a 2-element array [min, max].`,
          severity: 'error',
          code: 'INVALID_RANGE_VALUE'
        });
      }
    }

    if (cond.expression) {
      if (!this.checkBalancedBrackets(cond.expression)) {
        errors.push({
          ruleId,
          field: 'condition.expression',
          message: `Unbalanced brackets/parentheses in expression "${cond.expression}".`,
          severity: 'error',
          code: 'MALFORMED_EXPRESSION'
        });
      }
    }

    if (cond.all) cond.all.forEach((sub) => this.validateCondition(ruleId, sub, errors, warnings));
    if (cond.any) cond.any.forEach((sub) => this.validateCondition(ruleId, sub, errors, warnings));
    if (cond.none) cond.none.forEach((sub) => this.validateCondition(ruleId, sub, errors, warnings));
    if (cond.not) this.validateCondition(ruleId, cond.not, errors, warnings);
  }

  private static validateActions(
    ruleId: string,
    actions: GpRuleAction | GpRuleAction[] | undefined,
    isElse: boolean,
    errors: GpRuleValidationError[],
    warnings: GpRuleValidationError[]
  ): void {
    if (!actions && !isElse) {
      errors.push({
        ruleId,
        field: 'actions',
        message: 'Rule must define at least one action.',
        severity: 'error',
        code: 'MISSING_ACTIONS'
      });
      return;
    }

    if (!actions) return;

    const actionList = Array.isArray(actions) ? actions : [actions];
    if (actionList.length === 0 && !isElse) {
      errors.push({
        ruleId,
        field: 'actions',
        message: 'Action list cannot be empty.',
        severity: 'error',
        code: 'EMPTY_ACTIONS_ARRAY'
      });
      return;
    }

    for (const action of actionList) {
      if (!action.type) {
        errors.push({
          ruleId,
          field: 'action.type',
          message: 'Action must specify an action "type".',
          severity: 'error',
          code: 'MISSING_ACTION_TYPE'
        });
        continue;
      }

      if (['setValue', 'show', 'hide', 'enable', 'disable', 'setValidationError'].includes(action.type)) {
        if (!action.target) {
          warnings.push({
            ruleId,
            field: 'action.target',
            message: `Action "${action.type}" usually requires a "target" field identifier.`,
            severity: 'warning',
            code: 'MISSING_ACTION_TARGET'
          });
        }
      }

      if (action.type === 'copyValue' && (!action.target || !action.fromField)) {
        errors.push({
          ruleId,
          field: 'action.copyValue',
          message: 'Action "copyValue" requires both "fromField" and "target".',
          severity: 'error',
          code: 'INVALID_COPY_ACTION'
        });
      }

      if ((action.type === 'compute' || action.type === 'calculate') && !action.formula) {
        errors.push({
          ruleId,
          field: 'action.formula',
          message: 'Compute / calculate action requires a "formula" string.',
          severity: 'error',
          code: 'MISSING_FORMULA'
        });
      } else if (action.formula && !this.checkBalancedBrackets(action.formula)) {
        errors.push({
          ruleId,
          field: 'action.formula',
          message: `Unbalanced brackets/parentheses in formula "${action.formula}".`,
          severity: 'error',
          code: 'MALFORMED_FORMULA'
        });
      }
    }
  }

  private static checkBalancedBrackets(str: string): boolean {
    const stack: string[] = [];
    const pairs: Record<string, string> = { ')': '(', ']': '[', '}': '{' };
    for (const char of str) {
      if (['(', '[', '{'].includes(char)) {
        stack.push(char);
      } else if ([')', ']', '}'].includes(char)) {
        if (stack.pop() !== pairs[char]) {
          return false;
        }
      }
    }
    return stack.length === 0;
  }

  private static detectCycles(rules: GpBusinessRule[]): string[][] {
    const graph = new Map<string, string[]>();
    for (const r of rules) {
      graph.set(r.id, r.dependsOn || []);
    }

    const cycles: string[][] = [];
    const visited = new Set<string>();
    const recStack = new Set<string>();
    const path: string[] = [];

    const dfs = (node: string) => {
      visited.add(node);
      recStack.add(node);
      path.push(node);

      const neighbors = graph.get(node) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          if (graph.has(neighbor)) {
            dfs(neighbor);
          }
        } else if (recStack.has(neighbor)) {
          const cycleStartIdx = path.indexOf(neighbor);
          if (cycleStartIdx >= 0) {
            cycles.push([...path.slice(cycleStartIdx), neighbor]);
          }
        }
      }

      recStack.delete(node);
      path.pop();
    };

    for (const rule of rules) {
      if (!visited.has(rule.id)) {
        dfs(rule.id);
      }
    }

    return cycles;
  }
}
