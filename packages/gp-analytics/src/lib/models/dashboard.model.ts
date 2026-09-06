import { GpFilterCondition, GpMeasureQuery } from './query.model';

export type GpDashboardWidgetType = 'kpi' | 'chart' | 'table' | 'pivot' | 'custom';

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

export interface GpChartWidgetConfig extends GpDashboardWidgetBase {
  type: 'chart';
  chartType: 'bar' | 'donut' | 'line';
  dimension: string;
  measure: GpMeasureQuery;
  sortOrder?: 'asc' | 'desc';
  limit?: number;
}

export interface GpTableWidgetConfig extends GpDashboardWidgetBase {
  type: 'table';
  dimensions: string[];
  measures: GpMeasureQuery[];
  showSubtotals?: boolean;
  showGrandTotal?: boolean;
}

export interface GpPivotWidgetConfig extends GpDashboardWidgetBase {
  type: 'pivot';
  rowDimension: string;
  colDimension: string;
  measure: GpMeasureQuery;
}

export interface GpCustomWidgetConfig extends GpDashboardWidgetBase {
  type: 'custom';
  content?: string;
}

export type GpDashboardWidgetConfig =
  | GpKpiWidgetConfig
  | GpChartWidgetConfig
  | GpTableWidgetConfig
  | GpPivotWidgetConfig
  | GpCustomWidgetConfig;

export interface GpDashboardFilterField {
  fieldId: string;
  label: string;
}

export interface GpDashboardQuickPreset {
  label: string;
  condition: GpFilterCondition;
}

export interface GpDashboardConfig {
  id: string;
  title: string;
  subtitle?: string;
  columns?: number;
  rowHeight?: number;
  gap?: number;
  compactType?: 'vertical' | 'none';
  allowMove?: boolean;
  allowResize?: boolean;
  filters?: GpFilterCondition[];
  filterFields?: GpDashboardFilterField[];
  quickPresets?: GpDashboardQuickPreset[];
  widgets: GpDashboardWidgetConfig[];
}

/**
 * Creates the default executive dashboard configuration.
 */
export function createDefaultDashboardConfig(): GpDashboardConfig {
  return {
    id: 'executive-cockpit',
    title: 'Executive Analytics Cockpit',
    subtitle: 'Live analytical dashboard powered by gp-grid, gp-ui, and gp-analytics',
    columns: 12,
    rowHeight: 95,
    gap: 16,
    compactType: 'vertical',
    allowMove: true,
    allowResize: true,
    filterFields: [
      { fieldId: 'customer_name', label: 'Customer Name' },
      { fieldId: 'status', label: 'Order Status' },
      { fieldId: 'region', label: 'Sales Region' },
    ],
    quickPresets: [
      {
        label: 'Completed Orders',
        condition: { fieldId: 'status', operator: 'eq', value: 'Completed' },
      },
    ],
    widgets: [
      {
        id: 'kpi-1',
        type: 'kpi',
        title: 'Total Revenue',
        icon: '💰',
        grid: { x: 0, y: 0, w: 4, h: 2, minW: 3, minH: 2 },
        measure: { fieldId: 'total', aggregation: 'sum' },
        targetValue: 80000,
        formatCurrency: true,
        comparePrevious: true,
        severity: 'success',
      },
      {
        id: 'kpi-2',
        type: 'kpi',
        title: 'Total Orders',
        icon: '📦',
        grid: { x: 4, y: 0, w: 4, h: 2, minW: 3, minH: 2 },
        measure: { fieldId: 'total', aggregation: 'count' },
        targetValue: 100,
        formatCurrency: false,
        comparePrevious: true,
        severity: 'info',
      },
      {
        id: 'kpi-3',
        type: 'kpi',
        title: 'Avg Order Value',
        icon: '💳',
        grid: { x: 8, y: 0, w: 4, h: 2, minW: 3, minH: 2 },
        measure: { fieldId: 'total', aggregation: 'avg' },
        formatCurrency: true,
        comparePrevious: true,
        severity: 'warning',
      },
      {
        id: 'chart-bar',
        type: 'chart',
        title: 'Revenue by Customer',
        subtitle: 'Top contributing customer accounts',
        chartType: 'bar',
        grid: { x: 0, y: 2, w: 7, h: 4, minW: 4, minH: 3 },
        dimension: 'customer_name',
        measure: { fieldId: 'total', aggregation: 'sum', alias: 'revenue' },
        sortOrder: 'desc',
        limit: 8,
      },
      {
        id: 'chart-donut',
        type: 'chart',
        title: 'Account Share Distribution',
        subtitle: 'Relative contribution percentage',
        chartType: 'donut',
        grid: { x: 7, y: 2, w: 5, h: 4, minW: 3, minH: 3 },
        dimension: 'customer_name',
        measure: { fieldId: 'total', aggregation: 'sum', alias: 'revenue' },
        sortOrder: 'desc',
        limit: 6,
      },
      {
        id: 'report-table',
        type: 'table',
        title: 'Enterprise Revenue Rollup',
        subtitle: 'Aggregated by Customer Account and Status',
        grid: { x: 0, y: 6, w: 12, h: 5, minW: 6, minH: 4 },
        dimensions: ['customer_name', 'status'],
        measures: [
          { fieldId: 'total', aggregation: 'sum', alias: 'total_revenue' },
          { fieldId: 'total', aggregation: 'count', alias: 'order_count' },
        ],
        showSubtotals: true,
        showGrandTotal: true,
      },
      {
        id: 'pivot-matrix',
        type: 'pivot',
        title: '2D Matrix: Customer by Status',
        subtitle: 'Cross-tabulated aggregation',
        grid: { x: 0, y: 11, w: 12, h: 5, minW: 6, minH: 4 },
        rowDimension: 'customer_name',
        colDimension: 'status',
        measure: { fieldId: 'total', aggregation: 'sum' },
      },
    ],
  };
}

