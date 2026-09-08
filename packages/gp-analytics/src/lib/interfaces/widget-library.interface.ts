import { GpKpiWidgetConfig } from './gp-kpi-widget-config.interface';
import { GpChartWidgetConfig } from './gp-chart-widget-config.interface';
import { GpTableWidgetConfig } from './gp-table-widget-config.interface';
import { GpPivotWidgetConfig } from './gp-pivot-widget-config.interface';
import { GpCustomWidgetConfig } from './gp-custom-widget-config.interface';
import { GpReportConfig } from './gp-report-config.interface';

/**
 * Distributive template config for dashboard widgets in libraries.
 */
export type GpDashboardWidgetTemplateConfig =
  | (Omit<GpKpiWidgetConfig, 'id'> & { id?: string })
  | (Omit<GpChartWidgetConfig, 'id'> & { id?: string })
  | (Omit<GpTableWidgetConfig, 'id'> & { id?: string })
  | (Omit<GpPivotWidgetConfig, 'id'> & { id?: string })
  | (Omit<GpCustomWidgetConfig, 'id'> & { id?: string });

/**
 * An item in the reusable Widget Library created by Dashboard Designers or Admins.
 */
export interface GpWidgetLibraryItem {
  id: string;
  name: string;
  description?: string;
  category: 'kpi' | 'chart' | 'table' | 'pivot' | 'general';
  icon?: string;
  tags?: string[];
  widgetConfig: GpDashboardWidgetTemplateConfig;
  createdBy?: string;
  createdAt?: string;
}

/**
 * An item in the reusable Report Library.
 */
export interface GpReportLibraryItem {
  id: string;
  name: string;
  description?: string;
  category: string;
  tags?: string[];
  reportConfig: GpReportConfig;
  createdBy?: string;
  createdAt?: string;
}
