import { Guid } from '../types/guid';
import { Widget } from './widget';

export interface DashboardWidget extends Widget {
  dashboardWidgetId: Guid;

  defaultX?: number;
  defaultY?: number;
  defaultW?: number;
  defaultH?: number;

  minW?: number;
  minH?: number;

  maxW?: number;
  maxH?: number;

  locked?: boolean;
  canResize?: boolean;
  canDrag?: boolean;
}
