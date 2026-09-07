/**
 * gp-ui - Locale-Aware DateTime, Timezone, Relative Time & Duration Utilities
 */

export type GpDateTimePreset =
  | 'shortDate'
  | 'mediumDate'
  | 'longDate'
  | 'fullDate'
  | 'shortTime'
  | 'mediumTime'
  | 'longTime'
  | 'short'
  | 'medium'
  | 'long'
  | 'full'
  | 'iso';

export interface GpDateTimeFormatOptions extends Intl.DateTimeFormatOptions {
  /** Standard formatting preset */
  preset?: GpDateTimePreset;
  /** Fallback string if value is null, undefined or invalid (defaults to '') */
  fallback?: string;
}

export interface GpRelativeTimeOptions extends Intl.RelativeTimeFormatOptions {
  /** Fallback string if value is null or undefined (defaults to '') */
  fallback?: string;
  /** Custom base date to compare against. Defaults to now. */
  baseDate?: Date | number | string;
}

export interface GpDurationFormatOptions {
  /** 'long' ("2 hours, 30 minutes"), 'short' ("2 hr, 30 min"), 'narrow' ("2h 30m"), 'digital' ("02:30:00") */
  style?: 'long' | 'short' | 'narrow' | 'digital';
  /** Max unit segments to show (defaults to all non-zero) */
  maxUnits?: number;
  /** Whether input is milliseconds instead of seconds. Defaults to false (seconds) */
  isMilliseconds?: boolean;
  /** Fallback string if value is null/undefined. Defaults to '0s' */
  fallback?: string;
}

export interface GpTimeZoneInfo {
  timeZone: string;
  offsetMinutes: number;
  offsetString: string;
  isDST: boolean;
  abbreviation: string;
}

export type GpDateUnit =
  | 'years'
  | 'quarters'
  | 'months'
  | 'weeks'
  | 'days'
  | 'hours'
  | 'minutes'
  | 'seconds'
  | 'milliseconds';

