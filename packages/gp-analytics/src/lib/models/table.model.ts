import { FieldGrouping } from './field-grouping.model';

export interface Table {
  tableId: string;
  tableName: string;
  groupingId: string;
  fields: FieldGrouping[];
}
