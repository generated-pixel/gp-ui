/**
 * Definition for a user-defined custom term/phrase with multi-language translations.
 */
export interface GpTranslationTerm {
  /**
   * Unique term identifier key (e.g. 'grossProfitMargin', 'deptEngineering', 'customerLifetimeValue').
   */
  key: string;

  /**
   * Optional category grouping for organization (e.g. 'Financial Metrics', 'Field Labels', 'Report Headers').
   */
  category?: string;

  /**
   * Contextual description or usage guidelines for translators.
   */
  description?: string;

  /**
   * Map of locale codes to translated strings.
   * e.g. { 'en-US': 'Gross Profit Margin', 'fr-FR': 'Marge brute', 'de-DE': 'Bruttogewinnmarge' }
   */
  translations: Record<string, string | undefined>;

  /**
   * Fallback string to use if neither the active locale nor en-US translation is available.
   */
  defaultValue?: string;

  /**
   * Whether this term was dynamically registered by the user or consuming app.
   */
  isCustom?: boolean;
}
