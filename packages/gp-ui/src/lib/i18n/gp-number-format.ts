/**
 * gp-ui - Locale-Aware Number Formatting, Conversion & Parsing Utilities
 */

export interface GpNumberFormatOptions {
  localeMatcher?: string;
  style?: 'decimal' | 'currency' | 'percent' | 'unit' | string;
  currency?: string;
  currencyDisplay?: 'symbol' | 'narrowSymbol' | 'code' | 'name' | string;
  currencySign?: 'standard' | 'accounting' | string;
  useGrouping?: boolean | 'always' | 'auto' | 'min2' | string;
  minimumIntegerDigits?: number;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  minimumSignificantDigits?: number;
  maximumSignificantDigits?: number;
  compactDisplay?: 'short' | 'long' | string;
  notation?: 'standard' | 'scientific' | 'engineering' | 'compact' | string;
  unit?: string;
  unitDisplay?: 'short' | 'narrow' | 'long' | string;
  signDisplay?: 'auto' | 'never' | 'always' | 'exceptZero' | string;
  /** Fallback string if value is null, undefined, or NaN (defaults to '') */
  fallback?: string;
  [key: string]: any;
}

export interface GpCurrencyFormatOptions extends GpNumberFormatOptions {
  /** ISO 4217 3-letter currency code (e.g. 'USD', 'EUR', 'GBP', 'JPY') */
  currency?: string;
  /** Currency display format ('symbol' | 'narrowSymbol' | 'code' | 'name') */
  currencyDisplay?: 'symbol' | 'narrowSymbol' | 'code' | 'name' | string;
  /** Whether to use accounting parenthesis for negative numbers e.g. ($50.00) */
  currencySign?: 'standard' | 'accounting' | string;
}

export interface GpByteSizeOptions {
  /** 'binary' (1024 base: KiB, MiB, GiB) or 'decimal' (1000 base: KB, MB, GB). Defaults to 'decimal' */
  standard?: 'binary' | 'decimal';
  /** Number of decimal places. Defaults to 1 */
  precision?: number;
  /** Fallback string if value is null/undefined. Defaults to '0 B' */
  fallback?: string;
}

export interface GpLocaleSeparators {
  decimal: string;
  group: string;
  currencySymbol?: string;
}

/** Mapping of Eastern Arabic / Persian digits to Western digits */
const ARABIC_INDIC_DIGITS: Record<string, string> = {
  '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
  '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9',
  '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4',
  '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9'
};

const ARABIC_DIGIT_REGEX = /[٠-٩۰-۹]/g;

/**
 * Enterprise locale-aware number formatting and bidirectional conversion utility.
 */
export class GpNumberFormat {
  /**
   * Resolves active browser or system default locale.
   */
  public static defaultLocale(): string {
    if (typeof navigator !== 'undefined' && navigator.language) {
      return navigator.language;
    }
    return 'en-US';
  }

  /**
   * Formats a numeric value according to locale and Intl options.
   */
  public static format(
    value: number | null | undefined,
    options?: GpNumberFormatOptions,
    locale?: string
  ): string {
    if (value === null || value === undefined || isNaN(value)) {
      return options?.fallback ?? '';
    }

    const { fallback, ...intlOptions } = options || {};
    const targetLocale = locale || this.defaultLocale();

    try {
      return new Intl.NumberFormat(targetLocale, intlOptions as any).format(value);
    } catch {
      return String(value);
    }
  }

  /**
   * Obtains the decimal and group separators for a given locale.
   */
  public static getSeparators(locale?: string): GpLocaleSeparators {
    const targetLocale = locale || this.defaultLocale();
    const formatter = new Intl.NumberFormat(targetLocale, {
      style: 'currency',
      currency: 'USD',
      useGrouping: true
    });

    const parts = formatter.formatToParts(1000000.5);
    let decimal = '.';
    let group = ',';
    let currencySymbol = '$';

    for (const part of parts) {
      if (part.type === 'decimal') {
        decimal = part.value;
      } else if (part.type === 'group') {
        group = part.value;
      } else if (part.type === 'currency') {
        currencySymbol = part.value;
      }
    }

    return { decimal, group, currencySymbol };
  }

