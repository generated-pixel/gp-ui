import { inject, Injectable } from '@angular/core';
import { isObservable, firstValueFrom } from 'rxjs';
import { GpDataEngineService } from './data-engine.service';
import { GpDatasetDataLoaderService } from './dataset-data-loader.service';
import { GpQueryCacheService } from './query-cache.service';
import { GpDashboardWidgetConfig } from '../types/gp-dashboard-widget-config.type';
import { GpWidgetDataLoaderFn } from '../types/gp-widget-data-loader-fn.type';
import { GpWidgetLoadContext } from '../interfaces/gp-widget-load-context.interface';
import { GpWidgetDataSourceConfig } from '../interfaces/gp-widget-data-source-config.interface';
import { GpKpiWidgetConfig } from '../interfaces/gp-kpi-widget-config.interface';
import { GpChartWidgetConfig } from '../interfaces/gp-chart-widget-config.interface';
import { GpAnalyticalQuerySpec } from '../interfaces/gp-analytical-query-spec.interface';

/**
 * Service responsible for decoupled, asynchronous loading of dashboard widget data.
 * Supports multiple data source strategies (inherited, dataset, remote HTTP, custom loaders, inline),
 * query memoization via GpQueryCacheService, and dataset/loader registries.
 */
@Injectable({ providedIn: 'root' })
export class GpDashboardDataLoaderService {
  protected readonly engine = inject(GpDataEngineService);
  protected readonly datasetLoader = inject(GpDatasetDataLoaderService);
  protected readonly queryCache = inject(GpQueryCacheService);

  private readonly datasetRegistry = new Map<string, Record<string, any>[] | (() => Promise<Record<string, any>[]>)>();

  private readonly customLoaderRegistry = new Map<string, GpWidgetDataLoaderFn>();

  /**
   * Registers a named dataset in the service's registry.
   */
  registerDataset(datasetId: string, provider: Record<string, any>[] | (() => Promise<Record<string, any>[]>)): void {
    this.datasetRegistry.set(datasetId, provider);
  }

  /**
   * Unregisters a dataset from the registry.
   */
  unregisterDataset(datasetId: string): void {
    this.datasetRegistry.delete(datasetId);
  }

  /**
   * Checks if a dataset is registered.
   */
  hasDataset(datasetId: string): boolean {
    return this.datasetRegistry.has(datasetId);
  }

  /**
   * Retrieves dataset records from the registry.
   */
  async getDataset(datasetId: string): Promise<Record<string, any>[]> {
    const provider = this.datasetRegistry.get(datasetId);
    if (!provider) {
      throw new Error(`Dataset '${datasetId}' is not registered in GpDashboardDataLoaderService`);
    }

    if (typeof provider === 'function') {
      return await provider();
    }

    return provider;
  }

  /**
   * Registers a custom asynchronous loader function by identifier.
   */
  registerLoader(loaderId: string, loader: GpWidgetDataLoaderFn): void {
    this.customLoaderRegistry.set(loaderId, loader);
  }

  /**
   * Unregisters a custom loader from the registry.
   */
  unregisterLoader(loaderId: string): void {
    this.customLoaderRegistry.delete(loaderId);
  }

  /**
   * Checks if a custom loader is registered.
   */
  hasLoader(loaderId: string): boolean {
    return this.customLoaderRegistry.has(loaderId);
  }

  /**
   * Loads data for an individual widget using its configured data source.
   * Checks query cache first unless forceRefresh is set in context.
   */
  async loadWidgetData(
    widget: GpDashboardWidgetConfig,
    context?: GpWidgetLoadContext
  ): Promise<{ data: any; fromCache: boolean }> {
    const ds: GpWidgetDataSourceConfig = widget.dataSource ?? { type: 'inherited' };
    const ttl = ds.cacheTtlMs !== undefined ? ds.cacheTtlMs : 60000;
    const forceRefresh = context?.forceRefresh ?? false;

    const cacheKey = this.buildWidgetCacheKey(widget.id, ds, context);

    if (!forceRefresh && ttl > 0) {
      const cached = this.queryCache.get<any>(cacheKey);
      if (cached !== null) {
        return { data: cached, fromCache: true };
      }
    }

    const rawData = await this.fetchRawData(widget, ds, context);
    const resolvedData = await this.processWidgetData(widget, ds, rawData, context);

    if (ttl > 0) {
      this.queryCache.set(cacheKey, resolvedData, ttl);
    }

    return { data: resolvedData, fromCache: false };
  }

