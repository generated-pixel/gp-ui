/**
 * @file rule.types.ts
 * Main Business Rule interface definitions.
 */

import { GpRuleTrigger, GpTriggerDefinition } from './trigger.types';
import { GpRuleCondition } from './condition.types';
import { GpRuleAction } from './action.types';
import { GpRuleExecutionLog } from './context.types';

export interface GpBusinessRule {
  /** Unique identifier for this rule */
  id: string;

  /** Human-readable title or name */
  name?: string;

  /** Description of what this business rule enforces */
  description?: string;

  /** Category or domain grouping (e.g. 'pricing', 'validation', 'ui', 'workflow') */
  category?: string;

  /** Version string for rule versioning */
  version?: string;

  /** Execution priority (higher executes first, default 0) */
  priority?: number;

  /** Whether the rule is active (default true) */
  enabled?: boolean;

  /** Rule IDs that must execute prior to this rule */
  dependsOn?: string[];

  /**
   * Events that trigger evaluation of this rule.
   * Can be a single event name (e.g. 'keypress', 'blur', 'change', 'click'),
   * a trigger configuration object with debounce, or an array of triggers.
   */
  trigger: GpTriggerDefinition | GpTriggerDefinition[];

  /**
   * Conditions to evaluate when the trigger fires.
   * If omitted, actions always execute upon trigger.
   */
  condition?: GpRuleCondition;

  /** Actions to execute when conditions are met */
  actions: GpRuleAction | GpRuleAction[];

  /** Optional actions to execute when conditions are NOT met (else branch) */
  elseActions?: GpRuleAction | GpRuleAction[];

  /** If true, stops evaluation of subsequent rules in the chain upon match */
  stopOnMatch?: boolean;

  /** Tags / category grouping */
  tags?: string[];

  /** Arbitrary metadata */
  metadata?: Record<string, any>;
}

export interface GpRuleValidationError {
  ruleId: string;
  field?: string;
  message: string;
  severity: 'error' | 'warning';
  code: string;
}

export interface GpRuleValidationResult {
  valid: boolean;
  errors: GpRuleValidationError[];
  warnings: GpRuleValidationError[];
  cyclicDependencies?: string[][];
}

export interface GpRuleSimulationOptions {
  rules: GpBusinessRule[];
  initialState: Record<string, any>;
  triggerEvent?: string;
  triggerValue?: any;
  targetField?: string;
  globals?: Record<string, any>;
}

export interface GpRuleSimulationResult {
  initialState: Record<string, any>;
  finalState: Record<string, any>;
  stateDiff: {
    changed: Record<string, { before: any; after: any }>;
    added: Record<string, any>;
    removed: Record<string, any>;
  };
  matchedRules: string[];
  executedActions: string[];
  logs: GpRuleExecutionLog[];
  durationMs: number;
}
