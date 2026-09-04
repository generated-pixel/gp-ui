import { InjectionToken } from '@angular/core';
import { GpAnalyticsConfig } from '../models/analytics.models';

export const GP_ANALYTICS_CONFIG = new InjectionToken<GpAnalyticsConfig>('GP_ANALYTICS_CONFIG', {
  providedIn: 'root',
  factory: () => ({
    appName: 'Generated Pixel Analytics',
    enabled: true,
    debug: false,
    sampleRate: 1.0,
    bufferSize: 100,
    flushIntervalMs: 5000,
    defaultTimeRange: '24h',
  }),
});