  /**
   * Fetches raw records or data payload according to the data source type.
   */
  private async fetchRawData(
    widget: GpDashboardWidgetConfig,
    ds: GpWidgetDataSourceConfig,
    context?: GpWidgetLoadContext
  ): Promise<any> {
    switch (ds.type) {
      case 'inherited':
        return context?.inheritedRecords ?? [];

      case 'dataset':
        if (!ds.datasetId) {
          throw new Error(`Widget '${widget.id}' specifies dataSource type 'dataset' but missing 'datasetId'`);
        }
        return await this.getDataset(ds.datasetId);

      case 'remote':
        if (!ds.url) {
          throw new Error(`Widget '${widget.id}' specifies dataSource type 'remote' but missing 'url'`);
        }
        return await this.datasetLoader.fetchFromUrl(ds.url, ds.headers, ds.dataPath);

      case 'custom': {
        const loader = ds.customLoader || (ds.customLoaderId ? this.customLoaderRegistry.get(ds.customLoaderId) : null);
        if (!loader) {
          throw new Error(
            `Widget '${widget.id}' specifies custom loader but neither customLoader nor customLoaderId was found`
          );
        }
        const result = loader(widget, context);
        if (isObservable(result)) {
          return await firstValueFrom(result);
        }
        return await Promise.resolve(result);
      }

      case 'inline':
        return ds.inlineData ?? null;

      default:
        return context?.inheritedRecords ?? [];
    }
  }

  /**
   * Processes raw records into widget-specific structures (KPI metric, chart data, tabular rows, pivot matrix).
   */
  private async processWidgetData(
    widget: GpDashboardWidgetConfig,
    ds: GpWidgetDataSourceConfig,
    rawData: any,
    context?: GpWidgetLoadContext
  ): Promise<any> {
    // If rawData is not an array of records (e.g. from custom loader or inline metric), return directly
    if (!Array.isArray(rawData)) {
      return rawData;
    }

    let records: Record<string, any>[] = rawData;

    // Apply dashboard filters unless ignored
    if (!ds.ignoreDashboardFilters && context?.dashboardFilters && context.dashboardFilters.length > 0) {
      records = this.engine.applyFilters(records, context.dashboardFilters);
    }

    // If a custom querySpec is explicitly configured on the data source, execute it
    if (ds.querySpec) {
      return this.engine.executeQuery(records, ds.querySpec);
    }

    // Otherwise compute appropriate data structure based on widget type
    return this.computeWidgetResultFromRecords(widget, records);
  }

  /**
   * Computes the widget-specific output from an array of records.
   */
  computeWidgetResultFromRecords(widget: GpDashboardWidgetConfig, records: Record<string, any>[]): any {
    switch (widget.type) {
      case 'kpi': {
        const kpi = widget as GpKpiWidgetConfig;
        const prev = kpi.comparePrevious ? records.slice(0, Math.max(1, Math.floor(records.length / 2))) : undefined;

        const res = this.engine.computeKpiMetric(records, kpi.measure, kpi.title, {
          previousRecords: prev,
          targetValue: kpi.targetValue,
          formatCurrency: kpi.formatCurrency ?? (kpi.unit === '$' || kpi.unit === 'currency')
        });

        if (kpi.severity) {
          res.trendSeverity = kpi.severity;
        }

        return res;
      }

      case 'chart': {
        const chart = widget as GpChartWidgetConfig;
        const measureKey = chart.measure.alias || `${chart.measure.fieldId}_${chart.measure.aggregation}`;

        const spec: GpAnalyticalQuerySpec = {
          dimensions: [chart.dimension],
          measures: [chart.measure],
          sorts: chart.sortOrder
            ? [{ fieldId: measureKey, order: chart.sortOrder }]
            : [{ fieldId: measureKey, order: 'desc' }]
        };

        const res = this.engine.executeQuery(records, spec);
        const limit = chart.limit ?? 10;
        const rows = res.rows.slice(0, limit);

        return {
          categories: rows.map((r) => String(r[chart.dimension] ?? 'Unknown')),
          series: [
            {
              name: chart.title,
              data: rows.map((r) => Number(r[measureKey] ?? 0))
            }
          ]
        };
      }

      case 'table':
      case 'pivot':
      case 'custom':
      default:
        return records;
    }
  }

  /**
   * Builds a deterministic cache key for a widget load request.
   */
  private buildWidgetCacheKey(widgetId: string, ds: GpWidgetDataSourceConfig, context?: GpWidgetLoadContext): string {
    const filterKey = ds.ignoreDashboardFilters ? 'nofilters' : JSON.stringify(context?.dashboardFilters ?? []);
    const sourceKey = `${ds.type}:${ds.datasetId || ds.url || ds.customLoaderId || 'default'}`;
    return `widget:${widgetId}:${sourceKey}:${filterKey}`;
  }
}
