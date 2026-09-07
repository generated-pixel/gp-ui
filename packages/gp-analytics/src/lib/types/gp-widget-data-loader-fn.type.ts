import { Observable } from 'rxjs';
import { GpDashboardWidgetConfig } from './gp-dashboard-widget-config.type';
import { GpWidgetLoadContext } from '../interfaces/gp-widget-load-context.interface';

/**
 * Function signature for custom asynchronous widget data loaders.
 */
export type GpWidgetDataLoaderFn<T = any> = (
  widget: GpDashboardWidgetConfig,
  context?: GpWidgetLoadContext
) => Promise<T> | Observable<T> | T;
