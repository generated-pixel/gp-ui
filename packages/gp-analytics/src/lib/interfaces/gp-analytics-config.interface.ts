import { SupportedLocale } from '../types/supported-locale.type';
import { GpAggregationType } from '../types/gp-aggregation-type.type';
import { GpNumberFormatConfig } from './gp-number-format-config.interface';

export interface GpAnalyticsConfig {
  locale?: SupportedLocale | string;
  dateFormat?: string;
  numberFormat?: GpNumberFormatConfig;
  currency?: string;
  currencyDisplay?: 'symbol' | 'code' | 'name';
  timeZone?: string;
  defaultAggregation?: GpAggregationType;
  enableQueryCache?: boolean;
  themeMode?: 'light' | 'dark' | 'auto';
}
