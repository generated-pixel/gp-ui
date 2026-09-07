import { GpMeasureQuery } from './gp-measure-query.interface';

export interface GpPivotReportConfig {
  title: string;
  subtitle?: string;
  rowDimension: string;
  colDimension: string;
  measure: GpMeasureQuery;
}
