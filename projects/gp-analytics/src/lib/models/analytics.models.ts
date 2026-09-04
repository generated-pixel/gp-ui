export type AnalyticsTimeRange = '1h' | '24h' | '7d' | '30d' | '90d' | 'custom';

export type MetricTrend = 'up' | 'down' | 'neutral';

export interface AnalyticsMetric {
  id: string;
  name: string;
  label: string;
  value: number;
  previousValue?: number;
  format?: 'number' | 'currency' | 'percent' | 'duration' | 'bytes';
  unit?: string;
  changePercentage?: number;
  trend?: MetricTrend;
  sparkline?: number[];
  category?: string;
  updatedAt: Date;
}

export interface AnalyticsEvent<T = Record<string, unknown>> {
  id: string;
  name: string;
  category: string;
  properties: T;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
  severity?: 'info' | 'warning' | 'error' | 'critical';
}

export interface AnalyticsAlert {
  id: string;
  ruleId: string;
  metricId: string;
  message: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  timestamp: Date;
  triggerValue: number;
  threshold: number;
  acknowledged: boolean;
}

export interface AnalyticsQuery {
  timeRange: AnalyticsTimeRange;
  metrics?: string[];
  categories?: string[];
  filter?: Record<string, unknown>;
  groupBy?: string;
  limit?: number;
}

export interface AnalyticsWidgetConfig {
  id: string;
  title: string;
  type: 'kpi' | 'chart' | 'table' | 'feed' | 'gauge';
  metricIds: string[];
  refreshIntervalMs?: number;
  gridSpan?: {
    cols: number;
    rows: number;
  };
}

export interface GpAnalyticsConfig {
  appName: string;
  endpoint?: string;
  enabled?: boolean;
  debug?: boolean;
  sampleRate?: number;
  bufferSize?: number;
  flushIntervalMs?: number;
  defaultTimeRange?: AnalyticsTimeRange;
  theme?: {
    primaryColor?: string;
    darkTheme?: boolean;
  };
}
