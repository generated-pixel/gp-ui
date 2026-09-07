import { GpWidgetDataSourceType } from '../types/gp-widget-data-source-type.type';
import { GpWidgetDataLoaderFn } from '../types/gp-widget-data-loader-fn.type';
import { GpAnalyticalQuerySpec } from './gp-analytical-query-spec.interface';

/**
 * Detailed configuration for how an individual widget fetches and resolves its data.
 */
export interface GpWidgetDataSourceConfig {
  /**
   * Data source type strategy.
   * - 'inherited': Uses shared records passed to the dashboard component (default).
   * - 'dataset': Loads from a registered dataset definition via GpDashboardDataLoaderService.
   * - 'remote': Fetches JSON records asynchronously from an HTTP/REST endpoint URL.
   * - 'custom': Calls a registered or inline asynchronous custom loader function.
   * - 'inline': Directly provides static or pre-computed data rows.
   */
  type: GpWidgetDataSourceType;

  /**
   * Dataset identifier when type is 'dataset'.
   */
  datasetId?: string;

  /**
   * API endpoint URL when type is 'remote'.
   */
  url?: string;

  /**
   * HTTP Method for remote fetch. Defaults to 'GET'.
   */
  method?: 'GET' | 'POST';

  /**
   * HTTP Headers for remote fetch.
   */
  headers?: Record<string, string>;

  /**
   * Optional payload body for POST requests.
   */
  body?: any;

  /**
   * Dot-separated data path in JSON response (e.g., 'data.items' or 'result').
   */
  dataPath?: string;

  /**
   * Registered loader ID when type is 'custom'.
   */
  customLoaderId?: string;

  /**
   * Direct inline loader function when type is 'custom'.
   */
  customLoader?: GpWidgetDataLoaderFn;

  /**
   * Static or pre-loaded data records when type is 'inline'.
   */
  inlineData?: any;

  /**
   * Optional analytical query specification to execute against the fetched records.
   */
  querySpec?: GpAnalyticalQuerySpec;

  /**
   * Cache duration in milliseconds (TTL). Defaults to 60000 (60s). Set to 0 to disable caching.
   */
  cacheTtlMs?: number;

  /**
   * Real-time auto-polling interval in milliseconds. 0 or undefined disables auto-polling.
   */
  refreshIntervalMs?: number;

  /**
   * If true, widget ignores global dashboard filter changes and retains its own independent filter set.
   */
  ignoreDashboardFilters?: boolean;
}
