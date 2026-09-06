import { GpMeasureQuery } from './query.model';

export type GpReportType = 'tabular' | 'pivot' | 'chart';

export interface GpTabularReportConfig {
  title: string;
  subtitle?: string;
  dimensions: string[];
  measures: GpMeasureQuery[];
  showSubtotals?: boolean;
  showGrandTotal?: boolean;
}

export interface GpPivotReportConfig {
  title: string;
  subtitle?: string;
  rowDimension: string;
  colDimension: string;
  measure: GpMeasureQuery;
}

export interface GpChartReportConfig {
  title: string;
  subtitle?: string;
  chartType: 'bar' | 'donut' | 'line';
  dimension: string;
  measure: GpMeasureQuery;
  sortOrder?: 'asc' | 'desc';
  limit?: number;
}

export interface GpReportConfig {
  id: string;
  name: string;
  description?: string;
  type: GpReportType;
  datasetId?: string;
  config: GpTabularReportConfig | GpPivotReportConfig | GpChartReportConfig;
  createdAt?: string;
  updatedAt?: string;
}

export function createReportConfig(
  type: GpReportType,
  name: string,
  config: GpTabularReportConfig | GpPivotReportConfig | GpChartReportConfig,
  datasetId?: string
): GpReportConfig {
  const timestamp = new Date().toISOString();
  return {
    id: `rpt_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
    name,
    type,
    datasetId,
    config,
    createdAt: timestamp,
    updatedAt: timestamp
  };
}
