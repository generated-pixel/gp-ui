import { Field } from './field.model';

export interface FieldGrouping {
  fieldGroupingId: string;
  fieldGroupingName: string;
  tableId: string;
  fields: Field[];
}
