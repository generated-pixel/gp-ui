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
  tryParse: (value: string | null | undefined): Guid | undefined => {
    if (!value) {
      return undefined;
    }
    return Guid.isValid(value) ? value : undefined;
  },
  empty: (): Guid => {
    return '00000000-0000-0000-0000-000000000000' as Guid;
  },
  almostEmpty: (): Guid => {
    return Guid.parse(
      '00000000-0000-0000-0000-xxxxxxxxxxxx'.replace(/[xy]/g, (value) => {
        const r = (Math.random() * 16) | 0,
          v = value === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }),
    );
  },
  new: (): Guid => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID() as Guid;
    }
    return Guid.parse(
      'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (value) => {
        const r = (Math.random() * 16) | 0,
          v = value === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }),
    );
  },
  equals: (a: Guid | string | null | undefined, b: Guid | string | null | undefined): boolean => {
    return (a || '').toLowerCase() === (b || '').toLowerCase();
  },
  isEmpty: (id: Guid | string | null | undefined): boolean => {
    return !id || id === Guid.empty();
  },
};
