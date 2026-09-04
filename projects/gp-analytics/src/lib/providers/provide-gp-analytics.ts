import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { GpAnalyticsConfig } from '../models/analytics.models';
import { GP_ANALYTICS_CONFIG } from '../tokens/analytics.tokens';
import { GpAnalyticsService } from '../services/gp-analytics.service';

/**
 * Provides gp-analytics configuration and core services.
 *
 * @example
 * ```ts
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideGpAnalytics({
 *       appName: 'My Enterprise App',
 *       enabled: true,
 *       defaultTimeRange: '24h'
 *     })
 *   ]
 * };
 * ```
 */
export function provideGpAnalytics(config?: Partial<GpAnalyticsConfig>): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: GP_ANALYTICS_CONFIG,
      useValue: {
        appName: config?.appName ?? 'Generated Pixel Analytics',
        endpoint: config?.endpoint,
        enabled: config?.enabled ?? true,
        debug: config?.debug ?? false,
        sampleRate: config?.sampleRate ?? 1.0,
        bufferSize: config?.bufferSize ?? 200,
        flushIntervalMs: config?.flushIntervalMs ?? 5000,
        defaultTimeRange: config?.defaultTimeRange ?? '24h',
        theme: config?.theme,
      },
    },
    GpAnalyticsService,
  ]);
}
