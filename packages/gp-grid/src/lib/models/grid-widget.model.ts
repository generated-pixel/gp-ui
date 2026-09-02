import { Signal } from '@angular/core';
import { Observable, Subscribable } from 'rxjs';
import { GpBadgeSeverity } from '@generatedpixel/gp-ui';

/**
 * Standard widget types supported natively by gp-grid.
 */
export type GpGridWidgetType =
  'custom' | 'kpi' | 'chart' | 'table' | 'list' | 'progress' | 'stats' | 'timeline' | 'feed' | 'empty';

/**
 * Function provider for resolving data asynchronously or synchronously.
 */
export type GpWidgetDataProvider<T = any> = () => Promise<T> | Observable<T> | T;

/**
 * Universal reactive data source for widgets.
 * Supports:
 * 1. Direct raw object/array (T)
 * 2. Angular Signal (Signal<T>)
 * 3. RxJS Observable / Subject / BehaviorSubject (Observable<T>)
 * 4. Native JavaScript Promise (Promise<T>)
 * 5. Async / Sync Fetcher Function (() => Promise<T> | Observable<T> | T)
 */
export type GpWidgetDataSource<T = any> =
  T | Signal<T> | Observable<T> | Subscribable<T> | Promise<T> | GpWidgetDataProvider<T>;

/**
 * Navigation configuration for interactive router linking.
 */
export interface GpWidgetNavigationConfig {
  /**
   * Angular router command / URL path or array (e.g. '/analytics', ['/orders', 123]).
   */
  routerLink?: string | any[];

  /**
   * Query parameters to pass along with navigation.
   */
  queryParams?: Record<string, any>;

  /**
   * URL fragment (hash).
   */
  fragment?: string;

  /**
   * Router navigation options.
   */
  routerOptions?: Record<string, any>;

  /**
   * External URL link target.
   */
  linkTarget?: '_blank' | '_self';

  /**
   * Direct href for external hyperlinks.
   */
  href?: string;
}

/**
 * Interactive action button configuration for widget headers or item rows.
 */
export interface GpWidgetAction extends GpWidgetNavigationConfig {
  id: string;
  label?: string;
  icon?: string;
  severity?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger';
  disabled?: boolean;
  tooltip?: string;
  onClick?: (event: MouseEvent, action: GpWidgetAction, widgetData?: any) => void;
}

/**
 * Common state properties for all widget types.
 */
export interface GpWidgetBaseState extends GpWidgetNavigationConfig {
  title?: string;
  subtitle?: string;
  loading?: boolean;
  error?: string | Error | null;
  emptyMessage?: string;
  refreshInterval?: number;
  actions?: GpWidgetAction[];
}

/**
 * KPI Metric data structure.
 */
export interface GpKpiWidgetData extends GpWidgetBaseState {
  label: string;
  value: string | number;
  change?: string;
  trendText?: string;
  trend?: 'pos' | 'neg' | 'neutral' | 'positive' | 'negative';
  trendType?: 'pos' | 'neg' | 'neutral' | 'positive' | 'negative';
  icon?: string;
  iconBg?: string;
  iconColor?: string;
  target?: string;
  progress?: number;
  meta?: string;
  onClick?: (data: GpKpiWidgetData) => void;
}

/**
 * Chart series item for simulated or connected chart widgets.
 */
export interface GpChartWidgetSeries {
  name: string;
  data: number[];
  color?: string;
}

export interface GpChartWidgetMonthlyData extends GpWidgetNavigationConfig {
  month: string;
  amt: string;
  pct: number;
  count?: number;
  meta?: any;
}

export interface GpChartWidgetData extends GpWidgetBaseState {
  badge?: string;
  badgeSeverity?: GpBadgeSeverity;
  categories?: string[];
  series?: GpChartWidgetSeries[];
  monthlyData?: GpChartWidgetMonthlyData[];
  timeRangeOptions?: string[];
  selectedTimeRange?: string;
  onSelectTimeRange?: (range: string) => void;
  onBarClick?: (item: GpChartWidgetMonthlyData) => void;
}

/**
 * Table Column definition for grid table widget.
 */
export interface GpGridTableColumn {
  field: string;
  header: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  type?: 'text' | 'badge' | 'avatar' | 'currency' | 'date' | 'progress' | 'tag' | 'link';
  badgeSeverityField?: string;
  badgeSeverity?: GpBadgeSeverity;
  sortable?: boolean;
  filterable?: boolean;
  routerLinkField?: string;
}

export interface GpGridTableRow extends Record<string, any>, GpWidgetNavigationConfig {
  id?: string | number;
}

export interface GpTableWidgetData extends GpWidgetBaseState {
  columns?: GpGridTableColumn[];
  rows?: GpGridTableRow[];
  exportable?: boolean;
  filterPlaceholder?: string;
  pageSize?: number;
  totalRecords?: number;
  onRowClick?: (row: GpGridTableRow) => void;
}

/**
 * List / Activity Feed Item.
 */
export interface GpGridListItem extends GpWidgetNavigationConfig {
  id?: string;
  title: string;
  subtitle?: string;
  category?: string;
  meta?: string;
  time?: string;
  avatar?: string;
  avatarLabel?: string;
  badge?: string;
  badgeSeverity?: GpBadgeSeverity;
  icon?: string;
  iconBg?: string;
  iconColor?: string;
  revenue?: string;
  sales?: string | number;
  status?: string;
  customData?: any;
  onClick?: (item: GpGridListItem) => void;
}

export interface GpListWidgetData extends GpWidgetBaseState {
  actionLabel?: string;
  items?: GpGridListItem[];
  onItemClick?: (item: GpGridListItem) => void;
}

/**
 * Progress / Goal Item.
 */
export interface GpGridProgressItem extends GpWidgetNavigationConfig {
  label: string;
  valueText?: string;
  valText?: string;
  percentage: number;
  pct?: number;
  color?: string;
  severity?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  target?: string;
  onClick?: (item: GpGridProgressItem) => void;
}

export interface GpProgressWidgetData extends GpWidgetBaseState {
  target?: string;
  goalsTitle?: string;
  goalsTarget?: string;
  items?: GpGridProgressItem[];
  quotas?: GpGridProgressItem[];
  onItemClick?: (item: GpGridProgressItem) => void;
}
