/**
 * @file rule-engine.service.ts
 * Injectable Business Rule Engine Service.
 */

import { Injectable, signal, computed } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { GpBusinessRule } from '../types/rule.types';
import { GpRuleTrigger, GpRuleEventType } from '../types/trigger.types';
import { GpRuleContext, GpRuleExecutionLog } from '../types/context.types';
import { GpConditionEvaluator } from './condition-evaluator';
import { GpActionExecutor } from './action-executor';

@Injectable({
  providedIn: 'root'
})
export class GpRuleEngineService {
  /** All currently registered rules */
  public rules = signal<GpBusinessRule[]>([]);

  /** Execution log history for debugging and visual inspection */
  public logs = signal<GpRuleExecutionLog[]>([]);

  /** Max logs to retain in memory */
  public maxLogs = 50;

  /** Flag indicating active rule evaluation */
  public isExecuting = signal<boolean>(false);

  /** Track active recursion depth to prevent infinite loops */
  private executionDepth = 0;
  private maxDepth = 10;

  /** Internal RxJS debouncers keyed by `ruleId_event` */
  private debouncers = new Map<
    string,
    { subject: Subject<{ context: GpRuleContext; rule: GpBusinessRule }>; sub: Subscription }
  >();

  /**
   * Register a new business rule into the engine.
   */
  public registerRule(rule: GpBusinessRule): void {
    this.rules.update((existing) => {
      const idx = existing.findIndex((r) => r.id === rule.id);
      if (idx >= 0) {
        const updated = [...existing];
        updated[idx] = rule;
        return updated;
      }
      return [...existing, rule];
    });
  }

  /**
   * Register multiple business rules in bulk.
   */
  public registerRules(rules: GpBusinessRule[]): void {
    rules.forEach((r) => this.registerRule(r));
  }

  /**
   * Remove a registered rule by ID.
   */
  public unregisterRule(ruleId: string): void {
    this.rules.update((existing) => existing.filter((r) => r.id !== ruleId));
    // Clean up debouncers for this rule
    for (const [key, val] of this.debouncers.entries()) {
      if (key.startsWith(`${ruleId}_`)) {
        val.sub.unsubscribe();
        this.debouncers.delete(key);
      }
    }
  }

  /**
   * Clear all registered rules and active subscriptions.
   */
  public clearRules(): void {
    this.debouncers.forEach((d) => d.sub.unsubscribe());
    this.debouncers.clear();
    this.rules.set([]);
  }

  /**
   * Clear execution log history.
   */
  public clearLogs(): void {
    this.logs.set([]);
  }

  /**
   * Dispatch an event through the business rules engine.
   * Finds matching active rules, respects debounce/throttle, evaluates conditions, and executes actions.
   */
  public async dispatchEvent(
    eventType: GpRuleEventType,
    context: GpRuleContext,
    targetField?: string,
    scopedRules?: GpBusinessRule[]
  ): Promise<GpRuleExecutionLog[]> {
    if (this.executionDepth >= this.maxDepth) {
      console.warn('[GpRuleEngineService] Max execution depth exceeded! Potential cyclic rule dependency.');
      return [];
    }

    const availableRules = scopedRules || this.rules();
    const activeRules = availableRules
      .filter((r) => r.enabled !== false)
      .sort((a, b) => (b.priority || 0) - (a.priority || 0));

    const matchingRules = activeRules.filter((rule) => {
      return this.matchesTrigger(rule, eventType, targetField, context);
    });

    const executionResults: GpRuleExecutionLog[] = [];

    for (const rule of matchingRules) {
      const trigger = this.getMatchingTrigger(rule, eventType);
      const debounceDelay = typeof trigger === 'object' ? trigger.debounce : undefined;

      if (debounceDelay && debounceDelay > 0) {
        this.queueDebouncedRule(rule, eventType, debounceDelay, context);
      } else {
        const log = await this.executeRule(rule, eventType, context, targetField);
        executionResults.push(log);
        if (rule.stopOnMatch && log.conditionMet) {
          break;
        }
      }
    }

    return executionResults;
  }

