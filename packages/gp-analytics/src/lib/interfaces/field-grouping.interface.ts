import { LocalizedValue } from './localized-value.interface';
import { Field } from './field.interface';

export interface FieldGrouping {
  fieldGroupingId: string;
  tableId: string;
  fieldGroupingName: string;
  fields: Field[];
  name?: string;
  displayName?: LocalizedValue;
  description?: LocalizedValue;
  icon?: string;
  displayOrder?: number;
}
