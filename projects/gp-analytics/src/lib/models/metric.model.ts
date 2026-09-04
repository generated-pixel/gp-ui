export type MetricTrend = 'up' | 'down' | 'neutral';

export interface AnalyticsMetric {
  id: string;
  name: string;
  label: string;
  value: number;
  previousValue?: number;
  unit?: string;
  trend?: MetricTrend;
  changePercentage?: number;
  sparkline?: number[];
  updatedAt: Date;
  metadata?: Record<string, unknown>;
}
