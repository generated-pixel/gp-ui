import { GpDashboardWidgetType } from '../types/gp-dashboard-widget-type.type';
import { GpDashboardGridPosition } from './gp-dashboard-grid-position.interface';

export interface GpDashboardWidgetBase {
  id: string;
  type: GpDashboardWidgetType;
  title: string;
  subtitle?: string;
  icon?: string;
  badge?: string;
  badgeSeverity?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  grid: GpDashboardGridPosition;
}
