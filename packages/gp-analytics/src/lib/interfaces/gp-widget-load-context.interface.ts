import { GpFilterCondition } from './gp-filter-condition.interface';

/**
 * Context provided to widget data loaders containing dashboard filters,
 * inherited dataset records, and execution flags.
 */
export interface GpWidgetLoadContext {
  /**
   * Active dashboard filters applied globally.
   */
  dashboardFilters?: GpFilterCondition[];

  /**
   * Shared records passed to the dashboard component.
   */
  inheritedRecords?: Record<string, any>[];

  /**
   * Whether to bypass query cache and force a fresh data fetch.
   */
  forceRefresh?: boolean;

  /**
   * Optional abort signal for network request cancellation.
   */
  signal?: AbortSignal;
}
