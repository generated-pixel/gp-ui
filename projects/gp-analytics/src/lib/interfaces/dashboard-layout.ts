import { DesignedItem } from './designed-item';

export interface DashboardWidgetLayout {
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
  locked?: boolean;
}

export interface DashboardWidget {
  id: string;
  item?: DesignedItem;
  title?: string;
  highlighted?: boolean;
  locked?: boolean;
  layout: DashboardWidgetLayout;
}

export interface DashboardGridOptions {
  columns: number;
  cellWidth: number;
  cellHeight: number;
  gap: number;
}
