import { Injectable, signal } from '@angular/core';

export type SupportedLocale = 'en' | 'fr';
export type TranslationKey =
  | 'metadataCatalogue'
  | 'schemaExplorer'
  | 'browseMetadata'
  | 'expandInstructions'
  | 'grouping'
  | 'metadataTree'
  | 'noVisibleFields'
  | 'noMetadataGroups'
  | 'valueSeparation'
  | 'oneValueManyDisplays'
  | 'storedValue'
  | 'english'
  | 'french'
  | 'language'
  | 'foundationIntro';

type TranslationParams = Record<string, number | string>;

const translations: Record<SupportedLocale, Record<TranslationKey, string>> = {
  en: {
    metadataCatalogue: 'Metadata catalogue',
    schemaExplorer: 'Schema explorer',
    browseMetadata: 'Browse your metadata',
    expandInstructions: 'Expand a group, then a table',
    grouping: 'Grouping',
    metadataTree: 'Metadata catalogue',
    noVisibleFields: 'No visible fields',
    noMetadataGroups: 'No metadata groups available.',
    valueSeparation: 'Value separation',
    oneValueManyDisplays: 'One value, many display values',
    storedValue: 'Stored value',
    english: 'English',
    french: 'French',
    language: 'Language',
    foundationIntro: 'Tables, fields, joins, and localized display values in one inspectable model.',
  },
  fr: {
    metadataCatalogue: 'Catalogue de métadonnées',
    schemaExplorer: 'Explorateur de schéma',
    browseMetadata: 'Parcourir vos métadonnées',
    expandInstructions: 'Développez un groupe, puis une table',
    grouping: 'Groupe',
    metadataTree: 'Catalogue de métadonnées',
    noVisibleFields: 'Aucun champ visible',
    noMetadataGroups: 'Aucun groupe de métadonnées disponible.',
    valueSeparation: 'Séparation des valeurs',
    oneValueManyDisplays: 'Une valeur, plusieurs affichages',
    storedValue: 'Valeur stockée',
    english: 'Anglais',
    french: 'Français',
    language: 'Langue',
    foundationIntro: 'Tables, champs, jointures et valeurs affichées localisées dans un modèle inspectable.',
  },
};

@Injectable({ providedIn: 'root' })
export class GpTranslationService {
  readonly locale = signal<SupportedLocale>('en');

  setLocale(locale: SupportedLocale): void {
    this.locale.set(locale);
  }

  translate(key: TranslationKey, params: TranslationParams = {}): string {
    let text = translations[this.locale()][key];
    for (const [name, value] of Object.entries(params)) {
      text = text.replace(`{${name}}`, String(value));
    }
    return text;
  }
}
