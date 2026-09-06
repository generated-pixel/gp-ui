import { GpDashboardWidgetConfig } from '../types/gp-dashboard-widget-config.type';
import { GpDashboardFilterField } from './gp-dashboard-filter-field.interface';
import { GpDashboardQuickPreset } from './gp-dashboard-quick-preset.interface';
import { GpFilterCondition } from './gp-filter-condition.interface';

export interface GpDashboardConfig {
  id: string;
  title: string;
  subtitle?: string;
  columns?: number;
  rowHeight?: number;
  gap?: number;
  compactType?: 'vertical' | 'none';
  allowMove?: boolean;
  allowResize?: boolean;
  filters?: GpFilterCondition[];
  filterFields?: GpDashboardFilterField[];
  quickPresets?: GpDashboardQuickPreset[];
  activePresetId?: string | null;
  activeFilters?: GpFilterCondition[];
  widgets: GpDashboardWidgetConfig[];
}
