import { Guid } from './guid';

describe('Guid', () => {
  it('should validate a valid GUID', () => {
    const validGuid = '123e4567-e89b-12d3-a456-426614174000';
    expect(Guid.isValid(validGuid)).toBe(true);
  });

  it('should invalidate an invalid GUID', () => {
    const invalidGuid = 'invalid-guid';
    expect(Guid.isValid(invalidGuid)).toBe(false);
  });

  it('should parse a valid GUID', () => {
    const validGuid = '123e4567-e89b-12d3-a456-426614174000';
    const guid = Guid.parse(validGuid);
    expect(guid).toBe(validGuid);
  });

  it('should throw an error when parsing an invalid GUID', () => {
    const invalidGuid = 'invalid-guid';
    expect(() => Guid.parse(invalidGuid)).toThrow();
  });

  describe('tryParse', () => {
    it('should return Guid for valid string', () => {
      const valid = '123e4567-e89b-12d3-a456-426614174000';
      expect(Guid.tryParse(valid)).toBe(valid);
    });

    it('should return undefined for invalid string', () => {
      expect(Guid.tryParse('invalid')).toBeUndefined();
    });

    it('should return undefined for null/undefined', () => {
      expect(Guid.tryParse(null)).toBeUndefined();
      expect(Guid.tryParse(undefined)).toBeUndefined();
    });
  });

  describe('equals', () => {
    it('should return true for identical GUIDs', () => {
      const g1 = '123e4567-e89b-12d3-a456-426614174000';
      expect(Guid.equals(g1, g1)).toBe(true);
    });

    it('should return true for case-insensitive match', () => {
      const g1 = '123e4567-e89b-12d3-a456-426614174000';
      const g2 = '123E4567-E89B-12D3-A456-426614174000';
      expect(Guid.equals(g1, g2)).toBe(true);
    });

    it('should return false for different GUIDs', () => {
      const g1 = '123e4567-e89b-12d3-a456-426614174000';
      const g2 = '00000000-0000-0000-0000-000000000000';
      expect(Guid.equals(g1, g2)).toBe(false);
    });

    it('should handle null/undefined gracefully', () => {
      expect(Guid.equals(null, null)).toBe(true);
      expect(Guid.equals(undefined, undefined)).toBe(true);
      expect(Guid.equals(null, undefined)).toBe(true); // Treating both as empty/falsy check essentially
      expect(Guid.equals('guid', null)).toBe(false);
    });
  });

  describe('isEmpty', () => {
    it('should return true for empty GUID constant', () => {
      expect(Guid.isEmpty(Guid.empty())).toBe(true);
    });

    it('should return true for null/undefined', () => {
      expect(Guid.isEmpty(null)).toBe(true);
      expect(Guid.isEmpty(undefined)).toBe(true);
    });

    it('should return false for non-empty GUID', () => {
      expect(Guid.isEmpty(Guid.new())).toBe(false);
    });
  });

  describe('new', () => {
    it('should generate a valid GUID', () => {
      const guid = Guid.new();
      expect(Guid.isValid(guid)).toBe(true);
      expect(guid).not.toBe(Guid.empty());
    });

    it('should generate unique GUIDs', () => {
      const g1 = Guid.new();
      const g2 = Guid.new();
      expect(g1).not.toBe(g2);
    });
  });
});
