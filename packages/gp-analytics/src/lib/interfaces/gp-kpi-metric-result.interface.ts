export interface GpKpiMetricResult {
  metricId: string;
  title: string;
  currentValue: number;
  formattedCurrentValue: string;
  previousValue?: number;
  varianceAbsolute?: number;
  variancePercentage?: number;
  trend: 'up' | 'down' | 'neutral';
  trendSeverity: 'success' | 'danger' | 'info' | 'warning';
  targetValue?: number;
  targetProgressPercentage?: number;
  sparklinePoints: number[];
  formattedValue?: string;
  targetProgress?: number;
}