const PRESET_OPTIONS: Record<GpDateTimePreset, Intl.DateTimeFormatOptions> = {
  shortDate: { year: 'numeric', month: 'numeric', day: 'numeric' },
  mediumDate: { year: 'numeric', month: 'short', day: 'numeric' },
  longDate: { year: 'numeric', month: 'long', day: 'numeric' },
  fullDate: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
  shortTime: { hour: 'numeric', minute: '2-digit' },
  mediumTime: { hour: 'numeric', minute: '2-digit', second: '2-digit' },
  longTime: { hour: 'numeric', minute: '2-digit', second: '2-digit', timeZoneName: 'short' },
  short: { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: '2-digit' },
  medium: { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', second: '2-digit' },
  long: { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit', second: '2-digit', timeZoneName: 'short' },
  full: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit', second: '2-digit', timeZoneName: 'long' },
  iso: {}
};

/** Curated major world time zones */
export const GP_COMMON_TIMEZONES = [
  { timeZone: 'UTC', label: 'UTC (Coordinated Universal Time)', city: 'UTC', region: 'Global' },
  { timeZone: 'Europe/London', label: 'London, Dublin (GMT/BST)', city: 'London', region: 'Europe' },
  { timeZone: 'Europe/Paris', label: 'Paris, Berlin, Rome, Madrid (CET/CEST)', city: 'Paris', region: 'Europe' },
  { timeZone: 'Europe/Athens', label: 'Athens, Bucharest, Helsinki (EET/EEST)', city: 'Athens', region: 'Europe' },
  { timeZone: 'America/New_York', label: 'New York, Toronto, Miami (EST/EDT)', city: 'New York', region: 'Americas' },
  { timeZone: 'America/Chicago', label: 'Chicago, Dallas, Mexico City (CST/CDT)', city: 'Chicago', region: 'Americas' },
  { timeZone: 'America/Denver', label: 'Denver, Phoenix, Calgary (MST/MDT)', city: 'Denver', region: 'Americas' },
  { timeZone: 'America/Los_Angeles', label: 'Los Angeles, San Francisco, Vancouver (PST/PDT)', city: 'Los Angeles', region: 'Americas' },
  { timeZone: 'America/Sao_Paulo', label: 'São Paulo, Rio de Janeiro (BRT)', city: 'São Paulo', region: 'Americas' },
  { timeZone: 'Asia/Dubai', label: 'Dubai, Abu Dhabi, Muscat (GST)', city: 'Dubai', region: 'Middle East' },
  { timeZone: 'Asia/Kolkata', label: 'Mumbai, New Delhi, Bengaluru (IST)', city: 'Kolkata', region: 'Asia' },
  { timeZone: 'Asia/Singapore', label: 'Singapore, Kuala Lumpur (SGT)', city: 'Singapore', region: 'Asia' },
  { timeZone: 'Asia/Tokyo', label: 'Tokyo, Osaka (JST)', city: 'Tokyo', region: 'Asia' },
  { timeZone: 'Australia/Sydney', label: 'Sydney, Melbourne (AEST/AEDT)', city: 'Sydney', region: 'Oceania' },
  { timeZone: 'Pacific/Auckland', label: 'Auckland, Wellington (NZST/NZDT)', city: 'Auckland', region: 'Oceania' }
];

/**
 * Enterprise date, time, timezone, duration, and calendar calculation utility.
 */
export class GpDateTimeFormat {
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
   * Resolves system or user time zone.
   */
  public static defaultTimeZone(): string {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    } catch {
      return 'UTC';
    }
  }

  /**
   * Coerces any Date-like input into a valid Date object.
   */
  public static toDate(value: Date | number | string | null | undefined): Date | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }
    if (value instanceof Date) {
      return isNaN(value.getTime()) ? null : value;
    }
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }

  /**
   * Formats a date according to preset or Intl.DateTimeFormatOptions with optional timezone and locale.
   */
  public static format(
    dateInput: Date | number | string | null | undefined,
    presetOrOptions?: GpDateTimePreset | GpDateTimeFormatOptions,
    locale?: string,
    timeZone?: string
  ): string {
    const d = this.toDate(dateInput);
    const targetLocale = locale || this.defaultLocale();

    let options: GpDateTimeFormatOptions = {};
    if (typeof presetOrOptions === 'string') {
      options = { preset: presetOrOptions };
    } else if (presetOrOptions) {
      options = presetOrOptions;
    }

    if (!d) {
      return options.fallback ?? '';
    }

    if (options.preset === 'iso') {
      return d.toISOString();
    }

    let intlOptions: Intl.DateTimeFormatOptions = {};
    if (options.preset && PRESET_OPTIONS[options.preset]) {
      intlOptions = { ...PRESET_OPTIONS[options.preset] };
    }

    // Overlay any custom options
    const { preset, fallback, ...customOptions } = options;
    intlOptions = { ...intlOptions, ...customOptions };

    if (timeZone) {
      intlOptions.timeZone = timeZone;
    }

    try {
      return new Intl.DateTimeFormat(targetLocale, intlOptions).format(d);
    } catch {
      return d.toLocaleString(targetLocale);
    }
  }

  /**
   * Formats a date range between two dates (e.g. "Jan 10 – 15, 2026").
   */
  public static formatRange(
    start: Date | number | string | null | undefined,
    end: Date | number | string | null | undefined,
    options?: GpDateTimeFormatOptions,
    locale?: string,
    timeZone?: string
  ): string {
    const startDate = this.toDate(start);
    const endDate = this.toDate(end);
    if (!startDate || !endDate) {
      return options?.fallback ?? '';
    }

    const targetLocale = locale || this.defaultLocale();
    let intlOptions: Intl.DateTimeFormatOptions = {};

    if (options?.preset && PRESET_OPTIONS[options.preset]) {
      intlOptions = { ...PRESET_OPTIONS[options.preset] };
    }
    const { preset, fallback, ...customOptions } = options || {};
    intlOptions = { ...intlOptions, ...customOptions };

    if (timeZone) {
      intlOptions.timeZone = timeZone;
    }

    try {
      const formatter = new Intl.DateTimeFormat(targetLocale, intlOptions);
      if (typeof (formatter as any).formatRange === 'function') {
        return (formatter as any).formatRange(startDate, endDate);
      }
      return `${formatter.format(startDate)} – ${formatter.format(endDate)}`;
    } catch {
      return `${startDate.toLocaleDateString()} – ${endDate.toLocaleDateString()}`;
    }
  }

  /**
   * Formats a date as relative time (e.g. "3 minutes ago", "in 2 hours", "yesterday").
   */
  public static formatRelative(
    dateInput: Date | number | string | null | undefined,
    options?: GpRelativeTimeOptions,
    locale?: string
  ): string {
    const d = this.toDate(dateInput);
    if (!d) {
      return options?.fallback ?? '';
    }

    const base = this.toDate(options?.baseDate) ?? new Date();
    const targetLocale = locale || this.defaultLocale();
    const diffSeconds = Math.round((d.getTime() - base.getTime()) / 1000);

    const intlOptions: Intl.RelativeTimeFormatOptions = {
      numeric: options?.numeric ?? 'auto',
      style: options?.style ?? 'long',
      ...options
    };

    let rtf: Intl.RelativeTimeFormat;
    try {
      rtf = new Intl.RelativeTimeFormat(targetLocale, intlOptions);
    } catch {
      rtf = new Intl.RelativeTimeFormat('en-US', intlOptions);
    }

    const absDiff = Math.abs(diffSeconds);

    if (absDiff < 45) {
      return rtf.format(diffSeconds, 'second');
    }
    const diffMinutes = Math.round(diffSeconds / 60);
    if (Math.abs(diffMinutes) < 45) {
      return rtf.format(diffMinutes, 'minute');
    }
    const diffHours = Math.round(diffSeconds / 3600);
    if (Math.abs(diffHours) < 22) {
      return rtf.format(diffHours, 'hour');
    }
    const diffDays = Math.round(diffSeconds / 86400);
    if (Math.abs(diffDays) < 26) {
      return rtf.format(diffDays, 'day');
    }
    const diffMonths = Math.round(diffSeconds / (86400 * 30.4375));
    if (Math.abs(diffMonths) < 11) {
      return rtf.format(diffMonths, 'month');
    }
    const diffYears = Math.round(diffSeconds / (86400 * 365.25));
    return rtf.format(diffYears, 'year');
  }

  /**
   * Formats a duration in seconds (or ms) into localized human-readable units or digital clock format.
   * e.g. 3665 -> "1 hour, 1 minute, 5 seconds", or "01:01:05", or "1h 1m 5s"
   */
  public static formatDuration(
    duration: number | null | undefined,
    options?: GpDurationFormatOptions,
    locale?: string
  ): string {
    if (duration === null || duration === undefined || isNaN(duration) || duration < 0) {
      return options?.fallback ?? '0s';
    }

    let totalSeconds = options?.isMilliseconds ? Math.floor(duration / 1000) : Math.floor(duration);
    const style = options?.style ?? 'long';
    const maxUnits = options?.maxUnits ?? 3;

    if (style === 'digital') {
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      const pad = (n: number) => n.toString().padStart(2, '0');
      if (hours > 0) {
        return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
      }
      return `${pad(minutes)}:${pad(seconds)}`;
    }

    const days = Math.floor(totalSeconds / 86400);
    totalSeconds %= 86400;
    const hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const parts: { value: number; unit: string; unitName: string }[] = [];
    if (days > 0) parts.push({ value: days, unit: 'day', unitName: 'day' });
    if (hours > 0) parts.push({ value: hours, unit: 'hour', unitName: 'hour' });
    if (minutes > 0) parts.push({ value: minutes, unit: 'minute', unitName: 'minute' });
    if (seconds > 0 || parts.length === 0) parts.push({ value: seconds, unit: 'second', unitName: 'second' });

    const selectedParts = parts.slice(0, maxUnits);
    const targetLocale = locale || this.defaultLocale();

    if (style === 'narrow') {
      return selectedParts.map((p) => `${p.value}${p.unitName[0]}`).join(' ');
    }

    // Localized unit formatting via Intl.NumberFormat
    try {
      const nf = new Intl.NumberFormat(targetLocale, {
        style: 'unit',
        unit: 'second',
        unitDisplay: style === 'short' ? 'short' : 'long'
      });

      const formatted = selectedParts.map((p) => {
        return new Intl.NumberFormat(targetLocale, {
          style: 'unit',
          unit: p.unitName,
          unitDisplay: style === 'short' ? 'short' : 'long'
        }).format(p.value);
      });

      // Join parts naturally using Intl.ListFormat if available
      if (typeof (Intl as any).ListFormat === 'function') {
        const lf = new (Intl as any).ListFormat(targetLocale, {
          style: style === 'short' ? 'narrow' : 'long',
          type: 'conjunction'
        });
        return lf.format(formatted);
      }

      return formatted.join(', ');
    } catch {
      return selectedParts.map((p) => `${p.value} ${p.unitName}${p.value > 1 ? 's' : ''}`).join(', ');
    }
  }

  /**
   * Retrieves accurate timezone offset, daylight saving status, and abbreviation.
   */
  public static getTimeZoneOffset(timeZone: string, dateInput?: Date | number | string): GpTimeZoneInfo {
    const d = this.toDate(dateInput) ?? new Date();

    try {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone,
        timeZoneName: 'shortOffset',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
      });

      const parts = formatter.formatToParts(d);
      const tzPart = parts.find((p) => p.type === 'timeZoneName')?.value ?? 'GMT';

      // Parse offset string e.g. GMT+5:30, GMT-4, GMT
      let offsetMinutes = 0;
      let offsetString = 'Z';

      const match = tzPart.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
      if (match) {
        const sign = match[1] === '-' ? -1 : 1;
        const hours = parseInt(match[2], 10);
        const mins = match[3] ? parseInt(match[3], 10) : 0;
        offsetMinutes = sign * (hours * 60 + mins);

        const pad = (n: number) => n.toString().padStart(2, '0');
        offsetString = offsetMinutes === 0 ? 'Z' : `${match[1]}${pad(hours)}:${pad(mins)}`;
      }

      // Check DST by comparing offsets in January and July for this timezone
      const jan = new Date(d.getFullYear(), 0, 1);
      const jul = new Date(d.getFullYear(), 6, 1);
      const janOffset = this.getTzMinuteOffset(timeZone, jan);
      const julOffset = this.getTzMinuteOffset(timeZone, jul);
      const isDST = janOffset !== julOffset && offsetMinutes === Math.max(janOffset, julOffset);

      // Abbreviation
      const abbrFormatter = new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'short' });
      const abbrPart = abbrFormatter.formatToParts(d).find((p) => p.type === 'timeZoneName')?.value || tzPart;

      return {
        timeZone,
        offsetMinutes,
        offsetString,
        isDST,
        abbreviation: abbrPart
      };
    } catch {
      return {
        timeZone,
        offsetMinutes: 0,
        offsetString: 'Z',
        isDST: false,
        abbreviation: 'UTC'
      };
    }
  }

  private static getTzMinuteOffset(timeZone: string, d: Date): number {
    try {
      const parts = new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'shortOffset' }).formatToParts(d);
      const tzPart = parts.find((p) => p.type === 'timeZoneName')?.value ?? '';
      const match = tzPart.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
      if (match) {
        const sign = match[1] === '-' ? -1 : 1;
        return sign * (parseInt(match[2], 10) * 60 + (match[3] ? parseInt(match[3], 10) : 0));
      }
      return 0;
    } catch {
      return 0;
    }
  }

  /**
   * Converts a given Date representation to another IANA time zone.
   */
  public static toTimeZone(dateInput: Date | number | string, targetTimeZone: string): Date {
    const d = this.toDate(dateInput) ?? new Date();
    const str = d.toLocaleString('en-US', { timeZone: targetTimeZone });
    return new Date(str);
  }

  /**
   * Returns list of common world time zones.
   */
  public static getCommonTimeZones() {
    return GP_COMMON_TIMEZONES;
  }

  /**
   * Robust Date parser supporting ISO strings, epoch milliseconds, and localized dates (YYYY-MM-DD, DD/MM/YYYY, MM/DD/YYYY).
   */
  public static parse(dateString: string | null | undefined, formatHint?: 'YMD' | 'DMY' | 'MDY'): Date | null {
    if (!dateString || typeof dateString !== 'string') {
      return null;
    }
    const trimmed = dateString.trim();
    if (!trimmed) return null;

    // Check epoch
    if (/^\d{10,13}$/.test(trimmed)) {
      const num = parseInt(trimmed, 10);
      const epoch = num < 1e11 ? num * 1000 : num;
      const d = new Date(epoch);
      return isNaN(d.getTime()) ? null : d;
    }

    // Check standard ISO
    const isoDate = new Date(trimmed);
    if (!isNaN(isoDate.getTime()) && (trimmed.includes('T') || trimmed.includes('-'))) {
      // If pure date string like "2026-09-07"
      if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
        const [y, m, day] = trimmed.split('-').map(Number);
        return new Date(y, m - 1, day);
      }
      return isoDate;
    }

    // Match delimited dates e.g. 15/09/2026 or 09/15/2026 or 15.09.2026
    const delimiterMatch = trimmed.match(/^(\d{1,4})[./-](\d{1,2})[./-](\d{1,4})/);
    if (delimiterMatch) {
      const p1 = parseInt(delimiterMatch[1], 10);
      const p2 = parseInt(delimiterMatch[2], 10);
      const p3 = parseInt(delimiterMatch[3], 10);

      let year = 0;
      let month = 0;
      let day = 0;

      if (p1 > 1000) {
        // YMD
        year = p1;
        month = p2;
        day = p3;
      } else if (p3 > 1000) {
        year = p3;
        if (formatHint === 'MDY' || (p1 <= 12 && p2 > 12)) {
          month = p1;
          day = p2;
        } else {
          // Default to DMY for European/international or when p1 > 12
          day = p1;
          month = p2;
        }
      }

      if (year > 0 && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
        const d = new Date(year, month - 1, day);
        return isNaN(d.getTime()) ? null : d;
      }
    }

    return null;
  }

  // --- Calendar Math Helpers ---

  public static add(dateInput: Date | number | string, amount: number, unit: GpDateUnit): Date {
    const d = new Date(this.toDate(dateInput) ?? new Date());
    switch (unit) {
      case 'years': d.setFullYear(d.getFullYear() + amount); break;
      case 'quarters': d.setMonth(d.getMonth() + amount * 3); break;
      case 'months': d.setMonth(d.getMonth() + amount); break;
      case 'weeks': d.setDate(d.getDate() + amount * 7); break;
      case 'days': d.setDate(d.getDate() + amount); break;
      case 'hours': d.setHours(d.getHours() + amount); break;
      case 'minutes': d.setMinutes(d.getMinutes() + amount); break;
      case 'seconds': d.setSeconds(d.getSeconds() + amount); break;
      case 'milliseconds': d.setMilliseconds(d.getMilliseconds() + amount); break;
    }
    return d;
  }

  public static subtract(dateInput: Date | number | string, amount: number, unit: GpDateUnit): Date {
    return this.add(dateInput, -amount, unit);
  }

  public static diff(
    date1: Date | number | string,
    date2: Date | number | string,
    unit: GpDateUnit = 'days'
  ): number {
    const d1 = this.toDate(date1) ?? new Date();
    const d2 = this.toDate(date2) ?? new Date();
    const msDiff = d1.getTime() - d2.getTime();

    switch (unit) {
      case 'milliseconds': return msDiff;
      case 'seconds': return Math.round(msDiff / 1000);
      case 'minutes': return Math.round(msDiff / 60000);
      case 'hours': return Math.round(msDiff / 3600000);
      case 'days': return Math.round(msDiff / 86400000);
      case 'weeks': return Math.round(msDiff / 604800000);
      case 'months': return (d1.getFullYear() - d2.getFullYear()) * 12 + (d1.getMonth() - d2.getMonth());
      case 'years': return d1.getFullYear() - d2.getFullYear();
      case 'quarters': return ((d1.getFullYear() - d2.getFullYear()) * 12 + (d1.getMonth() - d2.getMonth())) / 3;
    }
  }

  public static startOf(dateInput: Date | number | string, unit: 'day' | 'week' | 'month' | 'quarter' | 'year'): Date {
    const d = new Date(this.toDate(dateInput) ?? new Date());
    switch (unit) {
      case 'day':
        d.setHours(0, 0, 0, 0);
        break;
      case 'week':
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() - d.getDay());
        break;
      case 'month':
        d.setHours(0, 0, 0, 0);
        d.setDate(1);
        break;
      case 'quarter':
        d.setHours(0, 0, 0, 0);
        d.setDate(1);
        d.setMonth(Math.floor(d.getMonth() / 3) * 3);
        break;
      case 'year':
        d.setHours(0, 0, 0, 0);
        d.setMonth(0, 1);
        break;
    }
    return d;
  }

  public static endOf(dateInput: Date | number | string, unit: 'day' | 'week' | 'month' | 'quarter' | 'year'): Date {
    const d = new Date(this.toDate(dateInput) ?? new Date());
    switch (unit) {
      case 'day':
        d.setHours(23, 59, 59, 999);
        break;
      case 'week':
        d.setHours(23, 59, 59, 999);
        d.setDate(d.getDate() + (6 - d.getDay()));
        break;
      case 'month':
        d.setHours(23, 59, 59, 999);
        d.setMonth(d.getMonth() + 1, 0);
        break;
      case 'quarter':
        d.setHours(23, 59, 59, 999);
        d.setMonth(Math.floor(d.getMonth() / 3) * 3 + 3, 0);
        break;
      case 'year':
        d.setHours(23, 59, 59, 999);
        d.setMonth(11, 31);
        break;
    }
    return d;
  }

  public static isBetween(
    target: Date | number | string,
    start: Date | number | string,
    end: Date | number | string,
    inclusive = true
  ): boolean {
    const t = (this.toDate(target) ?? new Date()).getTime();
    const s = (this.toDate(start) ?? new Date()).getTime();
    const e = (this.toDate(end) ?? new Date()).getTime();
    return inclusive ? t >= s && t <= e : t > s && t < e;
  }

  public static isLeapYear(yearOrDate: number | Date): boolean {
    const year = typeof yearOrDate === 'number' ? yearOrDate : yearOrDate.getFullYear();
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  public static getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
  }

  public static businessDaysBetween(startInput: Date | number | string, endInput: Date | number | string): number {
    const start = this.toDate(startInput);
    const end = this.toDate(endInput);
    if (!start || !end) return 0;

    let current = new Date(start);
    const target = new Date(end);
    let count = 0;

    const step = start <= end ? 1 : -1;
    while ((step > 0 && current <= target) || (step < 0 && current >= target)) {
      const dayOfWeek = current.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        count += step;
      }
      current.setDate(current.getDate() + step);
    }

    return count;
  }
}
