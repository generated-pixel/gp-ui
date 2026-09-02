/**
 * @file rule-simulator.ts
 * Dry-run execution simulation engine for testing and previewing business rules.
 */

import { GpBusinessRule, GpRuleSimulationOptions, GpRuleSimulationResult } from '../types/rule.types';
import { GpRuleContextFactory } from './rule-context';
import { GpConditionEvaluator } from './condition-evaluator';
import { GpActionExecutor } from './action-executor';
import { GpRuleExecutionLog } from '../types/context.types';

export class GpRuleSimulator {
  /**
   * Run an isolated dry-run simulation of a set of rules against initial mock state.
   */
  public static async simulate(options: GpRuleSimulationOptions): Promise<GpRuleSimulationResult> {
    const startTime = performance.now();
    const eventType = (options.triggerEvent || 'change') as any;
    const initialClone = JSON.parse(JSON.stringify(options.initialState || {}));
    const workingState = JSON.parse(JSON.stringify(options.initialState || {}));

    const logs: GpRuleExecutionLog[] = [];
    const matchedRules: string[] = [];
    const executedActions: string[] = [];

    const context = GpRuleContextFactory.create({
      state: workingState,
      triggerEvent: eventType,
      triggerValue: options.triggerValue !== undefined ? options.triggerValue : workingState[options.targetField || ''],
      globals: options.globals,
      onStateChange: (field, val) => {
        workingState[field] = val;
      }
    });

    const activeRules = options.rules
      .filter((r) => r.enabled !== false)
      .sort((a, b) => (b.priority || 0) - (a.priority || 0));

    for (const rule of activeRules) {
      const ruleStart = performance.now();
      const beforeSnapshot = JSON.parse(JSON.stringify(workingState));

      // Check trigger
      const matchesTrigger = this.checkTriggerMatch(rule, eventType, options.targetField);
      if (!matchesTrigger) {
        continue;
      }

      let conditionMet = false;
      let ruleActions: string[] = [];
      let errorStr: string | undefined;

      try {
        conditionMet = await GpConditionEvaluator.evaluateAsync(rule.condition, context);
        if (conditionMet) {
          matchedRules.push(rule.id);
          ruleActions = await GpActionExecutor.executeAll(rule.actions, context);
          executedActions.push(...ruleActions);
        } else if (rule.elseActions) {
          const elseAct = await GpActionExecutor.executeAll(rule.elseActions, context);
          ruleActions = elseAct.map((a) => `(else) ${a}`);
          executedActions.push(...ruleActions);
        }
      } catch (err: any) {
        errorStr = err?.message || String(err);
      }

      const afterSnapshot = JSON.parse(JSON.stringify(workingState));
      const durationMs = Math.round((performance.now() - ruleStart) * 100) / 100;

      logs.push({
        ruleId: rule.id,
        ruleName: rule.name || rule.id,
        timestamp: new Date(),
        triggerEvent: eventType,
        triggerValue: options.triggerValue,
        targetField: options.targetField || rule.condition?.field,
        conditionMet,
        actionsExecuted: ruleActions,
        durationMs,
        error: errorStr,
        stateDiff: {
          before: beforeSnapshot,
          after: afterSnapshot
        }
      });

      if (rule.stopOnMatch && conditionMet) {
        break;
      }
    }

    const durationMs = Math.round((performance.now() - startTime) * 100) / 100;
    const finalClone = JSON.parse(JSON.stringify(workingState));
    const stateDiff = this.calculateStateDiff(initialClone, finalClone);

    return {
      initialState: initialClone,
      finalState: finalClone,
      stateDiff,
      matchedRules,
      executedActions,
      logs,
      durationMs
    };
  }

  private static checkTriggerMatch(rule: GpBusinessRule, eventType: string, targetField?: string): boolean {
    const triggers = Array.isArray(rule.trigger) ? rule.trigger : [rule.trigger];
    return triggers.some((t) => {
      const trigEvent = typeof t === 'string' ? t : t.event;
      if (trigEvent !== eventType && trigEvent !== 'custom') {
        return false;
      }
      if (typeof t === 'object' && t.targetField && targetField && t.targetField !== targetField) {
        return false;
      }
      return true;
    });
  }

  private static calculateStateDiff(
    before: Record<string, any>,
    after: Record<string, any>
  ): {
    changed: Record<string, { before: any; after: any }>;
    added: Record<string, any>;
    removed: Record<string, any>;
  } {
    const changed: Record<string, { before: any; after: any }> = {};
    const added: Record<string, any> = {};
    const removed: Record<string, any> = {};

    const allKeys = new Set([...Object.keys(before), ...Object.keys(after)]);

    for (const key of allKeys) {
      if (before[key] === undefined && after[key] !== undefined) {
        added[key] = after[key];
      } else if (before[key] !== undefined && after[key] === undefined) {
        removed[key] = before[key];
      } else if (JSON.stringify(before[key]) !== JSON.stringify(after[key])) {
        changed[key] = { before: before[key], after: after[key] };
      }
    }

    return { changed, added, removed };
  }
}
