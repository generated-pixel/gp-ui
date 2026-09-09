import { GpMeasureQuery } from './gp-measure-query.interface';

export interface GpListReportConfig {
  title: string;
  subtitle?: string;
  dimensions: string[];
  measures: GpMeasureQuery[];
}