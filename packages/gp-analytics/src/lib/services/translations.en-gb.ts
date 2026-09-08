import { TranslationKey } from '../types/translation-key.type';

/**
 * British English (en-GB) regional translation pack.
 * Inherits default en-US translations with British English spellings and conventions.
 */
export const ENGLISH_GB_TRANSLATIONS: Partial<Record<TranslationKey, string>> = {
  metadataCatalogue: 'Metadata catalogue',
  metadataTree: 'Metadata catalogue',
  browseMetadata: 'Browse your metadata',
  foundationIntro: 'Tables, fields, joins, and localised display values in one inspectable model.',
  selectedFieldDetails: 'Configure how this field behaves in your dataset',
  translatedList: 'Localised Lookup List'
};
