import { LocalizedValue } from './localized-value.interface';
import { FieldGrouping } from './field-grouping.interface';

export interface Table {
  tableId: string;
  tableName: string;
  groupingId: string;
  fields: FieldGrouping[];
  tableDisplayName?: LocalizedValue;
  description?: LocalizedValue;
  primaryKey?: string[];
  allowCustomFields?: boolean;
  currencyCode?: string;
  currencyField?: string;
}
