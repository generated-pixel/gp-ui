import { Injectable, Inject, Optional, computed, signal, WritableSignal } from '@angular/core';
import { GpAnalyticsConfig } from '../interfaces/gp-analytics-config.interface';
import { GpNumberFormatConfig } from '../interfaces/gp-number-format-config.interface';
import { GP_ANALYTICS_CONFIG } from '../providers/gp-analytics-config.token';

/**
 * Default global configuration values.
 */
export const DEFAULT_GP_ANALYTICS_CONFIG: Required<GpAnalyticsConfig> = {
  locale: 'en',
  dateFormat: 'YYYY-MM-DD',
  numberFormat: {
    decimalSeparator: '.',
    thousandSeparator: ',',
    precision: 2
  },
  currency: 'USD',
  currencyDisplay: 'symbol',
  timeZone: 'UTC',
  defaultAggregation: 'sum',
  enableQueryCache: true,
  themeMode: 'auto'
};

/**
 * Enterprise Configuration Service for gp-analytics.
 * Provides reactive signals for platform-wide formatting, currencies,
 * dates, numbers, timezones, and theme settings.
 */
@Injectable({ providedIn: 'root' })
export class GpAnalyticsConfigService {
  private readonly initialTokenConfig: Partial<GpAnalyticsConfig> | null;
  readonly state: WritableSignal<Required<GpAnalyticsConfig>>;

  constructor(@Optional() @Inject(GP_ANALYTICS_CONFIG) initialConfig?: Partial<GpAnalyticsConfig> | null) {
    this.initialTokenConfig = initialConfig || null;

    this.state = signal<Required<GpAnalyticsConfig>>({
      ...DEFAULT_GP_ANALYTICS_CONFIG,
      ...(this.initialTokenConfig || {})
    });
  }

  readonly locale = computed(() => this.state().locale);
  readonly dateFormat = computed(() => this.state().dateFormat);
  readonly numberFormat = computed<GpNumberFormatConfig>(() => this.state().numberFormat);
  readonly currency = computed(() => this.state().currency);
  readonly currencyDisplay = computed(() => this.state().currencyDisplay);
  readonly timeZone = computed(() => this.state().timeZone);
  readonly defaultAggregation = computed(() => this.state().defaultAggregation);
  readonly enableQueryCache = computed(() => this.state().enableQueryCache);
  readonly themeMode = computed(() => this.state().themeMode);

  /**
   * Updates configuration settings dynamically at runtime.
   */
  updateConfig(partial: Partial<GpAnalyticsConfig>): void {
    this.state.update((current) => ({
      ...current,
      ...partial,
      numberFormat: {
        ...current.numberFormat,
        ...(partial.numberFormat || {})
      }
    }));
  }

  /**
   * Resets all settings back to default configuration.
   */
  resetConfig(): void {
    this.state.set({
      ...DEFAULT_GP_ANALYTICS_CONFIG,
      ...(this.initialTokenConfig || {})
    });
  }
}
