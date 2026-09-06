import { GpMeasureQuery } from './gp-measure-query.interface';

export interface GpChartReportConfig {
  title: string;
  subtitle?: string;
  chartType: 'bar' | 'donut' | 'line';
  dimension: string;
  measure: GpMeasureQuery;
  sortOrder?: 'asc' | 'desc';
  limit?: number;
}
