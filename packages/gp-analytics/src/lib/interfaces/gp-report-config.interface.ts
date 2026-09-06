import { GpReportType } from '../types/gp-report-type.type';
import { GpTabularReportConfig } from './gp-tabular-report-config.interface';
import { GpPivotReportConfig } from './gp-pivot-report-config.interface';
import { GpChartReportConfig } from './gp-chart-report-config.interface';

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
