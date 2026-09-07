export * from '../types/gp-report-type.type';
export * from '../interfaces/gp-tabular-report-config.interface';
export * from '../interfaces/gp-pivot-report-config.interface';
export * from '../interfaces/gp-chart-report-config.interface';
export * from '../interfaces/gp-report-config.interface';

import { GpReportType } from '../types/gp-report-type.type';
import { GpTabularReportConfig } from '../interfaces/gp-tabular-report-config.interface';
import { GpPivotReportConfig } from '../interfaces/gp-pivot-report-config.interface';
import { GpChartReportConfig } from '../interfaces/gp-chart-report-config.interface';
import { GpReportConfig } from '../interfaces/gp-report-config.interface';
import { UniqueId } from '../utils/unique-id';

export function createReportConfig(
  type: GpReportType,
  name: string,
  config: GpTabularReportConfig | GpPivotReportConfig | GpChartReportConfig,
  datasetId?: string
): GpReportConfig {
  const timestamp = new Date().toISOString();
  return {
    id: UniqueId.generate('rpt_'),
    name,
    type,
    datasetId,
    config,
    createdAt: timestamp,
    updatedAt: timestamp
  };
}
