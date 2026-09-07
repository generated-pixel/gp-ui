import { GpDashboardWidgetBase } from './gp-dashboard-widget-base.interface';

export interface GpCustomWidgetConfig extends GpDashboardWidgetBase {
  type: 'custom';
  content?: string;
}
