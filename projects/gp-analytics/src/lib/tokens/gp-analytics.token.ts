import { InjectionToken } from '@angular/core';

import { GpAnalyticsConfig, GpAnalyticsTranslations } from '../config/gp-analytics-config';

export const GP_ANALYTICS_CONFIG = new InjectionToken<GpAnalyticsConfig>('GP_ANALYTICS_CONFIG');
export const GP_ANALYTICS_TRANSLATIONS = new InjectionToken<GpAnalyticsTranslations>(
  'GP_ANALYTICS_TRANSLATIONS',
);
