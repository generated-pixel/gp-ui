import { DatasetField } from './dataset-field.model';

export type GpFilterOperator =
  | 'eq'
  | 'neq'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'between'
  | 'in'
  | 'not_in'
  | 'contains'
  | 'startsWith'
  | 'endsWith'
  | 'isNull'
  | 'isNotNull';

export interface GpFilterCondition {
  fieldId: string;
  operator: GpFilterOperator;
  value: any;
  secondValue?: any; // For 'between'
}

export type GpAggregationType =
  'sum' | 'avg' | 'min' | 'max' | 'count' | 'count-distinct' | 'median' | 'stddev' | 'variance';

export interface GpMeasureQuery {
  fieldId: string;
  aggregation: GpAggregationType;
  alias?: string;
}

export interface GpSortSpec {
  fieldId: string;
  order: 'asc' | 'desc';
}

export type GpTimeGrain = 'day' | 'week' | 'month' | 'quarter' | 'year';

export interface GpCalculatedField {
  id: string;
  expression: string;
}

export interface GpAnalyticalQuerySpec {
  datasetId?: string;
  dimensions: string[]; // Field IDs used for grouping
  measures: GpMeasureQuery[];
  calculatedFields?: GpCalculatedField[];
  filters?: GpFilterCondition[];
  sorts?: GpSortSpec[];
  timeGrain?: GpTimeGrain;
  timeFieldId?: string;
  pagination?: {
    page: number;
    pageSize: number;
  };
  pivot?: {
    rowDimensions: string[];
    colDimensions: string[];
    valueMeasures: string[];
  };
  comparison?: {
    type: 'previous-period' | 'previous-year' | 'target';
    targetValue?: number;
  };
}

export interface GpAggregationResult {
  rows: Record<string, any>[];
  totalCount: number;
  subtotals?: Record<string, any>[];
  grandTotal?: Record<string, any>;
  querySpec: GpAnalyticalQuerySpec;
  executionTimeMs: number;
}

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
}

export interface GpPivotMatrix {
  rowHeaders: string[];
  colHeaders: string[];
  matrix: (number | string | null)[][];
  rowTotals: (number | null)[];
  colTotals: (number | null)[];
  grandTotal: number | null;
}

export interface GpChartSeries {
  name: string;
  data: number[];
  color?: string;
}

export interface GpCategoricalChartData {
  categories: string[];
  series: GpChartSeries[];
}

export interface GpTimeSeriesData {
  timestamps: string[];
  series: GpChartSeries[];
}
