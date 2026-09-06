import { GpKpiWidgetConfig } from '../interfaces/gp-kpi-widget-config.interface';
import { GpChartWidgetConfig } from '../interfaces/gp-chart-widget-config.interface';
import { GpTableWidgetConfig } from '../interfaces/gp-table-widget-config.interface';
import { GpPivotWidgetConfig } from '../interfaces/gp-pivot-widget-config.interface';
import { GpCustomWidgetConfig } from '../interfaces/gp-custom-widget-config.interface';

export type GpDashboardWidgetConfig =
  GpKpiWidgetConfig | GpChartWidgetConfig | GpTableWidgetConfig | GpPivotWidgetConfig | GpCustomWidgetConfig;
