import { AnalyticsSeverity } from './analytics-event.model';

export type RuleCondition = 'gt' | 'lt' | 'eq' | 'neq' | 'gte' | 'lte';

export interface AlertRule {
  id: string;
  metricId: string;
  condition: RuleCondition;
  threshold: number;
  message: string;
  severity: AnalyticsSeverity;
  enabled?: boolean;
}
