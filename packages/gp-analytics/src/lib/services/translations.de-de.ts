import { TranslationKey } from '../types/translation-key.type';
import { GERMAN_TRANSLATIONS } from './translations.de';

/**
 * German (Germany) (de-DE) regional translation pack.
 * Inherits all standard German translations with de-DE locale conventions.
 */
export const GERMAN_DE_TRANSLATIONS: Record<TranslationKey, string> = {
  ...GERMAN_TRANSLATIONS
};
