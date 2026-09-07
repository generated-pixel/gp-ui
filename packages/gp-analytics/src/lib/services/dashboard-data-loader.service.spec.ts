import { describe, expect, it, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { GpDashboardDataLoaderService } from './dashboard-data-loader.service';
import { GpDataEngineService } from './data-engine.service';
import { GpDatasetDataLoaderService } from './dataset-data-loader.service';
import { GpQueryCacheService } from './query-cache.service';
import { GpKpiWidgetConfig } from '../interfaces/gp-kpi-widget-config.interface';
import { GpChartWidgetConfig } from '../interfaces/gp-chart-widget-config.interface';

describe('GpDashboardDataLoaderService', () => {
  let service: GpDashboardDataLoaderService;
  let cacheService: GpQueryCacheService;

  const mockRecords = [
    { customer: 'Acme', region: 'AMER', status: 'Completed', revenue: 5000 },
    { customer: 'Acme', region: 'EMEA', status: 'Completed', revenue: 3000 },
    { customer: 'Northwind', region: 'EMEA', status: 'Pending', revenue: 2000 }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GpDashboardDataLoaderService, GpDataEngineService, GpDatasetDataLoaderService, GpQueryCacheService]
    });
    service = TestBed.inject(GpDashboardDataLoaderService);
    cacheService = TestBed.inject(GpQueryCacheService);
    cacheService.clear();
  });

  it('registers, retrieves, and unregisters datasets', async () => {
    expect(service.hasDataset('sales-data')).toBe(false);

    service.registerDataset('sales-data', mockRecords);
    expect(service.hasDataset('sales-data')).toBe(true);

    const records = await service.getDataset('sales-data');
    expect(records.length).toBe(3);

    service.unregisterDataset('sales-data');
    expect(service.hasDataset('sales-data')).toBe(false);
  });

  it('loads widget data with inherited strategy and computes KPI metrics', async () => {
    const kpiWidget: GpKpiWidgetConfig = {
      id: 'kpi-test',
      type: 'kpi',
      title: 'Total Revenue',
      grid: { x: 0, y: 0, w: 4, h: 2 },
      measure: { fieldId: 'revenue', aggregation: 'sum' },
      dataSource: { type: 'inherited', cacheTtlMs: 0 }
    };

    const res = await service.loadWidgetData(kpiWidget, { inheritedRecords: mockRecords });
    expect(res.fromCache).toBe(false);
    expect(res.data.currentValue).toBe(10000);
  });

  it('loads widget data with dataset strategy from registered dataset', async () => {
    service.registerDataset('orders-ds', mockRecords);

    const chartWidget: GpChartWidgetConfig = {
      id: 'chart-test',
      type: 'chart',
      title: 'Revenue by Region',
      chartType: 'bar',
      dimension: 'region',
      measure: { fieldId: 'revenue', aggregation: 'sum' },
      grid: { x: 0, y: 0, w: 6, h: 4 },
      dataSource: { type: 'dataset', datasetId: 'orders-ds', cacheTtlMs: 0 }
    };

    const res = await service.loadWidgetData(chartWidget);
    expect(res.fromCache).toBe(false);
    expect(res.data.categories).toContain('AMER');
    expect(res.data.categories).toContain('EMEA');
    expect(res.data.series[0].data).toBeDefined();
  });

  it('executes custom asynchronous loader function', async () => {
    const customWidget: GpKpiWidgetConfig = {
      id: 'custom-kpi',
      type: 'kpi',
      title: 'Live Transactions',
      grid: { x: 0, y: 0, w: 3, h: 2 },
      measure: { fieldId: 'tx', aggregation: 'count' },
      dataSource: {
        type: 'custom',
        customLoader: async () => ({
          formattedCurrentValue: '1,420 TPS',
          trend: 'up',
          trendSeverity: 'success'
        }),
        cacheTtlMs: 0
      }
    };

    const res = await service.loadWidgetData(customWidget);
    expect(res.data.formattedCurrentValue).toBe('1,420 TPS');
  });

  it('returns inline data directly', async () => {
    const inlineWidget: GpKpiWidgetConfig = {
      id: 'inline-kpi',
      type: 'kpi',
      title: 'Active Users',
      grid: { x: 0, y: 0, w: 3, h: 2 },
      measure: { fieldId: 'users', aggregation: 'count' },
      dataSource: {
        type: 'inline',
        inlineData: {
          formattedCurrentValue: '850 Online',
          trend: 'neutral'
        },
        cacheTtlMs: 0
      }
    };

    const res = await service.loadWidgetData(inlineWidget);
    expect(res.data.formattedCurrentValue).toBe('850 Online');
  });

  it('serves subsequent loads from query cache and bypasses on forceRefresh', async () => {
    const kpiWidget: GpKpiWidgetConfig = {
      id: 'cached-kpi',
      type: 'kpi',
      title: 'Cached Revenue',
      grid: { x: 0, y: 0, w: 3, h: 2 },
      measure: { fieldId: 'revenue', aggregation: 'sum' },
      dataSource: { type: 'inherited', cacheTtlMs: 60000 }
    };

    // First load -> fresh fetch
    const res1 = await service.loadWidgetData(kpiWidget, { inheritedRecords: mockRecords });
    expect(res1.fromCache).toBe(false);

    // Second load -> served from cache
    const res2 = await service.loadWidgetData(kpiWidget, { inheritedRecords: mockRecords });
    expect(res2.fromCache).toBe(true);
    expect(res2.data.currentValue).toBe(10000);

    // Third load with forceRefresh: true -> bypasses cache
    const res3 = await service.loadWidgetData(kpiWidget, {
      inheritedRecords: mockRecords,
      forceRefresh: true
    });
    expect(res3.fromCache).toBe(false);
  });

  it('applies global dashboard filters to dataset records unless ignoreDashboardFilters is true', async () => {
    service.registerDataset('filtered-ds', mockRecords);

    const kpiWidget: GpKpiWidgetConfig = {
      id: 'filtered-kpi',
      type: 'kpi',
      title: 'Filtered Revenue',
      grid: { x: 0, y: 0, w: 3, h: 2 },
      measure: { fieldId: 'revenue', aggregation: 'sum' },
      dataSource: { type: 'dataset', datasetId: 'filtered-ds', cacheTtlMs: 0 }
    };

    const resFiltered = await service.loadWidgetData(kpiWidget, {
      dashboardFilters: [{ fieldId: 'region', operator: 'eq', value: 'AMER' }]
    });
    // Only Acme in AMER (5000)
    expect(resFiltered.data.currentValue).toBe(5000);

    const kpiWidgetIgnored: GpKpiWidgetConfig = {
      ...kpiWidget,
      id: 'unfiltered-kpi',
      dataSource: { type: 'dataset', datasetId: 'filtered-ds', ignoreDashboardFilters: true, cacheTtlMs: 0 }
    };

    const resUnfiltered = await service.loadWidgetData(kpiWidgetIgnored, {
      dashboardFilters: [{ fieldId: 'region', operator: 'eq', value: 'AMER' }]
    });
    // All regions (10000)
    expect(resUnfiltered.data.currentValue).toBe(10000);
  });
});
