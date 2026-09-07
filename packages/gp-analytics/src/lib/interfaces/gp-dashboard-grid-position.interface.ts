export interface GpDashboardGridPosition {
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
  fixed?: boolean;
  locked?: boolean;
  draggable?: boolean;
  resizable?: boolean;
}
