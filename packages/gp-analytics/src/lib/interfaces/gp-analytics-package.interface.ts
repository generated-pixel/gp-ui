import { Dataset } from './dataset.interface';
import { GpDashboardConfig } from './gp-dashboard-config.interface';
import { GpReportConfig } from './gp-report-config.interface';
import { GpPackageMetadata } from './gp-package-metadata.interface';
import { GpPackageThemeConfig } from './gp-package-theme-config.interface';

export interface GpAnalyticsPackage {
  $schema?: string;
  format: 'gp-analytics-package';
  version: string;
  metadata: GpPackageMetadata;
  datasets: Dataset[];
  dashboards: GpDashboardConfig[];
  reports: GpReportConfig[];
  theme?: GpPackageThemeConfig;
  extensions?: Record<string, unknown>;
}