  /**
   * Execute a single business rule immediately against context.
   */
  public async executeRule(
    rule: GpBusinessRule,
    eventType: string,
    context: GpRuleContext,
    targetField?: string
  ): Promise<GpRuleExecutionLog> {
    const startTime = performance.now();
    this.executionDepth++;
    this.isExecuting.set(true);

    let conditionMet = false;
    const actionsExecuted: string[] = [];
    let errorStr: string | undefined;

    try {
      // 1. Evaluate Condition
      conditionMet = GpConditionEvaluator.evaluate(rule.condition, context);

      // 2. Execute Primary or Else Actions
      if (conditionMet) {
        const executed = await GpActionExecutor.executeAll(rule.actions, context);
        actionsExecuted.push(...executed);
      } else if (rule.elseActions) {
        const elseExecuted = await GpActionExecutor.executeAll(rule.elseActions, context);
        actionsExecuted.push(...elseExecuted.map((a) => `(else) ${a}`));
      }
    } catch (err: any) {
      errorStr = err?.message || String(err);
      console.error(`[GpRuleEngineService] Error executing rule "${rule.id}":`, err);
    } finally {
      this.executionDepth = Math.max(0, this.executionDepth - 1);
      this.isExecuting.set(this.executionDepth > 0);
    }

    const durationMs = Math.round((performance.now() - startTime) * 100) / 100;

    const log: GpRuleExecutionLog = {
      ruleId: rule.id,
      ruleName: rule.name || rule.id,
      timestamp: new Date(),
      triggerEvent: eventType,
      triggerValue: context.triggerValue,
      targetField: targetField || rule.condition?.field,
      conditionMet,
      actionsExecuted,
      durationMs,
      error: errorStr
    };

    this.logs.update((existing) => [log, ...existing].slice(0, this.maxLogs));
    return log;
  }

  /**
   * Checks whether a rule trigger matches the current event.
   */
  private matchesTrigger(
    rule: GpBusinessRule,
    eventType: GpRuleEventType,
    targetField: string | undefined,
    context: GpRuleContext
  ): boolean {
    const triggers = Array.isArray(rule.trigger) ? rule.trigger : [rule.trigger];

    return triggers.some((t) => {
      const trigEvent = typeof t === 'string' ? t : t.event;
      if (trigEvent !== eventType && trigEvent !== 'custom') {
        return false;
      }

      if (typeof t === 'object') {
        if (t.targetField && targetField && t.targetField !== targetField) {
          return false;
        }
        if (t.keyFilter && context.originalEvent instanceof KeyboardEvent) {
          const keys = Array.isArray(t.keyFilter) ? t.keyFilter : [t.keyFilter];
          if (!keys.includes(context.originalEvent.key)) {
            return false;
          }
        }
      }

      return true;
    });
  }

  private getMatchingTrigger(
    rule: GpBusinessRule,
    eventType: GpRuleEventType
  ): GpRuleTrigger | GpRuleEventType | undefined {
    const triggers = Array.isArray(rule.trigger) ? rule.trigger : [rule.trigger];
    return triggers.find((t) => (typeof t === 'string' ? t : t.event) === eventType);
  }

  private queueDebouncedRule(rule: GpBusinessRule, eventType: string, delayMs: number, context: GpRuleContext): void {
    const key = `${rule.id}_${eventType}`;
    let debouncer = this.debouncers.get(key);

    if (!debouncer) {
      const subject = new Subject<{ context: GpRuleContext; rule: GpBusinessRule }>();
      const sub = subject.pipe(debounceTime(delayMs)).subscribe(({ context: ctx, rule: r }) => {
        this.executeRule(r, eventType, ctx);
      });
      debouncer = { subject, sub };
      this.debouncers.set(key, debouncer);
    }

    debouncer.subject.next({ context, rule });
  }
}