  /**
   * Robustly parses any localized number string back into a standard JavaScript number.
   * Handles:
   * - European comma decimals (e.g. "1.234.567,89")
   * - Standard point decimals (e.g. "1,234,567.89")
   * - Space / thin space grouping (e.g. "1 234 567,89" or "1\u202F234\u202F567,89")
   * - Swiss apostrophe grouping (e.g. "1'234'567.89")
   * - Arabic-Indic and Persian numerals ("١٬٢٣٤٫٥٦" / "۱۲۳۴٫۵۶")
   * - Accounting parentheses (e.g. "(1,234.50)" -> -1234.50)
   * - Trailing minus (e.g. "1234.50-")
   * - Percentages (e.g. "45.5%" -> 45.5 or 0.455 if parseAsRatio = true)
   * - Currency and non-numeric prefix/suffix symbols
   */
  public static parse(
    text: string | null | undefined,
    locale?: string,
    options?: { parseAsRatio?: boolean }
  ): number {
    if (!text || typeof text !== 'string') {
      return NaN;
    }

    let trimmed = text.trim();
    if (!trimmed) {
      return NaN;
    }

    // 1. Normalize Eastern Arabic / Persian digits to ASCII 0-9
    trimmed = trimmed.replace(ARABIC_DIGIT_REGEX, (d) => ARABIC_INDIC_DIGITS[d] || d);

    // 2. Detect accounting negative format: (1,234.56) or trailing minus 1234.56-
    let isNegative = false;
    if (/^\(.*\)$/.test(trimmed)) {
      isNegative = true;
      trimmed = trimmed.slice(1, -1).trim();
    } else if (trimmed.endsWith('-')) {
      isNegative = true;
      trimmed = trimmed.slice(0, -1).trim();
    } else if (trimmed.startsWith('-')) {
      isNegative = true;
      trimmed = trimmed.slice(1).trim();
    }

    // 3. Detect percentage
    const hasPercent = trimmed.includes('%');
    if (hasPercent) {
      trimmed = trimmed.replace(/%/g, '').trim();
    }

    // 4. Determine locale decimal and grouping rules
    let decimalSep = '.';
    let groupSep = ',';

    if (locale) {
      const seps = this.getSeparators(locale);
      decimalSep = seps.decimal;
      groupSep = seps.group;
    } else {
      // Auto-detect separators:
      // Replace Arabic decimal mark \u066B and Arabic thousands separator \u066C
      trimmed = trimmed.replace(/\u066B/g, '.').replace(/\u066C/g, ',');

      const lastComma = trimmed.lastIndexOf(',');
      const lastDot = trimmed.lastIndexOf('.');

      if (lastComma > -1 && lastDot > -1) {
        if (lastComma > lastDot) {
          // German/French/Spanish style: 1.234,56
          decimalSep = ',';
          groupSep = '.';
        } else {
          // US/UK style: 1,234.56
          decimalSep = '.';
          groupSep = ',';
        }
      } else if (lastComma > -1) {
        // Only commas present: could be 1234,56 (decimal) or 1,234 (group)
        const parts = trimmed.split(',');
        if (parts.length === 2 && parts[1].length !== 3) {
          decimalSep = ',';
        } else if (parts.length > 2) {
          // Multiple commas -> group separator
          groupSep = ',';
          decimalSep = '.';
        } else {
          // Single comma with 3 digits after: check if default locale uses comma as decimal
          const defaultSep = this.getSeparators().decimal;
          if (defaultSep === ',') {
            decimalSep = ',';
          } else {
            groupSep = ',';
          }
        }
      }
    }

    // 5. Clean string: remove grouping separators, spaces, currency symbols, words
    const escapeRegex = (s: string) => s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');

    // Strip spaces, non-breaking spaces, apostrophes
    let sanitized = trimmed.replace(/[\s\u00A0\u202F\u2009']/g, '');

    // Remove group separator
    if (groupSep) {
      sanitized = sanitized.replace(new RegExp(escapeRegex(groupSep), 'g'), '');
    }

    // Normalize decimal separator to '.'
    if (decimalSep && decimalSep !== '.') {
      sanitized = sanitized.replace(new RegExp(escapeRegex(decimalSep), 'g'), '.');
    }

    // Strip any remaining non-numeric characters except '.'
    sanitized = sanitized.replace(/[^0-9.]/g, '');

    if (!sanitized) {
      return NaN;
    }

    let parsed = parseFloat(sanitized);
    if (isNaN(parsed)) {
      return NaN;
    }

    if (isNegative) {
      parsed = -parsed;
    }

    if (hasPercent && options?.parseAsRatio) {
      parsed = parsed / 100;
    }

    return parsed;
  }

  /**
   * Formats a number as a localized currency string.
   */
  public static formatCurrency(
    amount: number | null | undefined,
    currency = 'USD',
    options?: GpCurrencyFormatOptions,
    locale?: string
  ): string {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return options?.fallback ?? '';
    }

    const targetLocale = locale || this.defaultLocale();
    const intlOptions: any = {
      style: 'currency',
      currency,
      currencyDisplay: options?.currencyDisplay ?? 'symbol',
      currencySign: options?.currencySign ?? 'standard',
      ...options
    };

    try {
      return new Intl.NumberFormat(targetLocale, intlOptions as any).format(amount);
    } catch {
      return `${amount} ${currency}`;
    }
  }

  /**
   * Currency conversion calculation helper.
   * e.g. convert 100 USD to EUR given rates { USD: 1, EUR: 0.92 }
   */
  public static convertCurrency(
    amount: number,
    fromRate: number,
    toRate: number,
    decimals = 2
  ): number {
    if (isNaN(amount) || fromRate <= 0 || toRate <= 0) {
      return NaN;
    }
    const inBase = amount / fromRate;
    const converted = inBase * toRate;
    const factor = Math.pow(10, decimals);
    return Math.round(converted * factor) / factor;
  }

  /**
   * Formats a ratio as a localized percentage.
   * e.g. 0.456 -> "45.6%" or "45,6 %"
   */
  public static formatPercent(
    value: number | null | undefined,
    options?: GpNumberFormatOptions,
    locale?: string
  ): string {
    if (value === null || value === undefined || isNaN(value)) {
      return options?.fallback ?? '';
    }

    const targetLocale = locale || this.defaultLocale();
    const intlOptions: any = {
      style: 'percent',
      maximumFractionDigits: 2,
      ...options
    };

    try {
      return new Intl.NumberFormat(targetLocale, intlOptions as any).format(value);
    } catch {
      return `${value * 100}%`;
    }
  }

  /**
   * Formats a number in compact notation (e.g. 1.2M, 450K, 1,2 Mio.).
   */
  public static formatCompact(
    value: number | null | undefined,
    display: 'short' | 'long' = 'short',
    locale?: string,
    options?: GpNumberFormatOptions
  ): string {
    if (value === null || value === undefined || isNaN(value)) {
      return options?.fallback ?? '';
    }

    const targetLocale = locale || this.defaultLocale();
    const intlOptions: any = {
      notation: 'compact',
      compactDisplay: display,
      maximumFractionDigits: 1,
      ...options
    };

    try {
      return new Intl.NumberFormat(targetLocale, intlOptions as any).format(value);
    } catch {
      return String(value);
    }
  }

  /**
   * Formats a number with an international unit (e.g. 'celsius', 'kilometer', 'byte', 'second').
   */
  public static formatUnit(
    value: number | null | undefined,
    unit: string,
    options?: GpNumberFormatOptions,
    locale?: string
  ): string {
    if (value === null || value === undefined || isNaN(value)) {
      return options?.fallback ?? '';
    }

    const targetLocale = locale || this.defaultLocale();
    const intlOptions: any = {
      style: 'unit',
      unit,
      unitDisplay: 'short',
      ...options
    };

    try {
      return new Intl.NumberFormat(targetLocale, intlOptions as any).format(value);
    } catch {
      return `${value} ${unit}`;
    }
  }

  /**
   * Formats a byte size into human-readable representation (e.g. "1.5 MB" or "1,5 Mio. octets").
   */
  public static formatByteSize(
    bytes: number | null | undefined,
    options?: GpByteSizeOptions,
    locale?: string
  ): string {
    if (bytes === null || bytes === undefined || isNaN(bytes) || bytes < 0) {
      return options?.fallback ?? '0 B';
    }

    const targetLocale = locale || this.defaultLocale();
    const standard = options?.standard ?? 'decimal';
    const precision = options?.precision ?? 1;

    const base = standard === 'binary' ? 1024 : 1000;
    const units = standard === 'binary'
      ? ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB']
      : ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];

    if (bytes < base) {
      return `${bytes} B`;
    }

    const exp = Math.min(Math.floor(Math.log(bytes) / Math.log(base)), units.length - 1);
    const value = bytes / Math.pow(base, exp);

    const formattedValue = new Intl.NumberFormat(targetLocale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: precision
    }).format(value);

