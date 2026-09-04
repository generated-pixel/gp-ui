export type AnalyticsSeverity = 'info' | 'warning' | 'error' | 'critical';

export type AnalyticsCategory =
  | 'ui'
  | 'performance'
  | 'system'
  | 'security'
  | 'business'
  | 'navigation'
  | 'query'
  | 'lifecycle'
  | 'conversion'
  | 'simulator';

export interface AnalyticsEvent<T = Record<string, unknown>> {
  id: string;
  name: string;
  category: AnalyticsCategory | string;
  properties?: T;
  timestamp: Date;
  severity?: AnalyticsSeverity;
  userId?: string;
  sessionId?: string;
  metadata?: Record<string, unknown>;
}