/**
 * Creates an empty blank dashboard configuration.
 */
export function createBlankDashboardConfig(title = 'Custom Analytical Dashboard'): GpDashboardConfig {
  return {
    id: `dashboard-${Date.now()}`,
    title,
    subtitle: 'Configured with gp-analytics dashboard designer',
    columns: 12,
    rowHeight: 95,
    gap: 16,
    compactType: 'vertical',
    filterFields: [],
    widgets: [],
  };
}

/**
 * Creates an operational dashboard configuration template.
 */
export function createOperationsDashboardConfig(): GpDashboardConfig {
  return {
    id: 'operations-monitor',
    title: 'Operations & Fulfillment Pulse',
    subtitle: 'Real-time order statuses, delivery volume, and regional distribution',
    columns: 12,
    rowHeight: 95,
    gap: 16,
    compactType: 'vertical',
    filterFields: [
      { fieldId: 'region', label: 'Region' },
      { fieldId: 'status', label: 'Status' },
    ],
    widgets: [
      {
        id: 'op-kpi-1',
        type: 'kpi',
        title: 'Total Active Volume',
        icon: '📦',
        grid: { x: 0, y: 0, w: 6, h: 2, minW: 3, minH: 2 },
        measure: { fieldId: 'quantity', aggregation: 'sum' },
        targetValue: 500,
        formatCurrency: false,
        severity: 'info',
      },
      {
        id: 'op-kpi-2',
        type: 'kpi',
        title: 'Completed Orders',
        icon: '✅',
        grid: { x: 6, y: 0, w: 6, h: 2, minW: 3, minH: 2 },
        measure: { fieldId: 'total', aggregation: 'count' },
        targetValue: 50,
        formatCurrency: false,
        severity: 'success',
      },
      {
        id: 'op-chart-region',
        type: 'chart',
        title: 'Volume by Region',
        subtitle: 'Global logistics distribution',
        chartType: 'donut',
        grid: { x: 0, y: 2, w: 6, h: 4, minW: 4, minH: 3 },
        dimension: 'region',
        measure: { fieldId: 'quantity', aggregation: 'sum', alias: 'units' },
        sortOrder: 'desc',
      },
      {
        id: 'op-chart-status',
        type: 'chart',
        title: 'Order Status Distribution',
        subtitle: 'Fulfillment stages',
        chartType: 'bar',
        grid: { x: 6, y: 2, w: 6, h: 4, minW: 4, minH: 3 },
        dimension: 'status',
        measure: { fieldId: 'total', aggregation: 'count', alias: 'orders' },
        sortOrder: 'desc',
      },
      {
        id: 'op-table',
        type: 'table',
        title: 'Region & Status Fulfillment Summary',
        grid: { x: 0, y: 6, w: 12, h: 5, minW: 6, minH: 4 },
        dimensions: ['region', 'status'],
        measures: [
          { fieldId: 'quantity', aggregation: 'sum', alias: 'units' },
          { fieldId: 'total', aggregation: 'sum', alias: 'revenue' },
        ],
        showSubtotals: true,
        showGrandTotal: true,
      },
    ],
  };
}
