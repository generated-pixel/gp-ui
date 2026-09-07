import { GpDashboardWidgetBase } from './gp-dashboard-widget-base.interface';
import { GpMeasureQuery } from './gp-measure-query.interface';

export interface GpKpiWidgetConfig extends GpDashboardWidgetBase {
  type: 'kpi';
  measure: GpMeasureQuery;
  targetValue?: number;
  targetLabel?: string;
  formatCurrency?: boolean;
  unit?: string;
  comparePrevious?: boolean;
  severity?: 'success' | 'danger' | 'info' | 'warning';
}
