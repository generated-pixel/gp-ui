import { GpAnalyticalQuerySpec } from './gp-analytical-query-spec.interface';

export interface GpAggregationResult {
  rows: Record<string, any>[];
  totalCount: number;
  subtotals?: Record<string, any>[];
  grandTotal?: Record<string, any>;
  querySpec: GpAnalyticalQuerySpec;
  executionTimeMs: number;
  groupedBy?: Record<string, any>;
  measures?: Record<string, number>;
  recordCount?: number;
}
