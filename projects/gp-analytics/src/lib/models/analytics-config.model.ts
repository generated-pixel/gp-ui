import { AnalyticsTimeRange } from './time-range.model';

export interface AnalyticsConfig {
  appName?: string;
  endpoint?: string;
  environment?: string;
  defaultTimeRange?: AnalyticsTimeRange;
  bufferSize?: number;
  flushIntervalMs?: number;
  sampleRate?: number;
  enabled?: boolean;
  debug?: boolean;
  theme?: string;
  defaultLocale?: string;
}

export type GpAnalyticsConfig = AnalyticsConfig;
