/**
 * Configuration metadata for a registered language or regional dialect.
 */
export interface GpLanguageConfig {
  /**
   * BCP 47 language code (e.g. 'en-US', 'fr-FR', 'fr-CA', 'de-DE', 'pt-BR').
   */
  code: string;

  /**
   * Human-readable display name (e.g. 'English (US)', 'Português (Brasil)').
   */
  name: string;

  /**
   * Optional emoji flag or icon identifier (e.g. '🇺🇸', '🇧🇷').
   */
  flag?: string;

  /**
   * Text direction: 'ltr' (default) or 'rtl'.
   */
  direction?: 'ltr' | 'rtl';

  /**
   * Default ISO currency code for this locale (e.g. 'USD', 'EUR', 'BRL').
   */
  currency?: string;

  /**
   * Optional initial translation key/value dictionary for this language.
   */
  translations?: Partial<Record<string, string>>;

  /**
   * Whether this language was dynamically registered by the user or consuming app.
   */
  isCustom?: boolean;
}
