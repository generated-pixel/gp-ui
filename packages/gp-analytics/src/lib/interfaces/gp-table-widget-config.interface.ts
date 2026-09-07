import { GpDashboardWidgetBase } from './gp-dashboard-widget-base.interface';
import { GpMeasureQuery } from './gp-measure-query.interface';

export interface GpTableWidgetConfig extends GpDashboardWidgetBase {
  type: 'table';
  dimensions: string[];
  measures: GpMeasureQuery[];
  showSubtotals?: boolean;
  showGrandTotal?: boolean;
}
