import { describe, it, expect } from 'vitest';
import { GpListFormat, GpCollator, GpPhoneFormat, GpNameFormat } from './gp-text-format';

describe('GpTextFormat Utilities', () => {
  describe('GpListFormat', () => {
    it('formats array into natural list in English', () => {
      const result = GpListFormat.format(['Apple', 'Banana', 'Orange'], undefined, 'en-US');
      expect(result).toBe('Apple, Banana, and Orange');
    });

    it('formats disjunction list', () => {
      const result = GpListFormat.format(['Yes', 'No', 'Maybe'], { type: 'disjunction' }, 'en-US');
      expect(result).toBe('Yes, No, or Maybe');
    });

    it('formats array into natural list in French', () => {
      const result = GpListFormat.format(['Pomme', 'Banane', 'Orange'], undefined, 'fr-FR');
      expect(result).toBe('Pomme, Banane et Orange');
    });

    it('handles empty and single element lists', () => {
      expect(GpListFormat.format([])).toBe('');
      expect(GpListFormat.format(['Apple'])).toBe('Apple');
    });
  });

  describe('GpCollator', () => {
    it('sorts strings with numeric awareness', () => {
      const items = ['file10.txt', 'file2.txt', 'file1.txt', 'file20.txt'];
      const sorted = GpCollator.sort(items);
      expect(sorted).toEqual(['file1.txt', 'file2.txt', 'file10.txt', 'file20.txt']);
    });

    it('sorts objects using a selector function', () => {
      const users = [{ name: 'Zara' }, { name: 'Adam' }, { name: 'Charlie' }];
      const sorted = GpCollator.sort(users, (u) => u.name);
      expect(sorted.map((u) => u.name)).toEqual(['Adam', 'Charlie', 'Zara']);
    });

    it('handles localized accents', () => {
      // In Swedish, å and ö are sorted after z
      const comp = GpCollator.compare('z', 'ö', undefined, 'sv-SE');
      expect(comp).toBeLessThan(0);
    });
  });

  describe('GpPhoneFormat', () => {
    it('formats 10-digit North American phone numbers', () => {
      expect(GpPhoneFormat.format('5551234567', 'national')).toBe('(555) 123-4567');
      expect(GpPhoneFormat.format('5551234567', 'international')).toBe('+1 (555) 123-4567');
    });

    it('cleans phone numbers to raw digits', () => {
      expect(GpPhoneFormat.clean('+1 (555) 123-4567')).toBe('+15551234567');
    });
  });

  describe('GpNameFormat', () => {
    it('extracts initials accurately', () => {
      expect(GpNameFormat.initials('Graeme Gorman')).toBe('GG');
      expect(GpNameFormat.initials('John Fitzgerald Kennedy', 3)).toBe('JFK');
      expect(GpNameFormat.initials('Madonna')).toBe('MA');
    });

    it('formats names with locale ordering (Western vs Eastern)', () => {
      const parts = { givenName: 'Taro', familyName: 'Yamada' };
      expect(GpNameFormat.format(parts, 'en-US')).toBe('Taro Yamada');
      expect(GpNameFormat.format(parts, 'ja-JP')).toBe('Yamada Taro');
    });
  });
});
