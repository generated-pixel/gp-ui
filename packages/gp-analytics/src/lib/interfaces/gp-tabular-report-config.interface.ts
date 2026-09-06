import { GpMeasureQuery } from './gp-measure-query.interface';

export interface GpTabularReportConfig {
  title: string;
  subtitle?: string;
  dimensions: string[];
  measures: GpMeasureQuery[];
  showSubtotals?: boolean;
  showGrandTotal?: boolean;
}
