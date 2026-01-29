export type Guid = string & { __brand: 'Guid' };

export const Guid = {
  isValid: (value: string): value is Guid => {
    const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return guidRegex.test(value);
  },
  parse: (value: string): Guid => {
    if (Guid.isValid(value)) {
      return value;
    }
    throw new Error(`Value "${value}" is not a valid GUID.`);
  },
};
