/**
 * Supported locale identifier following BCP 47 language tags (e.g. 'en-US', 'fr-FR', 'en-GB', 'fr-CA').
 * Also accepts short 2-letter ISO 639-1 language codes ('en', 'fr') and any custom locale string.
 */
export type SupportedLocale =
  | 'en-US'
  | 'en-GB'
  | 'fr-FR'
  | 'fr-CA'
  | 'de-DE'
  | 'es-ES'
  | 'ja-JP'
  | 'en'
  | 'es'
  | 'ja'
  | (string & {});
