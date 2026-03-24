export type FieldDataType =
  | 'string'
  | 'number'
  | 'integer'
  | 'boolean'
  | 'date'
  | 'datetime'
  | 'time';

export interface Field {
  name: string;
  label?: string;
  dataType: FieldDataType;
  filterable?: boolean;
  sortable?: boolean;
  groupable?: boolean;
  hidden?: boolean;
  description?: string;
}
