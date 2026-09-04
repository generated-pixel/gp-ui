import { LocalizedText, resolveLocalizedText } from './localized-text.model';

/**
 * Maps raw field values (e.g. status code 'PENDING', country code 'US')
 * to localized display text representations in different languages.
 */
export type LocalizedValueMapping = Record<string | number, LocalizedText>;

/**
 * Resolves the localized display string for a raw data value.
 */
export function resolveDisplayValue(
  rawValue: unknown,
  mapping?: LocalizedValueMapping,
  customResolver?: (val: unknown, locale: string) => string,
  locale = 'en-US',
): string {
  if (rawValue === null || rawValue === undefined) return '';

  if (customResolver) {
    return customResolver(rawValue, locale);
  }

  if (mapping) {
    const key = String(rawValue);
    if (mapping[key] !== undefined) {
      return resolveLocalizedText(mapping[key], locale, key);
    }
  }

  return String(rawValue);
}
