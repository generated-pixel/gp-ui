import { TranslationKey } from '../types/translation-key.type';
import { FRENCH_FR_TRANSLATIONS } from './translations.fr-fr';

/**
 * Canadian French (fr-CA) regional translation pack.
 * Inherits standard French translations with Canadian French localization conventions.
 */
export const FRENCH_CA_TRANSLATIONS: Record<TranslationKey, string> = {
  ...FRENCH_FR_TRANSLATIONS,
  searchFieldsOrTables: 'Chercher des tables et des champs...',
  dragFieldsHere: 'Glisser les champs ici ou cliquer sur + dans le catalogue',
  datasetName: 'Nom du jeu de données',
  clearAll: 'Tout effacer',
  translatedList: 'Liste de correspondance localisée',
  clearAllFilters: 'Effacer tous les filtres'
};
