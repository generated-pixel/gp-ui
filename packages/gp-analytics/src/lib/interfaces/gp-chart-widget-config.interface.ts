import { GpDashboardWidgetBase } from './gp-dashboard-widget-base.interface';
import { GpMeasureQuery } from './gp-measure-query.interface';

export interface GpChartWidgetConfig extends GpDashboardWidgetBase {
  type: 'chart';
  chartType: 'bar' | 'donut' | 'line';
  dimension: string;
  measure: GpMeasureQuery;
  sortOrder?: 'asc' | 'desc';
  limit?: number;
}
