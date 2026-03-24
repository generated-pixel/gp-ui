import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import {
  DEFAULT_GP_ANALYTICS_FORMATTING,
  DEFAULT_GP_ANALYTICS_THEME,
  DEFAULT_GP_ANALYTICS_TRANSLATIONS,
  GpAnalyticsConfig,
  GpAnalyticsTranslations,
} from '../config/gp-analytics-config';
import { GP_ANALYTICS_CONFIG, GP_ANALYTICS_TRANSLATIONS } from '../tokens/gp-analytics.token';

export function provideGpAnalytics(config: GpAnalyticsConfig): EnvironmentProviders {
  const translations: GpAnalyticsTranslations = {
    ...DEFAULT_GP_ANALYTICS_TRANSLATIONS,
    ...config.translations,
  };
  const formatting = {
    ...DEFAULT_GP_ANALYTICS_FORMATTING,
    ...config.formatting,
  };
  const theme = {
    ...DEFAULT_GP_ANALYTICS_THEME,
    ...config.theme,
  };

  return makeEnvironmentProviders([
    {
      provide: GP_ANALYTICS_CONFIG,
      useValue: {
        enabled: true,
        ...config,
        formatting,
        theme,
      } satisfies GpAnalyticsConfig,
    },
    {
      provide: GP_ANALYTICS_TRANSLATIONS,
      useValue: translations,
    },
  ]);
}
