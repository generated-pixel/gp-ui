import { InjectionToken } from '@angular/core';
import { GpAnalyticsConfig } from '../interfaces/gp-analytics-config.interface';

export const GP_ANALYTICS_CONFIG = new InjectionToken<Partial<GpAnalyticsConfig>>('GP_ANALYTICS_CONFIG');
