/**
 * @file rule.types.ts
 * Main Business Rule interface definitions.
 */

import { GpRuleTrigger, GpTriggerDefinition } from './trigger.types';
import { GpRuleCondition } from './condition.types';
import { GpRuleAction } from './action.types';

export interface GpBusinessRule {
  /** Unique identifier for this rule */
  id: string;

  /** Human-readable title or name */
  name?: string;

  /** Description of what this business rule enforces */
  description?: string;

  /** Execution priority (higher executes first, default 0) */
  priority?: number;

  /** Whether the rule is active (default true) */
  enabled?: boolean;

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
}
