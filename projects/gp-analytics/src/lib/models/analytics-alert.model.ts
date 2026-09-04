import { AnalyticsSeverity } from './analytics-event.model';

export interface AnalyticsAlert {
  id: string;
  ruleId: string;
  metricId: string;
  triggerValue: number;
  threshold: number;
  message: string;
  severity: AnalyticsSeverity;
  timestamp: Date;
  acknowledged: boolean;
}
