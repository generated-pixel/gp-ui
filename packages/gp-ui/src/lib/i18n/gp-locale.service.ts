import { Injectable, inject, signal, computed } from '@angular/core';
import { GpDirection, GpDirectionService, GpTranslationService } from '../config/gp-config.service';
import {
  GpNumberFormat,
  GpNumberFormatOptions,
  GpCurrencyFormatOptions,
  GpByteSizeOptions,
  GpLocaleSeparators
} from './gp-number-format';
import {
  GpDateTimeFormat,
  GpDateTimePreset,
  GpDateTimeFormatOptions,
  GpRelativeTimeOptions,
  GpDurationFormatOptions,
  GpTimeZoneInfo
} from './gp-date-time-format';
import { GpListFormat, GpListFormatOptions, GpCollator } from './gp-text-format';

export interface GpLocaleMetadata {
  locale: string;
  language: string;
  country?: string;
  timeZone: string;
  currency: string;
  direction: GpDirection;
  separators: GpLocaleSeparators;
  isRtl: boolean;
}

/**
 * Enterprise reactive Angular service for application-wide locale, timezone, currency,
 * number conversions, and date/time formatting.
 */
@Injectable({
  providedIn: 'root'
})
export class GpLocaleService {
  private directionService = inject(GpDirectionService);
  private translationService = inject(GpTranslationService);

  private currentLocale = signal<string>(GpNumberFormat.defaultLocale());
  private currentTimeZone = signal<string>(GpDateTimeFormat.defaultTimeZone());
  private currentCurrency = signal<string>('USD');

  /** Active application locale signal (e.g. 'en-US', 'de-DE', 'ja-JP') */
  public readonly locale = this.currentLocale.asReadonly();

  /** Active application timezone signal (e.g. 'America/New_York', 'UTC', 'Asia/Tokyo') */
  public readonly timeZone = this.currentTimeZone.asReadonly();

  /** Active default currency code signal (e.g. 'USD', 'EUR', 'GBP') */
  public readonly currency = this.currentCurrency.asReadonly();

  /** Active reading direction (delegated to GpDirectionService) */
  public readonly direction = this.directionService.dir;

  /** Active locale separators (decimal, group, currency symbol) */
  public readonly separators = computed(() => GpNumberFormat.getSeparators(this.currentLocale()));

  /** Detailed locale metadata object */
  public readonly metadata = computed<GpLocaleMetadata>(() => {
    const loc = this.currentLocale();
    const parts = loc.split(/[-_]/);
    return {
      locale: loc,
      language: parts[0],
      country: parts[1],
      timeZone: this.currentTimeZone(),
      currency: this.currentCurrency(),
      direction: this.directionService.dir(),
      separators: this.separators(),
      isRtl: this.directionService.isRtl()
    };
  });

  /**
   * Sets the global application locale. Automatically syncs direction if RTL locale (e.g. ar, he, fa, ur).
   */
  public setLocale(newLocale: string): void {
    this.currentLocale.set(newLocale);
    const lang = newLocale.split(/[-_]/)[0].toLowerCase();
    const isRtl = ['ar', 'he', 'fa', 'ur'].includes(lang);
    this.directionService.setDirection(isRtl ? 'rtl' : 'ltr');
  }

  /**
   * Sets the global application timezone.
   */
  public setTimeZone(newTimeZone: string): void {
    this.currentTimeZone.set(newTimeZone);
  }

  /**
   * Sets the global application currency.
   */
  public setCurrency(newCurrency: string): void {
    this.currentCurrency.set(newCurrency);
  }

  // --- Number Conversions & Formatting ---

  public formatNumber(value: number | null | undefined, options?: GpNumberFormatOptions, locale?: string): string {
    return GpNumberFormat.format(value, options, locale || this.currentLocale());
  }

