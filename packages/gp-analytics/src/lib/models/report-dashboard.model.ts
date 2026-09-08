import { GpReportConfig } from '../interfaces/gp-report-config.interface';
import { GpDashboardWidgetConfig } from '../types/gp-dashboard-widget-config.type';
import { GpFilterCondition, GpMeasureQuery } from './query.model';
import { GpGlobalSortConfig, createDefaultGlobalSortConfig } from '../interfaces/global-sort-config.interface';
import { GpUserRole } from '../types/user-role.type';
import { GpKpiWidgetConfig } from '../interfaces/gp-kpi-widget-config.interface';
import { GpChartWidgetConfig } from '../interfaces/gp-chart-widget-config.interface';
import { UniqueId } from '../utils/unique-id';

/**
 * Configuration for a Report Dashboard anchored to 1 primary report,
 * with customizable derived graphs and KPIs.
 */
export interface GpReportDashboardConfig {
  id: string;
  title: string;
  subtitle?: string;

  /**
   * The single central report anchoring this dashboard.
   */
  reportConfig: GpReportConfig;

  /**
   * KPI cards and analytical charts derived off the anchored report.
   */
  derivedWidgets: GpDashboardWidgetConfig[];

  /**
   * Global filters that apply across the anchored report and derived widgets.
   */
  globalFilters?: GpFilterCondition[];

  /**
   * Global sorting configuration with allowed sort fields and active sort state.
   */
  globalSort?: GpGlobalSortConfig;

  /**
   * Grid column layout count (default 12).
   */
  columns?: number;

  /**
   * Grid row height in pixels (default 95).
   */
  rowHeight?: number;

  /**
   * Gap between grid widgets in pixels (default 16).
   */
  gap?: number;

  /**
   * Grid compaction algorithm ('vertical' or 'none').
   */
  compactType?: 'vertical' | 'none';

  /**
   * Whether grid items can be dragged by users with permission.
   */
  allowMove?: boolean;

  /**
   * Whether grid items can be resized by users with permission.
   */
  allowResize?: boolean;

  /**
   * Whether this dashboard is a personal custom dashboard saved by a manager/designer.
   */
  isCustom?: boolean;

  /**
   * Role of the user who authored this dashboard.
   */
  createdByRole?: GpUserRole;
}

/**
 * Creates a default enterprise Report Dashboard configuration.
 */
