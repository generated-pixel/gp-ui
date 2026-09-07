/**
 * Runtime state representing the lifecycle and data of an individual dashboard widget.
 */
export interface GpWidgetDataState<T = any> {
  /**
   * Widget identifier matching GpDashboardWidgetConfig.id.
   */
  widgetId: string;

  /**
   * Whether data is currently loading asynchronously.
   */
  loading: boolean;

  /**
   * Resolved data payload (records, KPI metric, chart series, or pivot matrix).
   */
  data: T | null;

  /**
   * Error message if data fetching or calculation failed.
   */
  error: string | null;

  /**
   * Epoch timestamp (ms) when data was last fetched or refreshed.
   */
  lastUpdated: number | null;

  /**
   * Whether the resolved data was served from the query cache.
   */
  fromCache?: boolean;
}
