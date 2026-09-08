import { Injectable, signal } from '@angular/core';
import { GpWidgetLibraryItem, GpReportLibraryItem } from '../interfaces/widget-library.interface';
import { UniqueId } from '../utils/unique-id';

@Injectable({
  providedIn: 'root'
})
export class GpWidgetLibraryService {
  /**
   * Internal reactive signal of widget templates available in the library.
   */
  readonly widgetLibrary = signal<GpWidgetLibraryItem[]>(this.createSeedWidgetLibrary());

  /**
   * Internal reactive signal of report templates available in the library.
   */
  readonly reportLibrary = signal<GpReportLibraryItem[]>(this.createSeedReportLibrary());

  /**
   * Adds a new widget template to the library.
   */
  addWidget(item: Omit<GpWidgetLibraryItem, 'id' | 'createdAt'>): GpWidgetLibraryItem {
    const fullItem: GpWidgetLibraryItem = {
      ...item,
      id: UniqueId.generate('lib-w-'),
      createdAt: new Date().toISOString()
    };
    this.widgetLibrary.update((items) => [fullItem, ...items]);
    return fullItem;
  }

  /**
   * Removes a widget template by ID.
   */
  removeWidget(id: string): void {
    this.widgetLibrary.update((items) => items.filter((w) => w.id !== id));
  }

  /**
   * Adds a new report template to the library.
   */
  addReport(item: Omit<GpReportLibraryItem, 'id' | 'createdAt'>): GpReportLibraryItem {
    const fullItem: GpReportLibraryItem = {
      ...item,
      id: UniqueId.generate('lib-r-'),
      createdAt: new Date().toISOString()
    };
    this.reportLibrary.update((items) => [fullItem, ...items]);
    return fullItem;
  }

  /**
   * Removes a report template by ID.
   */
  removeReport(id: string): void {
    this.reportLibrary.update((items) => items.filter((r) => r.id !== id));
  }

