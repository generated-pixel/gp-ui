/**
 * Configuration for a registered language or regional dialect.
 */
export interface GpLanguageConfig {
  /**
   * BCP 47 language code (e.g. 'en-US', 'fr-FR', 'fr-CA', 'de-DE', 'pt-BR').
   */
  code: string;

  /**
   * Optional translation key/value dictionary for this language.
   */
  translations?: Partial<Record<string, string>>;
}
