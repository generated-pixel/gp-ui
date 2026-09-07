import { describe, it, expect } from 'vitest';
import { GpDateTimeFormat } from './gp-date-time-format';

describe('GpDateTimeFormat', () => {
  const testDate = new Date('2026-09-07T14:30:00Z');

  describe('format', () => {
    it('formats date using presets', () => {
      const short = GpDateTimeFormat.format(testDate, 'shortDate', 'en-US', 'UTC');
      expect(short).toBe('9/7/2026');

      const iso = GpDateTimeFormat.format(testDate, 'iso');
      expect(iso).toBe('2026-09-07T14:30:00.000Z');
    });

    it('formats date in specific time zones', () => {
      const tokyo = GpDateTimeFormat.format(testDate, 'shortTime', 'en-US', 'Asia/Tokyo');
      // 14:30 UTC is 23:30 in Tokyo (UTC+9)
      expect(tokyo).toContain('11:30');
      expect(tokyo).toContain('PM');
    });

    it('handles null/undefined gracefully', () => {
      expect(GpDateTimeFormat.format(null, 'shortDate')).toBe('');
      expect(GpDateTimeFormat.format(undefined, { fallback: 'No Date' })).toBe('No Date');
    });
  });

  describe('formatRelative', () => {
    it('formats past and future relative times', () => {
      const base = new Date('2026-09-07T12:00:00Z');
      const past = new Date('2026-09-07T11:55:00Z');
      const future = new Date('2026-09-07T14:00:00Z');

      const pastStr = GpDateTimeFormat.formatRelative(past, { baseDate: base }, 'en-US');
      expect(pastStr).toBe('5 minutes ago');

      const futureStr = GpDateTimeFormat.formatRelative(future, { baseDate: base }, 'en-US');
      expect(futureStr).toBe('in 2 hours');
    });
  });

  describe('formatDuration', () => {
    it('formats duration in long and short format', () => {
      const longStr = GpDateTimeFormat.formatDuration(3665, { style: 'long' }, 'en-US');
      expect(longStr).toContain('1 hour');
      expect(longStr).toContain('1 minute');

      const shortStr = GpDateTimeFormat.formatDuration(3665, { style: 'short' }, 'en-US');
      expect(shortStr).toContain('1 hr');
      expect(shortStr).toContain('1 min');
    });

    it('formats duration in digital format', () => {
      expect(GpDateTimeFormat.formatDuration(65, { style: 'digital' })).toBe('01:05');
      expect(GpDateTimeFormat.formatDuration(3665, { style: 'digital' })).toBe('01:01:05');
    });
  });

  describe('getTimeZoneOffset and toTimeZone', () => {
    it('returns offset info for timezones', () => {
      const info = GpDateTimeFormat.getTimeZoneOffset('UTC', testDate);
      expect(info.timeZone).toBe('UTC');
      expect(info.offsetMinutes).toBe(0);
      expect(info.offsetString).toBe('Z');

      const tokyoInfo = GpDateTimeFormat.getTimeZoneOffset('Asia/Tokyo', testDate);
      expect(tokyoInfo.offsetMinutes).toBe(540); // 9 hours
      expect(tokyoInfo.offsetString).toBe('+09:00');
    });
  });

  describe('parse', () => {
    it('parses ISO date string', () => {
      const parsed = GpDateTimeFormat.parse('2026-09-07');
      expect(parsed).toBeTruthy();
      expect(parsed?.getFullYear()).toBe(2026);
      expect(parsed?.getMonth()).toBe(8); // September is 8 (0-indexed)
      expect(parsed?.getDate()).toBe(7);
    });

    it('parses slash/dash separated date string', () => {
      const parsedDMY = GpDateTimeFormat.parse('25/12/2026');
      expect(parsedDMY?.getDate()).toBe(25);
      expect(parsedDMY?.getMonth()).toBe(11);
      expect(parsedDMY?.getFullYear()).toBe(2026);
    });
  });

  describe('Calendar Math', () => {
    it('adds and subtracts units', () => {
      const d = new Date(2026, 0, 1);
      const afterDays = GpDateTimeFormat.add(d, 5, 'days');
      expect(afterDays.getDate()).toBe(6);

      const afterMonths = GpDateTimeFormat.add(d, 2, 'months');
      expect(afterMonths.getMonth()).toBe(2);

      const subDays = GpDateTimeFormat.subtract(d, 1, 'days');
      expect(subDays.getFullYear()).toBe(2025);
      expect(subDays.getMonth()).toBe(11);
      expect(subDays.getDate()).toBe(31);
    });

    it('calculates diff accurately', () => {
      const d1 = new Date(2026, 0, 10);
      const d2 = new Date(2026, 0, 5);
      expect(GpDateTimeFormat.diff(d1, d2, 'days')).toBe(5);
    });

    it('calculates startOf and endOf', () => {
      const d = new Date(2026, 8, 15, 14, 30, 0);
      const startDay = GpDateTimeFormat.startOf(d, 'day');
      expect(startDay.getHours()).toBe(0);
      expect(startDay.getMinutes()).toBe(0);

      const endDay = GpDateTimeFormat.endOf(d, 'day');
      expect(endDay.getHours()).toBe(23);
      expect(endDay.getMinutes()).toBe(59);
    });

    it('checks leap years', () => {
      expect(GpDateTimeFormat.isLeapYear(2024)).toBe(true);
      expect(GpDateTimeFormat.isLeapYear(2026)).toBe(false);
      expect(GpDateTimeFormat.isLeapYear(2000)).toBe(true);
      expect(GpDateTimeFormat.isLeapYear(1900)).toBe(false);
    });

    it('calculates business days between dates', () => {
      // Mon Sep 7, 2026 to Fri Sep 11, 2026 is 5 business days
      const monday = new Date(2026, 8, 7);
      const friday = new Date(2026, 8, 11);
      expect(GpDateTimeFormat.businessDaysBetween(monday, friday)).toBe(5);
    });
  });
});