  /**
   * Default seeded widget templates crafted by dashboard designers.
   */
  private createSeedWidgetLibrary(): GpWidgetLibraryItem[] {
    return [
      {
        id: 'lib-kpi-revenue',
        name: 'Executive Revenue Scorecard',
        description: 'Sum of total revenue with sparkline and target benchmarking',
        category: 'kpi',
        icon: '💰',
        tags: ['Finance', 'KPI', 'Executive'],
        createdBy: 'Dashboard Designer',
        createdAt: '2026-03-01T00:00:00Z',
        widgetConfig: {
          type: 'kpi',
          title: 'Total Revenue',
          icon: '💰',
          grid: { x: 0, y: 0, w: 3, h: 2, minW: 3, minH: 2 },
          measure: { fieldId: 'total', aggregation: 'sum' },
          targetValue: 100000,
          formatCurrency: true,
          comparePrevious: true,
          severity: 'success'
        }
      },
      {
        id: 'lib-kpi-orders',
        name: 'Order Volume Counter',
        description: 'Count of transactional orders processed with alert threshold',
        category: 'kpi',
        icon: '📦',
        tags: ['Operations', 'Orders', 'Volume'],
        createdBy: 'Dashboard Designer',
        createdAt: '2026-03-01T00:00:00Z',
        widgetConfig: {
          type: 'kpi',
          title: 'Orders Processed',
          icon: '📦',
          grid: { x: 3, y: 0, w: 3, h: 2, minW: 3, minH: 2 },
          measure: { fieldId: 'total', aggregation: 'count' },
          targetValue: 50,
          formatCurrency: false,
          comparePrevious: true,
          severity: 'info'
        }
      },
      {
        id: 'lib-kpi-units',
        name: 'Units Shipped Metric',
        description: 'Total unit quantity sold across all accounts',
        category: 'kpi',
        icon: '📈',
        tags: ['Logistics', 'Inventory'],
        createdBy: 'Dashboard Designer',
        createdAt: '2026-03-01T00:00:00Z',
        widgetConfig: {
          type: 'kpi',
          title: 'Total Units',
          icon: '📈',
          grid: { x: 6, y: 0, w: 3, h: 2, minW: 3, minH: 2 },
          measure: { fieldId: 'quantity', aggregation: 'sum' },
          targetValue: 250,
          formatCurrency: false,
          comparePrevious: true,
          severity: 'warning'
        }
      },
      {
        id: 'lib-chart-bar-customer',
        name: 'Top Customers by Revenue',
        description: 'Horizontal or vertical bar distribution ranked high to low',
        category: 'chart',
        icon: '📊',
        tags: ['Sales', 'Customers', 'Ranking'],
        createdBy: 'Dashboard Designer',
        createdAt: '2026-03-01T00:00:00Z',
        widgetConfig: {
          type: 'chart',
          title: 'Revenue by Customer',
          subtitle: 'Top contributing accounts',
          chartType: 'bar',
          grid: { x: 0, y: 2, w: 6, h: 4, minW: 4, minH: 3 },
          dimension: 'customer_name',
          measure: { fieldId: 'total', aggregation: 'sum', alias: 'revenue' },
          sortOrder: 'desc',
          limit: 6
        }
      },
      {
        id: 'lib-chart-donut-status',
        name: 'Status Share Donut',
        description: 'Proportional order breakdown across fulfillment statuses',
        category: 'chart',
        icon: '🍩',
        tags: ['Status', 'Fulfillment', 'Proportions'],
        createdBy: 'Dashboard Designer',
        createdAt: '2026-03-01T00:00:00Z',
        widgetConfig: {
          type: 'chart',
          title: 'Status Distribution',
          subtitle: 'Order progress share',
          chartType: 'donut',
          grid: { x: 6, y: 2, w: 6, h: 4, minW: 3, minH: 3 },
          dimension: 'status',
          measure: { fieldId: 'total', aggregation: 'count', alias: 'count' },
          sortOrder: 'desc'
        }
      },
      {
        id: 'lib-chart-line-region',
        name: 'Regional Units Trend',
        description: 'Comparative units across geographic regions',
        category: 'chart',
        icon: '📉',
        tags: ['Regional', 'Geography'],
        createdBy: 'Dashboard Designer',
        createdAt: '2026-03-01T00:00:00Z',
        widgetConfig: {
          type: 'chart',
          title: 'Units by Region',
          subtitle: 'Geographic quantity distribution',
          chartType: 'bar',
          grid: { x: 0, y: 6, w: 6, h: 4, minW: 4, minH: 3 },
          dimension: 'region',
          measure: { fieldId: 'quantity', aggregation: 'sum', alias: 'units' },
          sortOrder: 'desc'
        }
      }
    ];
  }

  /**
   * Default seeded report templates crafted by dashboard designers.
   */
  private createSeedReportLibrary(): GpReportLibraryItem[] {
    return [
      {
        id: 'lib-rpt-sales-rollup',
        name: 'Sales & Region Operational Rollup',
        description: 'Multi-dimensional subtotal rollup by Customer, Region, and Status',
        category: 'Sales',
        tags: ['Tabular', 'Subtotals', 'Sales'],
        createdBy: 'Dashboard Designer',
        createdAt: '2026-03-01T00:00:00Z',
        reportConfig: {
          id: 'rpt-sales-rollup',
          name: 'Sales & Region Operational Rollup',
          type: 'tabular',
          config: {
            title: 'Sales & Region Operational Rollup',
            dimensions: ['customer_name', 'region', 'status'],
            measures: [
              { fieldId: 'total', aggregation: 'sum', alias: 'total_revenue' },
              { fieldId: 'quantity', aggregation: 'sum', alias: 'units_sold' },
              { fieldId: 'total', aggregation: 'count', alias: 'order_count' }
            ],
            showSubtotals: true,
            showGrandTotal: true
          }
        }
      },
      {
        id: 'lib-rpt-customer-matrix',
        name: 'Customer Status Pivot Grid',
        description: '2D matrix cross-tabulation of customers against fulfillment status',
        category: 'Operations',
        tags: ['Pivot', 'Matrix'],
        createdBy: 'Dashboard Designer',
        createdAt: '2026-03-01T00:00:00Z',
        reportConfig: {
          id: 'rpt-customer-pivot',
          name: 'Customer Status Pivot Grid',
          type: 'pivot',
          config: {
            title: 'Customer Status Pivot Grid',
            rowDimension: 'customer_name',
            colDimension: 'status',
            measure: { fieldId: 'total', aggregation: 'sum' }
          }
        }
      }
    ];
  }
}
