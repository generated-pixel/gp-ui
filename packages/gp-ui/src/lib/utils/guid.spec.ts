import { describe, it, expect } from 'vitest';
import { Guid } from './guid';

describe('Guid Utility Class', () => {
  const sampleGuidStr = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d';
  const sampleUpperGuidStr = '9B1DEB4D-3B7D-4BAD-9BDD-2B0D7B3DCB6D';
  const sampleUnhyphenated = '9b1deb4d3b7d4bad9bdd2b0d7b3dcb6d';
  const sampleBraced = '{9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d}';
  const sampleParenthesized = '(9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d)';

  describe('Generation (v4 and v7)', () => {
    it('generates valid RFC 4122 v4 GUIDs', () => {
      const g1 = Guid.newGuid();
      const g2 = Guid.v4();

      expect(Guid.isValid(g1.value)).toBe(true);
      expect(Guid.isValid(g2.value)).toBe(true);
      expect(g1.version).toBe(4);
      expect(g2.version).toBe(4);
      expect(g1.variant).toBe('rfc4122');
      expect(g2.variant).toBe('rfc4122');
      expect(g1.equals(g2)).toBe(false);
    });

    it('generates valid RFC 9562 v7 time-ordered GUIDs', () => {
      const fixedTs = new Date('2026-09-07T15:00:00.123Z').getTime();
      const g7 = Guid.v7(fixedTs);

      expect(Guid.isValid(g7.value)).toBe(true);
      expect(g7.version).toBe(7);
      expect(g7.variant).toBe('rfc4122');

      const extractedDate = g7.getTimestamp();
      expect(extractedDate).toBeTruthy();
      expect(extractedDate?.getTime()).toBe(fixedTs);
    });

    it('generates monotonically increasing v7 GUIDs in rapid succession', () => {
      const guids: Guid[] = [];
      for (let i = 0; i < 10; i++) {
        guids.push(Guid.v7());
      }

      for (let i = 0; i < guids.length - 1; i++) {
        expect(guids[i].compareTo(guids[i + 1])).toBeLessThanOrEqual(0);
      }
    });

    it('returns null timestamp for v4 GUIDs', () => {
      const v4 = Guid.v4();
      expect(v4.getTimestamp()).toBeNull();
    });
  });

  describe('Empty GUID', () => {
    it('handles empty GUID properly', () => {
      const empty = Guid.empty;
      expect(empty.value).toBe(Guid.EMPTY);
      expect(empty.isEmpty).toBe(true);
      expect(empty.version).toBe(0);

      const fromConst = new Guid(Guid.EMPTY);
      expect(fromConst.isEmpty).toBe(true);
      expect(fromConst.equals(Guid.empty)).toBe(true);
    });
  });

  describe('Parsing and Conversion', () => {
    it('parses standard lowercase hyphenated GUID', () => {
      const g = Guid.parse(sampleGuidStr);
      expect(g.value).toBe(sampleGuidStr);
    });

    it('parses uppercase GUID and normalizes to lowercase', () => {
      const g = Guid.parse(sampleUpperGuidStr);
      expect(g.value).toBe(sampleGuidStr);
    });

    it('parses 32-character unhyphenated string', () => {
      const g = Guid.parse(sampleUnhyphenated);
      expect(g.value).toBe(sampleGuidStr);
    });

    it('parses braced and parenthesized GUID strings', () => {
      const g1 = Guid.parse(sampleBraced);
      const g2 = Guid.parse(sampleParenthesized);
      expect(g1.value).toBe(sampleGuidStr);
      expect(g2.value).toBe(sampleGuidStr);
    });

    it('throws TypeError when parsing invalid input', () => {
      expect(() => Guid.parse('invalid-guid')).toThrowError(TypeError);
      expect(() => Guid.parse('12345')).toThrowError(TypeError);
      expect(() => Guid.parse('')).toThrowError(TypeError);
    });

    it('converts to/from byte array', () => {
      const orig = Guid.v4();
      const bytes = orig.toByteArray();
      expect(bytes.length).toBe(16);

      const restored = Guid.fromByteArray(bytes);
      expect(restored.equals(orig)).toBe(true);
      expect(restored.value).toBe(orig.value);
    });
  });

  describe('tryParse and isValid', () => {
    it('tryParse returns Guid for valid string, null for invalid', () => {
      const valid = Guid.tryParse(sampleGuidStr);
      expect(valid).toBeInstanceOf(Guid);
      expect(valid?.value).toBe(sampleGuidStr);

      expect(Guid.tryParse('invalid')).toBeNull();
      expect(Guid.tryParse(null)).toBeNull();
      expect(Guid.tryParse(undefined)).toBeNull();
      expect(Guid.tryParse('')).toBeNull();
    });

    it('tryParse supports out-object overload', () => {
      const out1: { value: Guid | null } = { value: null };
      const success1 = Guid.tryParse(sampleGuidStr, out1);
      expect(success1).toBe(true);
      expect(out1.value).toBeInstanceOf(Guid);
      expect(out1.value?.value).toBe(sampleGuidStr);

      const out2: { value: Guid | null } = { value: null };
      const success2 = Guid.tryParse('invalid', out2);
      expect(success2).toBe(false);
      expect(out2.value).toBeNull();
    });

    it('isValid correctly validates formats', () => {
      expect(Guid.isValid(sampleGuidStr)).toBe(true);
      expect(Guid.isValid(sampleUpperGuidStr)).toBe(true);
      expect(Guid.isValid(sampleUnhyphenated)).toBe(true);
      expect(Guid.isValid(sampleBraced)).toBe(true);
      expect(Guid.isValid(sampleParenthesized)).toBe(true);
      expect(Guid.isValid(Guid.EMPTY)).toBe(true);

      expect(Guid.isValid('not-a-guid')).toBe(false);
      expect(Guid.isValid('9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6')).toBe(false); // short
      expect(Guid.isValid(null)).toBe(false);
      expect(Guid.isValid(undefined)).toBe(false);
    });
  });

  describe('Equality', () => {
    it('evaluates equality across instance and strings', () => {
      const g1 = new Guid(sampleGuidStr);
      const g2 = new Guid(sampleUpperGuidStr);

      expect(g1.equals(g2)).toBe(true);
      expect(g1.equals(sampleGuidStr)).toBe(true);
      expect(g1.equals(sampleUpperGuidStr)).toBe(true);
      expect(g1.equals(sampleUnhyphenated)).toBe(true);
      expect(g1.equals(sampleBraced)).toBe(true);

      expect(g1.equals(Guid.v4())).toBe(false);
      expect(g1.equals(null)).toBe(false);
      expect(g1.equals(undefined)).toBe(false);
    });

    it('static Guid.equals works symmetrically', () => {
      expect(Guid.equals(sampleGuidStr, sampleUpperGuidStr)).toBe(true);
      expect(Guid.equals(sampleGuidStr, sampleUnhyphenated)).toBe(true);
      expect(Guid.equals(sampleBraced, sampleParenthesized)).toBe(true);
      expect(Guid.equals(sampleGuidStr, Guid.EMPTY)).toBe(false);
      expect(Guid.equals(null, null)).toBe(true);
      expect(Guid.equals(null, sampleGuidStr)).toBe(false);
    });
  });

  describe('Formatting & Serialization', () => {
    const g = new Guid(sampleGuidStr);

    it('formats with specifiers', () => {
      expect(g.toString('D')).toBe('9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d');
      expect(g.toString('N')).toBe('9b1deb4d3b7d4bad9bdd2b0d7b3dcb6d');
      expect(g.toString('B')).toBe('{9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d}');
      expect(g.toString('P')).toBe('(9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d)');
      expect(g.toString()).toBe('9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d');
    });

    it('serializes to JSON and string correctly', () => {
      expect(g.toJSON()).toBe(sampleGuidStr);
      expect(JSON.stringify({ id: g })).toBe(`{"id":"${sampleGuidStr}"}`);
      expect(g.valueOf()).toBe(sampleGuidStr);
      expect(`${g}`).toBe(sampleGuidStr);
    });
  });
});
