import { Pipe, PipeTransform, inject } from '@angular/core';
import { GpLocaleService } from './gp-locale.service';
import {
  GpNumberFormat,
  GpNumberFormatOptions,
  GpCurrencyFormatOptions,
  GpByteSizeOptions
} from './gp-number-format';
import {
  GpDateTimeFormat,
  GpDateTimePreset,
  GpDateTimeFormatOptions,
  GpRelativeTimeOptions,
  GpDurationFormatOptions
} from './gp-date-time-format';
import { GpListFormat, GpListFormatOptions } from './gp-text-format';

/**
 * Formats a numeric value into a localized string representation.
 * Usage: `{{ amount | gpNumber: { minimumFractionDigits: 2 } : 'de-DE' }}`
 */
@Pipe({
  name: 'gpNumber',
  standalone: true
})
export class GpNumberPipe implements PipeTransform {
  private localeService = inject(GpLocaleService);

  public transform(
    value: number | null | undefined,
    options?: GpNumberFormatOptions,
    locale?: string
  ): string {
    return GpNumberFormat.format(value, options, locale || this.localeService.locale());
  }
}

/**
 * Formats a number into a localized currency string.
 * Usage: `{{ price | gpCurrency: 'EUR' : 'symbol' : 2 : 'de-DE' }}`
 */
@Pipe({
  name: 'gpCurrency',
  standalone: true
})
export class GpCurrencyPipe implements PipeTransform {
  private localeService = inject(GpLocaleService);

  public transform(
    value: number | null | undefined,
    currency?: string,
    display: 'symbol' | 'narrowSymbol' | 'code' | 'name' = 'symbol',
    fractionDigits?: number,
    locale?: string
  ): string {
    const targetCurrency = currency || this.localeService.currency();
    const targetLocale = locale || this.localeService.locale();
    const options: GpCurrencyFormatOptions = {
      currencyDisplay: display,
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits
    };
    return GpNumberFormat.formatCurrency(value, targetCurrency, options, targetLocale);
  }
}

/**
 * Formats a ratio as a percentage.
 * Usage: `{{ ratio | gpPercent: 1 : 'fr-FR' }}` -> "45,5 %"
 */
@Pipe({
  name: 'gpPercent',
  standalone: true
})
export class GpPercentPipe implements PipeTransform {
  private localeService = inject(GpLocaleService);

  public transform(
    value: number | null | undefined,
    fractionDigits = 1,
    locale?: string
  ): string {
    const options: GpNumberFormatOptions = {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits
    };
    return GpNumberFormat.formatPercent(value, options, locale || this.localeService.locale());
  }
}

/**
 * Formats numbers into compact notation (e.g. 1.2M, 450K, 1,2 Mio.).
 * Usage: `{{ totalViews | gpCompactNumber: 'short' : 'de-DE' }}`
 */
@Pipe({
  name: 'gpCompactNumber',
  standalone: true
})
export class GpCompactNumberPipe implements PipeTransform {
  private localeService = inject(GpLocaleService);

  public transform(
    value: number | null | undefined,
    display: 'short' | 'long' = 'short',
    locale?: string
  ): string {
    return GpNumberFormat.formatCompact(value, display, locale || this.localeService.locale());
  }
}

/**
 * Formats bytes into human readable file size strings (KB, MB, GB).
 * Usage: `{{ bytes | gpByteSize: 'binary' : 2 : 'en-US' }}` -> "14.25 MiB"
 */
@Pipe({
  name: 'gpByteSize',
  standalone: true
})
export class GpByteSizePipe implements PipeTransform {
  private localeService = inject(GpLocaleService);

  public transform(
    bytes: number | null | undefined,
    standard: 'binary' | 'decimal' = 'decimal',
    precision = 1,
    locale?: string
  ): string {
    const options: GpByteSizeOptions = { standard, precision };
    return GpNumberFormat.formatByteSize(bytes, options, locale || this.localeService.locale());
  }
}

/**
 * Formats an ordinal rank number (1st, 2nd, 3rd, 1er, etc.).
 * Usage: `{{ position | gpOrdinal: 'en-US' }}`
 */
@Pipe({
  name: 'gpOrdinal',
  standalone: true
})
export class GpOrdinalPipe implements PipeTransform {
  private localeService = inject(GpLocaleService);

  public transform(value: number | null | undefined, locale?: string): string {
    return GpNumberFormat.formatOrdinal(value, locale || this.localeService.locale());
  }
}

/**
 * Formats dates according to standard presets or Intl options, with timezone awareness.
 * Usage: `{{ orderDate | gpDate: 'mediumDate' : 'America/New_York' : 'en-US' }}`
 */
@Pipe({
  name: 'gpDate',
  standalone: true
})
export class GpDatePipe implements PipeTransform {
  private localeService = inject(GpLocaleService);

  public transform(
    date: Date | number | string | null | undefined,
    presetOrOptions?: GpDateTimePreset | GpDateTimeFormatOptions,
    timeZone?: string,
    locale?: string
  ): string {
    return GpDateTimeFormat.format(
      date,
      presetOrOptions,
      locale || this.localeService.locale(),
      timeZone || this.localeService.timeZone()
    );
  }
}

/**
 * Formats dates into human relative time ("3 minutes ago", "yesterday", "in 2 days").
 * Usage: `{{ lastSeen | gpRelativeTime }}`
 */
@Pipe({
  name: 'gpRelativeTime',
  standalone: true
})
export class GpRelativeTimePipe implements PipeTransform {
  private localeService = inject(GpLocaleService);

  public transform(
    date: Date | number | string | null | undefined,
    options?: GpRelativeTimeOptions,
    locale?: string
  ): string {
    return GpDateTimeFormat.formatRelative(date, options, locale || this.localeService.locale());
  }
}

/**
 * Formats seconds or milliseconds into human-readable duration strings ("2 hours, 15 minutes", "02:15:00").
 * Usage: `{{ elapsedSeconds | gpDuration: 'long' : false : 'en-US' }}`
 */
@Pipe({
  name: 'gpDuration',
  standalone: true
})
export class GpDurationPipe implements PipeTransform {
  private localeService = inject(GpLocaleService);

  public transform(
    duration: number | null | undefined,
    style: 'long' | 'short' | 'narrow' | 'digital' = 'long',
    isMilliseconds = false,
    locale?: string
  ): string {
    const options: GpDurationFormatOptions = { style, isMilliseconds };
    return GpDateTimeFormat.formatDuration(duration, options, locale || this.localeService.locale());
  }
}

/**
 * Formats an array of strings naturally into a localized list ("A, B, and C").
 * Usage: `{{ tags | gpList: 'conjunction' : 'long' : 'en-US' }}`
 */
@Pipe({
  name: 'gpList',
  standalone: true
})
export class GpListPipe implements PipeTransform {
  private localeService = inject(GpLocaleService);

  public transform(
    items: string[] | null | undefined,
    type: 'conjunction' | 'disjunction' | 'unit' = 'conjunction',
    style: 'long' | 'short' | 'narrow' = 'long',
    locale?: string
  ): string {
    const options: GpListFormatOptions = { type, style };
    return GpListFormat.format(items, options, locale || this.localeService.locale());
  }
}

/**
 * All standalone i18n formatting pipes packaged together for convenient single-line imports.
 */
export const GP_I18N_PIPES = [
  GpNumberPipe,
  GpCurrencyPipe,
  GpPercentPipe,
  GpCompactNumberPipe,
  GpByteSizePipe,
  GpOrdinalPipe,
  GpDatePipe,
  GpRelativeTimePipe,
  GpDurationPipe,
  GpListPipe
] as const;
