import { Injectable, Optional, inject } from '@angular/core';
import { GpAnalyticsConfigService } from './analytics-config.service';
import { GpNumberFormatConfig } from '../interfaces/gp-number-format-config.interface';
import { SupportedCurrency } from '../types/supported-currency.type';

/**
 * Currency metadata mappings.
 */
const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CAD: 'CA$',
  AUD: 'A$',
  CHF: 'CHF'
};

/**
 * Service providing high-performance locale-aware formatting for
 * dates, numbers, and currencies (including per-table/per-record currencies).
 */
@Injectable({ providedIn: 'root' })
export class GpLocaleFormatterService {
  private readonly configService?: GpAnalyticsConfigService;

  constructor(@Optional() configService?: GpAnalyticsConfigService) {
    if (configService) {
      this.configService = configService;
    } else {
      try {
        this.configService = inject(GpAnalyticsConfigService, { optional: true }) || undefined;
      } catch {
        this.configService = undefined;
      }
    }
  }

  /**
   * Resolves the currency symbol for an ISO 4217 currency code.
   */
  getCurrencySymbol(currencyCode: string): string {
    const upper = (currencyCode || '').toUpperCase();
    if (CURRENCY_SYMBOLS[upper]) {
      return CURRENCY_SYMBOLS[upper];
    }
    try {
      const parts = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: upper
      }).formatToParts(0);
      const symbolPart = parts.find((p) => p.type === 'currency');
      return symbolPart ? symbolPart.value : upper;
    } catch {
      return upper;
    }
  }

  /**
   * Formats a numeric value into localized currency.
   * Supports per-table or per-record currency override.
   */
  formatCurrency(
    amount: number | null | undefined,
    currencyCode?: SupportedCurrency | string,
    display?: 'symbol' | 'code' | 'name'
  ): string {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return '';
    }

    const code = (currencyCode || this.configService?.currency() || 'USD').toUpperCase();
    const currencyDisplay = display || this.configService?.currencyDisplay() || 'symbol';
    const activeLocale = this.configService?.locale() || 'en-US';

    try {
      return new Intl.NumberFormat(activeLocale, {
        style: 'currency',
        currency: code,
        currencyDisplay: currencyDisplay
      }).format(amount);
    } catch {
      // Fallback formatting if browser Intl does not recognize currency or locale
      const symbol = this.getCurrencySymbol(code);
      const formattedNumber = this.formatNumber(amount, { precision: code === 'JPY' ? 0 : 2 });
      return currencyDisplay === 'code' ? `${formattedNumber} ${code}` : `${symbol}${formattedNumber}`;
    }
  }

  /**
   * Formats a number with configurable separators and precision.
   */
  formatNumber(value: number | null | undefined, configOverride?: Partial<GpNumberFormatConfig>): string {
    if (value === null || value === undefined || isNaN(value)) {
      return '';
    }

    const globalConfig = this.configService?.numberFormat() || {
      decimalSeparator: '.',
      thousandSeparator: ',',
      precision: 2
    };

    const precision = configOverride?.precision ?? globalConfig.precision ?? 2;
    const decimalSeparator = configOverride?.decimalSeparator ?? globalConfig.decimalSeparator ?? '.';
    const thousandSeparator = configOverride?.thousandSeparator ?? globalConfig.thousandSeparator ?? ',';

    const fixed = Math.abs(value).toFixed(precision);
    const [integerPart, decimalPart] = fixed.split('.');

    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);
    const sign = value < 0 ? '-' : '';

    if (precision > 0 && decimalPart) {
      return `${sign}${formattedInteger}${decimalSeparator}${decimalPart}`;
    }

    return `${sign}${formattedInteger}`;
  }

  /**
   * Formats a date using the configured or custom pattern.
   * Supported patterns: 'YYYY-MM-DD', 'DD/MM/YYYY', 'MM/DD/YYYY', 'DD.MM.YYYY', 'YYYY/MM/DD'.
   */
  formatDate(dateInput: string | number | Date | null | undefined, patternOverride?: string): string {
    if (!dateInput) {
      return '';
    }

    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
    if (isNaN(date.getTime())) {
      return String(dateInput);
    }

    const pattern = patternOverride || this.configService?.dateFormat() || 'YYYY-MM-DD';

    const year = String(date.getFullYear());
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return pattern.replace('YYYY', year).replace('MM', month).replace('DD', day);
  }
}
