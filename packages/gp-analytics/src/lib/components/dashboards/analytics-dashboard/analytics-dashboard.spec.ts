import { describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { GpAnalyticsDashboard } from './analytics-dashboard';
import { GpDataEngineService } from '../../../services/data-engine.service';
import { GpTranslationService } from '../../../services/translation.service';
import { GpDashboardDataLoaderService } from '../../../services/dashboard-data-loader.service';
import { GpDatasetDataLoaderService } from '../../../services/dataset-data-loader.service';
import { GpQueryCacheService } from '../../../services/query-cache.service';
import { GpDashboardConfig } from '../../../interfaces/gp-dashboard-config.interface';

describe('GpAnalyticsDashboard', () => {
  const mockData = [
    { customer_name: 'Northwind', status: 'Completed', total: 5000 },
    { customer_name: 'Acme', status: 'Completed', total: 8000 },
    { customer_name: 'Acme', status: 'Pending', total: 2000 }
  ];

  function createComponent() {
    TestBed.configureTestingModule({
      imports: [GpAnalyticsDashboard],
      providers: [
        GpDataEngineService,
        GpTranslationService,
        GpDashboardDataLoaderService,
        GpDatasetDataLoaderService,
        GpQueryCacheService
      ]
    });
    const fixture = TestBed.createComponent(GpAnalyticsDashboard);
    const component = fixture.componentInstance;
    return { fixture, component };
  }

  it('computes executive KPIs and breakdown chart from records', () => {
    const { fixture, component } = createComponent();
    fixture.componentRef.setInput('records', mockData);
    fixture.detectChanges();

    const rev = component.kpiRevenue();
    expect(rev.currentValue).toBe(15000);
    expect(rev.title).toBe('Total Revenue');

    const orders = component.kpiOrders();
    expect(orders.currentValue).toBe(3);

    const chart = component.customerBreakdownChart();
    expect(chart.categories).toContain('Acme');
    expect(chart.categories).toContain('Northwind');
  });

  it('initializes gp-grid layout items immediately upon receiving config', () => {
    const { fixture, component } = createComponent();
    fixture.detectChanges();

    const items = component.gridItems();
    expect(items.length).toBeGreaterThanOrEqual(5);
    expect(items.find((i) => i.id === 'kpi-1')).toBeDefined();
    expect(items.find((i) => i.id === 'chart-bar')).toBeDefined();
    expect(items.find((i) => i.id === 'report-table')).toBeDefined();
  });

  it('loads widget data asynchronously and tracks loading states', async () => {
    const { fixture, component } = createComponent();
    fixture.componentRef.setInput('records', mockData);
    fixture.detectChanges();

    // Trigger individual reload
    await component.reloadWidget('kpi-1');

    const state = component.widgetStates().get('kpi-1');
    expect(state).toBeDefined();
    expect(state?.loading).toBe(false);
    expect(state?.data).toBeDefined();
    expect(state?.data.currentValue).toBe(15000);
  });

  it('reloads all widgets concurrently and updates lastRefreshedAt', async () => {
    const { fixture, component } = createComponent();
    fixture.componentRef.setInput('records', mockData);
    fixture.detectChanges();

    expect(component.lastRefreshedAt()).toBeNull();

    await component.reloadAll(true);

    expect(component.lastRefreshedAt()).not.toBeNull();
    expect(component.isRefreshingAll()).toBe(false);
  });

  it('loads widgets with decoupled custom and dataset data sources', async () => {
    const { fixture, component } = createComponent();
    const dataLoader = TestBed.inject(GpDashboardDataLoaderService);
    dataLoader.registerDataset('custom-orders', [{ customer_name: 'CustomCo', status: 'Completed', total: 42000 }]);

    const customConfig: GpDashboardConfig = {
      id: 'custom-dashboard',
      title: 'Decoupled Multi-Source Cockpit',
      columns: 12,
      widgets: [
        {
          id: 'widget-inherited',
          type: 'kpi',
          title: 'Inherited Metric',
          grid: { x: 0, y: 0, w: 4, h: 2 },
          measure: { fieldId: 'total', aggregation: 'sum' },
          dataSource: { type: 'inherited' }
        },
        {
          id: 'widget-custom-ds',
          type: 'kpi',
          title: 'External Dataset Metric',
          grid: { x: 4, y: 0, w: 4, h: 2 },
          measure: { fieldId: 'total', aggregation: 'sum' },
          dataSource: { type: 'dataset', datasetId: 'custom-orders' }
        }
      ]
    };

    fixture.componentRef.setInput('config', customConfig);
    fixture.componentRef.setInput('records', mockData);
    fixture.detectChanges();

    await component.reloadAll(true);

    const s1 = component.widgetStates().get('widget-inherited');
    const s2 = component.widgetStates().get('widget-custom-ds');

    expect(s1?.data.currentValue).toBe(15000);
    expect(s2?.data.currentValue).toBe(42000);
  });
});
