import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { GpAnalyticsConfig } from '../interfaces/gp-analytics-config.interface';
import { GP_ANALYTICS_CONFIG } from './gp-analytics-config.token';

/**
 * Provides global configuration and initialization for gp-analytics.
 */
export function provideGpAnalytics(config?: Partial<GpAnalyticsConfig>): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: GP_ANALYTICS_CONFIG,
      useValue: config || {}
    }
  ]);
}
