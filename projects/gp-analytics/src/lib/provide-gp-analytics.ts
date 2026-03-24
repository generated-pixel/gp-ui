import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { GpAnalyticsConfig } from './gp-analytics-config';
import { GP_ANALYTICS_CONFIG } from './gp-analytics.token';

export function provideGpAnalytics(config: GpAnalyticsConfig): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: GP_ANALYTICS_CONFIG,
      useValue: {
        enabled: true,
        ...config,
      } satisfies GpAnalyticsConfig,
    },
  ]);
}