export function createDefaultReportDashboardConfig(): GpReportDashboardConfig {
  const reportConfig: GpReportConfig = {
    id: 'rpt-primary-sales',
    name: 'Sales & Revenue Analysis Report',
    description: 'Comprehensive operational sales rollup by Customer Account, Region, and Order Status',
    type: 'tabular',
    config: {
      title: 'Sales & Revenue Analysis Report',
      subtitle: 'Comprehensive operational sales rollup by Customer Account, Region, and Order Status',
      dimensions: ['customer_name', 'region', 'status'],
      measures: [
        { fieldId: 'total', aggregation: 'sum', alias: 'total_revenue' },
        { fieldId: 'quantity', aggregation: 'sum', alias: 'units_sold' },
        { fieldId: 'total', aggregation: 'avg', alias: 'avg_order_val' },
        { fieldId: 'total', aggregation: 'count', alias: 'order_count' }
      ],
      showSubtotals: true,
      showGrandTotal: true
    }
  };

  const derivedWidgets: GpDashboardWidgetConfig[] = [
    {
      id: 'kpi-rev',
      type: 'kpi',
      title: 'Total Revenue',
      icon: '💰',
      grid: { x: 0, y: 0, w: 3, h: 2, minW: 3, minH: 2 },
      measure: { fieldId: 'total', aggregation: 'sum' },
      targetValue: 80000,
      formatCurrency: true,
      comparePrevious: true,
      severity: 'success'
    },
    {
      id: 'kpi-orders',
      type: 'kpi',
      title: 'Total Orders',
      icon: '📦',
      grid: { x: 3, y: 0, w: 3, h: 2, minW: 3, minH: 2 },
      measure: { fieldId: 'total', aggregation: 'count' },
      targetValue: 50,
      formatCurrency: false,
      comparePrevious: true,
      severity: 'info'
    },
    {
      id: 'kpi-units',
      type: 'kpi',
      title: 'Units Sold',
      icon: '📈',
      grid: { x: 6, y: 0, w: 3, h: 2, minW: 3, minH: 2 },
      measure: { fieldId: 'quantity', aggregation: 'sum' },
      targetValue: 200,
      formatCurrency: false,
      comparePrevious: true,
      severity: 'warning'
    },
    {
      id: 'kpi-avg',
      type: 'kpi',
      title: 'Avg Order Value',
      icon: '💳',
      grid: { x: 9, y: 0, w: 3, h: 2, minW: 3, minH: 2 },
      measure: { fieldId: 'total', aggregation: 'avg' },
      formatCurrency: true,
      comparePrevious: true,
      severity: 'info'
    },
    {
      id: 'chart-rev-customer',
      type: 'chart',
      title: 'Revenue by Customer',
      subtitle: 'Derived breakdown from primary report',
      chartType: 'bar',
      grid: { x: 0, y: 2, w: 7, h: 4, minW: 4, minH: 3 },
      dimension: 'customer_name',
      measure: { fieldId: 'total', aggregation: 'sum', alias: 'revenue' },
      sortOrder: 'desc',
      limit: 8
    },
    {
      id: 'chart-status-dist',
      type: 'chart',
      title: 'Orders by Status',
      subtitle: 'Fulfillment distribution',
      chartType: 'donut',
      grid: { x: 7, y: 2, w: 5, h: 4, minW: 3, minH: 3 },
      dimension: 'status',
      measure: { fieldId: 'total', aggregation: 'count', alias: 'count' },
      sortOrder: 'desc'
    }
  ];

  const globalSort = createDefaultGlobalSortConfig(
    [
      { fieldId: 'total', label: 'Total Revenue', type: 'number' },
      { fieldId: 'quantity', label: 'Units Sold', type: 'number' },
      { fieldId: 'customer_name', label: 'Customer Name', type: 'string' },
      { fieldId: 'region', label: 'Region', type: 'string' },
      { fieldId: 'status', label: 'Order Status', type: 'string' }
    ],
    'total',
    'desc'
  );

  return {
    id: 'report-dashboard-sales',
    title: 'Sales Performance Report Dashboard',
    subtitle: '1-Report analytical cockpit with user-derived KPIs, graphs, and global controls',
    reportConfig,
    derivedWidgets,
    globalFilters: [],
    globalSort,
    columns: 12,
    rowHeight: 95,
    gap: 16,
    compactType: 'vertical',
    allowMove: true,
    allowResize: true,
    isCustom: false,
    createdByRole: 'dashboard-designer'
  };
}

/**
 * Helper to generate a new derived KPI widget config off report measures.
 */
export function createDerivedKpiConfig(params: {
  title: string;
  fieldId: string;
  aggregation: 'sum' | 'avg' | 'count' | 'min' | 'max';
  icon?: string;
  formatCurrency?: boolean;
  targetValue?: number;
  severity?: 'success' | 'info' | 'warning' | 'danger';
}): GpKpiWidgetConfig {
  return {
    id: UniqueId.generate('kpi-'),
    type: 'kpi',
    title: params.title,
    icon: params.icon || '📊',
    grid: { x: 0, y: 0, w: 3, h: 2, minW: 3, minH: 2 },
    measure: { fieldId: params.fieldId, aggregation: params.aggregation },
    formatCurrency: params.formatCurrency ?? false,
    targetValue: params.targetValue,
    severity: params.severity || 'info',
    comparePrevious: true
  };
}

/**
 * Helper to generate a new derived Chart widget config off report dimensions and measures.
 */
export function createDerivedChartConfig(params: {
  title: string;
  subtitle?: string;
  chartType: 'bar' | 'donut' | 'line';
  dimension: string;
  fieldId: string;
  aggregation: 'sum' | 'avg' | 'count' | 'min' | 'max';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
}): GpChartWidgetConfig {
  return {
    id: UniqueId.generate('chart-'),
    type: 'chart',
    title: params.title,
    subtitle: params.subtitle,
    chartType: params.chartType,
    grid: { x: 0, y: 0, w: 6, h: 4, minW: 3, minH: 3 },
    dimension: params.dimension,
    measure: {
      fieldId: params.fieldId,
      aggregation: params.aggregation,
      alias: `${params.fieldId}_${params.aggregation}`
    },
    sortOrder: params.sortOrder || 'desc',
    limit: params.limit
  };
}
