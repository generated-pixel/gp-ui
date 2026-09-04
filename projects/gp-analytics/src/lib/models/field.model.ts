import { AggregationType } from './aggregation-type.model';
import { ColumnFormat } from './column-format.model';
import { DataType } from './data-type.model';
import { LocalizedText, resolveLocalizedText } from './localized-text.model';
import { LocalizedValueMapping } from './localized-value.model';

export interface Field {
  name: string;
  label: LocalizedText;
  dataType: DataType;
  folderId?: string;
  description?: LocalizedText;
  filterable?: boolean;
  sortable?: boolean;
  groupable?: boolean;
  defaultAggregation?: AggregationType;
  defaultFormat?: ColumnFormat;
  valueMapping?: LocalizedValueMapping;
  getDisplayValue?: (value: unknown, locale: string) => string;
}

export function resolveFieldLabel(field: Field, locale = 'en-US'): string {
  return resolveLocalizedText(field.label, locale, field.name);
}

export function resolveFieldDescription(field: Field, locale = 'en-US'): string {
  return resolveLocalizedText(field.description, locale, '');
}
