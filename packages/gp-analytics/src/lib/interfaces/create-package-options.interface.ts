import { Dataset } from './dataset.interface';
import { GpDashboardConfig } from './gp-dashboard-config.interface';
import { GpReportConfig } from './gp-report-config.interface';
import { GpPackageThemeConfig } from './gp-package-theme-config.interface';

export interface CreatePackageOptions {
  name?: string;
  description?: string;
  datasets?: Dataset[];
  dashboards?: GpDashboardConfig[];
  reports?: GpReportConfig[];
  exportedBy?: string;
  organization?: string;
  environment?: 'development' | 'staging' | 'production' | string;
  tags?: string[];
  theme?: GpPackageThemeConfig;
  extensions?: Record<string, unknown>;
}
