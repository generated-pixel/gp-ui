/**
 * A localizable text string that can be either:
 * 1. A simple string fallback, or
 * 2. An object mapping locale codes (e.g. 'en', 'en-US', 'fr', 'de') to localized strings.
 */
export type LocalizedText = string | Record<string, string>;

/**
 * Resolves a LocalizedText value based on the requested locale.
 * Performs intelligent fallback:
 * 1. Exact match (e.g. 'fr-FR')
 * 2. Language match (e.g. 'fr')
 * 3. Default 'en' or first available translation
 * 4. Fallback string if provided
 */
export function resolveLocalizedText(
  text: LocalizedText | undefined | null,
  locale = 'en-US',
  fallback = '',
): string {
  if (text === undefined || text === null) return fallback;
  if (typeof text === 'string') return text;

  // Exact match
  if (text[locale]) return text[locale];

  // Base language code match (e.g. 'fr-FR' -> 'fr')
  const baseLang = locale.split('-')[0]?.toLowerCase();
  if (baseLang && text[baseLang]) return text[baseLang];

  // Check matching prefixes in map
  const matchingKey = Object.keys(text).find(
    (k) => k.toLowerCase() === baseLang || k.toLowerCase().startsWith(`${baseLang}-`),
  );
  if (matchingKey && text[matchingKey]) return text[matchingKey];

  // Fallback to 'en' or first entry
  if (text['en']) return text['en'];
  const firstKey = Object.keys(text)[0];
  if (firstKey && text[firstKey]) return text[firstKey];

  return fallback;
}