  public parseNumber(text: string | null | undefined, locale?: string, options?: { parseAsRatio?: boolean }): number {
    return GpNumberFormat.parse(text, locale || this.currentLocale(), options);
  }

  public formatCurrency(
    amount: number | null | undefined,
    currency?: string,
    options?: GpCurrencyFormatOptions,
    locale?: string
  ): string {
    return GpNumberFormat.formatCurrency(
      amount,
      currency || this.currentCurrency(),
      options,
      locale || this.currentLocale()
    );
  }

  public convertCurrency(amount: number, fromRate: number, toRate: number, decimals = 2): number {
    return GpNumberFormat.convertCurrency(amount, fromRate, toRate, decimals);
  }

  public formatPercent(value: number | null | undefined, options?: GpNumberFormatOptions, locale?: string): string {
    return GpNumberFormat.formatPercent(value, options, locale || this.currentLocale());
  }

  public formatCompact(
    value: number | null | undefined,
    display: 'short' | 'long' = 'short',
    locale?: string,
    options?: GpNumberFormatOptions
  ): string {
    return GpNumberFormat.formatCompact(value, display, locale || this.currentLocale(), options);
  }

  public formatUnit(
    value: number | null | undefined,
    unit: string,
    options?: GpNumberFormatOptions,
    locale?: string
  ): string {
    return GpNumberFormat.formatUnit(value, unit, options, locale || this.currentLocale());
  }

  public formatByteSize(bytes: number | null | undefined, options?: GpByteSizeOptions, locale?: string): string {
    return GpNumberFormat.formatByteSize(bytes, options, locale || this.currentLocale());
  }

  public formatOrdinal(value: number | null | undefined, locale?: string): string {
    return GpNumberFormat.formatOrdinal(value, locale || this.currentLocale());
  }

  public formatNumberRange(start: number, end: number, options?: GpNumberFormatOptions, locale?: string): string {
    return GpNumberFormat.formatRange(start, end, options, locale || this.currentLocale());
  }

  // --- Date & Time Formatting ---

  public formatDate(
    date: Date | number | string | null | undefined,
    presetOrOptions?: GpDateTimePreset | GpDateTimeFormatOptions,
    locale?: string,
    timeZone?: string
  ): string {
    return GpDateTimeFormat.format(
      date,
      presetOrOptions,
      locale || this.currentLocale(),
      timeZone || this.currentTimeZone()
    );
  }

  public formatDateRange(
    start: Date | number | string | null | undefined,
    end: Date | number | string | null | undefined,
    options?: GpDateTimeFormatOptions,
    locale?: string,
    timeZone?: string
  ): string {
    return GpDateTimeFormat.formatRange(
      start,
      end,
      options,
      locale || this.currentLocale(),
      timeZone || this.currentTimeZone()
    );
  }

  public formatRelative(
    date: Date | number | string | null | undefined,
    options?: GpRelativeTimeOptions,
    locale?: string
  ): string {
    return GpDateTimeFormat.formatRelative(date, options, locale || this.currentLocale());
  }

  public formatDuration(
    duration: number | null | undefined,
    options?: GpDurationFormatOptions,
    locale?: string
  ): string {
    return GpDateTimeFormat.formatDuration(duration, options, locale || this.currentLocale());
  }

  public getTimeZoneOffset(timeZone?: string, date?: Date | number | string): GpTimeZoneInfo {
    return GpDateTimeFormat.getTimeZoneOffset(timeZone || this.currentTimeZone(), date);
  }

  // --- List & Collation ---

  public formatList(items: string[] | null | undefined, options?: GpListFormatOptions, locale?: string): string {
    return GpListFormat.format(items, options, locale || this.currentLocale());
  }

  public sort<T>(
    items: T[] | null | undefined,
    selector?: (item: T) => string,
    options?: Intl.CollatorOptions,
    locale?: string
  ): T[] {
    return GpCollator.sort(items, selector, options, locale || this.currentLocale());
  }
}
