/**
 * gp-ui - Locale-Aware List Formatting, Collation, Phone Number & Name Utilities
 */

export interface GpListFormatOptions {
  /** 'conjunction' ("A, B, and C"), 'disjunction' ("A, B, or C"), 'unit' ("A, B, C"). Defaults to 'conjunction' */
  type?: 'conjunction' | 'disjunction' | 'unit';
  /** 'long' ("and"), 'short' ("&"), 'narrow' (""). Defaults to 'long' */
  style?: 'long' | 'short' | 'narrow';
  /** Fallback string if list is empty or null (defaults to '') */
  fallback?: string;
}

export interface GpNameParts {
  prefix?: string;
  givenName?: string;
  middleName?: string;
  familyName?: string;
  suffix?: string;
}

export class GpListFormat {
  public static defaultLocale(): string {
    if (typeof navigator !== 'undefined' && navigator.language) {
      return navigator.language;
    }
    return 'en-US';
  }

  /**
   * Formats an array of strings naturally into a localized list using Intl.ListFormat.
   * e.g. ["Apple", "Banana", "Orange"] -> "Apple, Banana, and Orange" (en) vs "Apple, Banana et Orange" (fr)
   */
  public static format(items: string[] | null | undefined, options?: GpListFormatOptions, locale?: string): string {
    if (!items || !items.length) {
      return options?.fallback ?? '';
    }

    const targetLocale = locale || this.defaultLocale();
    const type = options?.type ?? 'conjunction';
    const style = options?.style ?? 'long';

    try {
      if (typeof (Intl as any).ListFormat === 'function') {
        const lf = new (Intl as any).ListFormat(targetLocale, { type, style });
        return lf.format(items);
      }
    } catch {
      // Fallback below
    }

    if (items.length === 1) {
      return items[0];
    }
    if (items.length === 2) {
      const conj = type === 'disjunction' ? ' or ' : ' and ';
      return `${items[0]}${conj}${items[1]}`;
    }
    const last = items[items.length - 1];
    const initial = items.slice(0, -1).join(', ');
    const conj = type === 'disjunction' ? ', or ' : ', and ';
    return `${initial}${conj}${last}`;
  }
}

export class GpCollator {
  public static defaultLocale(): string {
    if (typeof navigator !== 'undefined' && navigator.language) {
      return navigator.language;
    }
    return 'en-US';
  }

  /**
   * Compares two strings using localized collation.
   * By default enables numeric sorting so that "item2" comes before "item10".
   */
  public static compare(a: string, b: string, options?: Intl.CollatorOptions, locale?: string): number {
    const targetLocale = locale || this.defaultLocale();
    const collator = new Intl.Collator(targetLocale, {
      numeric: true,
      sensitivity: 'base',
      ...options
    });
    return collator.compare(a ?? '', b ?? '');
  }

  /**
   * Sorts an array using localized collation. Returns a new sorted array.
   */
  public static sort<T>(
    array: T[] | null | undefined,
    selector?: (item: T) => string,
    options?: Intl.CollatorOptions,
    locale?: string
  ): T[] {
    if (!array || !array.length) {
      return [];
    }

    const copy = [...array];
    const getVal = selector || ((item: any) => String(item ?? ''));

    copy.sort((a, b) => this.compare(getVal(a), getVal(b), options, locale));
    return copy;
  }
}

export class GpPhoneFormat {
  /**
   * Cleans phone numbers to raw digits (plus leading + if international).
   */
  public static clean(phone: string | null | undefined): string {
    if (!phone) {
      return '';
    }
    const hasPlus = phone.trim().startsWith('+');
    const digits = phone.replace(/\D/g, '');
    return hasPlus ? `+${digits}` : digits;
  }

  /**
   * Formats phone numbers into standard readable representations.
   */
  public static format(
    phone: string | null | undefined,
    format: 'international' | 'national' | 'e164' | 'digits' = 'international'
  ): string {
    if (!phone) {
      return '';
    }

    const digits = phone.replace(/\D/g, '');
    if (!digits) {
      return '';
    }

    if (format === 'digits') {
      return digits;
    }

    if (format === 'e164') {
      return phone.trim().startsWith('+') ? `+${digits}` : `+1${digits}`;
    }

    // North American 10/11-digit numbers
    if (digits.length === 10) {
      const area = digits.slice(0, 3);
      const prefix = digits.slice(3, 6);
      const line = digits.slice(6);
      if (format === 'national') {
        return `(${area}) ${prefix}-${line}`;
      }
      return `+1 (${area}) ${prefix}-${line}`;
    }

    if (digits.length === 11 && digits.startsWith('1')) {
      const area = digits.slice(1, 4);
      const prefix = digits.slice(4, 7);
      const line = digits.slice(7);
      if (format === 'national') {
        return `(${area}) ${prefix}-${line}`;
      }
      return `+1 (${area}) ${prefix}-${line}`;
    }

    // Generic international chunking
    if (phone.trim().startsWith('+')) {
      return `+${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`.trim();
    }

    return digits;
  }
}

export class GpNameFormat {
  /**
   * Extracts user initials from a full name.
   * e.g. "Graeme Gorman" -> "GG", "John F. Kennedy" -> "JFK"
   */
  public static initials(name: string | null | undefined, maxInitials = 2): string {
    if (!name || typeof name !== 'string') {
      return '';
    }
    const trimmed = name.trim();
    if (!trimmed) {
      return '';
    }

    const words = trimmed.split(/\s+/).filter(Boolean);
    if (words.length === 1) {
      return words[0].slice(0, maxInitials).toUpperCase();
    }

    const initials = words
      .map((w) => w[0])
      .join('')
      .toUpperCase();
    return initials.slice(0, maxInitials);
  }

  /**
   * Formats person name parts according to locale culture conventions.
   * e.g. Japanese/Chinese/Hungarian often places Family Name first.
   */
  public static format(parts: GpNameParts, locale?: string): string {
    const lang = (locale || (typeof navigator !== 'undefined' ? navigator.language : 'en')).split('-')[0].toLowerCase();
    const isFamilyFirst = ['ja', 'zh', 'ko', 'hu', 'vi'].includes(lang);

    const segments: string[] = [];

    if (parts.prefix) {
      segments.push(parts.prefix);
    }

    if (isFamilyFirst) {
      if (parts.familyName) {
        segments.push(parts.familyName);
      }
      if (parts.givenName) {
        segments.push(parts.givenName);
      }
    } else {
      if (parts.givenName) {
        segments.push(parts.givenName);
      }
      if (parts.middleName) {
        segments.push(parts.middleName);
      }
      if (parts.familyName) {
        segments.push(parts.familyName);
      }
    }

    if (parts.suffix) {
      segments.push(parts.suffix);
    }

    return segments.join(' ').trim();
  }
}
