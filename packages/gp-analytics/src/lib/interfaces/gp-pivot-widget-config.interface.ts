import { GpDashboardWidgetBase } from './gp-dashboard-widget-base.interface';
import { GpMeasureQuery } from './gp-measure-query.interface';

export interface GpPivotWidgetConfig extends GpDashboardWidgetBase {
  type: 'pivot';
  rowDimension: string;
  colDimension: string;
  measure: GpMeasureQuery;
}
