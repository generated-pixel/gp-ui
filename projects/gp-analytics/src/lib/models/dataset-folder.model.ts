import { Field } from './field.model';
import { LocalizedText, resolveLocalizedText } from './localized-text.model';

export interface DatasetFolder {
  id: string;
  name: LocalizedText;
  description?: LocalizedText;
  icon?: string;
  fields: Field[];
}

export function resolveFolderName(folder: DatasetFolder, locale = 'en-US'): string {
  return resolveLocalizedText(folder.name, locale, folder.id);
}

export function resolveFolderDescription(folder: DatasetFolder, locale = 'en-US'): string {
  return resolveLocalizedText(folder.description, locale, '');
}
