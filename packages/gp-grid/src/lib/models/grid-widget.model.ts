import { GpBadgeSeverity } from '@generatedpixel/gp-ui';

/**
 * Standard widget types supported natively by gp-grid.
 */
export type GpGridWidgetType =
  | 'custom'
  | 'kpi'
  | 'chart'
  | 'table'
  | 'list'
  | 'progress'
  | 'stats'
  | 'timeline'
  | 'feed'
  | 'empty';

/**
 * KPI Metric data structure.
 */
export interface GpKpiWidgetData {
  label: string;
  value: string | number;
  change?: string;
  trendText?: string;
  trend?: 'pos' | 'neg' | 'neutral' | 'positive' | 'negative';
  trendType?: 'pos' | 'neg' | 'neutral' | 'positive' | 'negative';
  icon?: string;
  iconBg?: string;
  iconColor?: string;
  subtitle?: string;
  target?: string;
  progress?: number;
  meta?: string;
}

/**
 * Chart series item for simulated or connected chart widgets.
 */
export interface GpChartWidgetSeries {
  name: string;
  data: number[];
  color?: string;
}

export interface GpChartWidgetMonthlyData {
  month: string;
  amt: string;
  pct: number;
}

export interface GpChartWidgetData {
  title?: string;
  subtitle?: string;
  badge?: string;
  badgeSeverity?: GpBadgeSeverity;
  categories?: string[];
  series?: GpChartWidgetSeries[];
  monthlyData?: GpChartWidgetMonthlyData[];
  timeRangeOptions?: string[];
  selectedTimeRange?: string;
}

/**
 * Table Column definition for grid table widget.
 */
export interface GpGridTableColumn {
  field: string;
  header: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  type?: 'text' | 'badge' | 'avatar' | 'currency' | 'date' | 'progress' | 'tag';
  badgeSeverityField?: string;
  badgeSeverity?: GpBadgeSeverity;
}

export interface GpTableWidgetData {
  title?: string;
  columns: GpGridTableColumn[];
  rows: Record<string, any>[];
  exportable?: boolean;
  filterPlaceholder?: string;
}

/**
 * List / Activity Feed Item.
 */
export interface GpGridListItem {
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
}

export interface GpListWidgetData {
  title?: string;
  actionLabel?: string;
  items: GpGridListItem[];
}

/**
 * Progress / Goal Item.
 */
export interface GpGridProgressItem {
  label: string;
  valueText?: string;
  valText?: string;
  percentage: number;
  pct?: number;
  color?: string;
  severity?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
}

export interface GpProgressWidgetData {
  title?: string;
  target?: string;
  goalsTitle?: string;
  goalsTarget?: string;
  items?: GpGridProgressItem[];
  quotas?: GpGridProgressItem[];
}
