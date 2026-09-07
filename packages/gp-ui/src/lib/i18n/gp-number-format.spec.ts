import { describe, it, expect } from 'vitest';
import { GpNumberFormat } from './gp-number-format';

describe('GpNumberFormat', () => {
  describe('format', () => {
    it('formats basic numbers with English locale', () => {
      const formatted = GpNumberFormat.format(1234567.89, { minimumFractionDigits: 2 }, 'en-US');
      expect(formatted).toBe('1,234,567.89');
    });

    it('formats numbers with German locale (period as group, comma as decimal)', () => {
      const formatted = GpNumberFormat.format(1234567.89, { minimumFractionDigits: 2 }, 'de-DE');
      expect(formatted).toBe('1.234.567,89');
    });

    it('returns fallback for null or undefined', () => {
      expect(GpNumberFormat.format(null, { fallback: '-' })).toBe('-');
      expect(GpNumberFormat.format(undefined, { fallback: 'N/A' })).toBe('N/A');
    });
  });

  describe('parse', () => {
    it('parses US formatted numbers with commas', () => {
      expect(GpNumberFormat.parse('1,234,567.89', 'en-US')).toBe(1234567.89);
    });

    it('parses German formatted numbers with dots and commas', () => {
      expect(GpNumberFormat.parse('1.234.567,89', 'de-DE')).toBe(1234567.89);
    });

    it('auto-detects separators without explicit locale', () => {
      expect(GpNumberFormat.parse('1.234.567,89')).toBe(1234567.89);
      expect(GpNumberFormat.parse('1,234,567.89')).toBe(1234567.89);
    });

    it('parses French space-separated numbers', () => {
      expect(GpNumberFormat.parse('1 234 567,89', 'fr-FR')).toBe(1234567.89);
    });

    it('parses Eastern Arabic / Persian numerals', () => {
      expect(GpNumberFormat.parse('١٢٣٤٫٥٦')).toBe(1234.56);
      expect(GpNumberFormat.parse('۱۲۳۴٫۵۶')).toBe(1234.56);
    });

    it('parses negative accounting format with parentheses', () => {
      expect(GpNumberFormat.parse('(1,234.50)')).toBe(-1234.50);
      expect(GpNumberFormat.parse('-1,234.50')).toBe(-1234.50);
      expect(GpNumberFormat.parse('1,234.50-')).toBe(-1234.50);
    });

    it('parses percentages', () => {
      expect(GpNumberFormat.parse('45.5%')).toBe(45.5);
      expect(GpNumberFormat.parse('45.5%', undefined, { parseAsRatio: true })).toBe(0.455);
    });

    it('parses currency strings with symbols', () => {
      expect(GpNumberFormat.parse('$1,234,567.89')).toBe(1234567.89);
      expect(GpNumberFormat.parse('1.234.567,89 €', 'de-DE')).toBe(1234567.89);
    });
  });

  describe('formatCurrency and convertCurrency', () => {
    it('formats currency with currency symbol', () => {
      const res = GpNumberFormat.formatCurrency(1250.5, 'USD', undefined, 'en-US');
      expect(res).toBe('$1,250.50');
    });

    it('formats EUR in German locale', () => {
      const res = GpNumberFormat.formatCurrency(1250.5, 'EUR', undefined, 'de-DE');
      // In Node/V8, German currency is "1.250,50 €" or similar with non-breaking space
      expect(res).toContain('1.250,50');
      expect(res).toContain('€');
    });

    it('converts currency with exchange rates', () => {
      const converted = GpNumberFormat.convertCurrency(100, 1.0, 0.85, 2);
      expect(converted).toBe(85);
    });
  });

  describe('formatPercent and formatCompact', () => {
    it('formats percentage', () => {
      const res = GpNumberFormat.formatPercent(0.255, undefined, 'en-US');
      expect(res).toBe('25.5%');
    });

    it('formats compact representation', () => {
      const res = GpNumberFormat.formatCompact(1500000, 'short', 'en-US');
      expect(res).toBe('1.5M');
    });
  });

  describe('formatByteSize', () => {
    it('formats bytes into KB and MB', () => {
      expect(GpNumberFormat.formatByteSize(500, undefined, 'en-US')).toBe('500 B');
      expect(GpNumberFormat.formatByteSize(1500, { standard: 'decimal', precision: 1 }, 'en-US')).toBe('1.5 KB');
      expect(GpNumberFormat.formatByteSize(1048576, { standard: 'binary', precision: 1 }, 'en-US')).toBe('1 MiB');
    });
  });

  describe('formatOrdinal', () => {
    it('formats ordinals in English', () => {
      expect(GpNumberFormat.formatOrdinal(1, 'en-US')).toBe('1st');
      expect(GpNumberFormat.formatOrdinal(2, 'en-US')).toBe('2nd');
      expect(GpNumberFormat.formatOrdinal(3, 'en-US')).toBe('3rd');
      expect(GpNumberFormat.formatOrdinal(4, 'en-US')).toBe('4th');
      expect(GpNumberFormat.formatOrdinal(21, 'en-US')).toBe('21st');
    });

    it('formats ordinals in French', () => {
      expect(GpNumberFormat.formatOrdinal(1, 'fr-FR')).toBe('1er');
      expect(GpNumberFormat.formatOrdinal(2, 'fr-FR')).toBe('2e');
    });
  });
});
