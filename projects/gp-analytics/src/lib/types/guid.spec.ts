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
});
