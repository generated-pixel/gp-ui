export * from '../types/gp-dashboard-widget-type.type';
export * from '../interfaces/gp-dashboard-grid-position.interface';
export * from '../interfaces/gp-dashboard-widget-base.interface';
export * from '../interfaces/gp-kpi-widget-config.interface';
export * from '../interfaces/gp-chart-widget-config.interface';
export * from '../interfaces/gp-table-widget-config.interface';
export * from '../interfaces/gp-pivot-widget-config.interface';
export * from '../interfaces/gp-custom-widget-config.interface';
export * from '../types/gp-dashboard-widget-config.type';
export * from '../interfaces/gp-dashboard-filter-field.interface';
export * from '../interfaces/gp-dashboard-quick-preset.interface';
export * from '../interfaces/gp-dashboard-config.interface';

import { GpDashboardConfig } from '../interfaces/gp-dashboard-config.interface';
import { GpDashboardWidgetConfig } from '../types/gp-dashboard-widget-config.type';
import { GpKpiWidgetConfig } from '../interfaces/gp-kpi-widget-config.interface';
import { GpChartWidgetConfig } from '../interfaces/gp-chart-widget-config.interface';
import { GpTableWidgetConfig } from '../interfaces/gp-table-widget-config.interface';
import { GpPivotWidgetConfig } from '../interfaces/gp-pivot-widget-config.interface';

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
      { fieldId: 'region', label: 'Sales Region' }
    ],
    quickPresets: [
      {
        label: 'Completed Orders',
        condition: { fieldId: 'status', operator: 'eq', value: 'Completed' }
      }
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
        severity: 'success'
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
        severity: 'info'
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
        severity: 'warning'
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
        limit: 8
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
        limit: 6
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
          { fieldId: 'total', aggregation: 'count', alias: 'order_count' }
        ],
        showSubtotals: true,
        showGrandTotal: true
      },
      {
        id: 'pivot-matrix',
        type: 'pivot',
        title: '2D Matrix: Customer by Status',
        subtitle: 'Cross-tabulated aggregation',
        grid: { x: 0, y: 11, w: 12, h: 5, minW: 6, minH: 4 },
        rowDimension: 'customer_name',
        colDimension: 'status',
        measure: { fieldId: 'total', aggregation: 'sum' }
      }
    ]
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
    widgets: []
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
      { fieldId: 'status', label: 'Status' }
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
        severity: 'info'
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
        severity: 'success'
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
        sortOrder: 'desc'
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
        sortOrder: 'desc'
      },
      {
        id: 'op-table',
        type: 'table',
        title: 'Region & Status Fulfillment Summary',
        grid: { x: 0, y: 6, w: 12, h: 5, minW: 6, minH: 4 },
        dimensions: ['region', 'status'],
        measures: [
          { fieldId: 'quantity', aggregation: 'sum', alias: 'units' },
          { fieldId: 'total', aggregation: 'sum', alias: 'revenue' }
        ],
        showSubtotals: true,
        showGrandTotal: true
      }
    ]
  };
}