    return `${formattedValue} ${units[exp]}`;
  }

  /**
   * Formats a number as an ordinal (e.g. 1st, 2nd, 3rd in English; 1er, 2e in French).
   */
  public static formatOrdinal(
    value: number | null | undefined,
    locale?: string
  ): string {
    if (value === null || value === undefined || isNaN(value)) {
      return '';
    }

    const targetLocale = locale || this.defaultLocale();
    const num = Math.trunc(value);

    try {
      const pr = new Intl.PluralRules(targetLocale, { type: 'ordinal' });
      const rule = pr.select(num);

      const lang = targetLocale.split('-')[0].toLowerCase();
      if (lang === 'en') {
        const suffixes: Record<string, string> = {
          one: 'st',
          two: 'nd',
          few: 'rd',
          other: 'th'
        };
        return `${num}${suffixes[rule] || 'th'}`;
      } else if (lang === 'fr') {
        return num === 1 ? '1er' : `${num}e`;
      } else if (lang === 'es' || lang === 'pt' || lang === 'it') {
        return `${num}.º`;
      } else if (lang === 'de') {
        return `${num}.`;
      }

      return `${num}`;
    } catch {
      return `${num}`;
    }
  }

  /**
   * Formats a range between two numbers (e.g. "10 – 20 kg", "€10.00 – €50.00").
   */
  public static formatRange(
    start: number,
    end: number,
    options?: GpNumberFormatOptions,
    locale?: string
  ): string {
    const targetLocale = locale || this.defaultLocale();
    const formatter = new Intl.NumberFormat(targetLocale, options as any);

    if (typeof (formatter as any).formatRange === 'function') {
      return (formatter as any).formatRange(start, end);
    }
    return `${formatter.format(start)} – ${formatter.format(end)}`;
  }
}
