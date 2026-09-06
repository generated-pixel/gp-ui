import { DataType } from '../enums/data-type.enum';
import { FieldType } from '../enums/field-type.enum';
import { AggregationType } from '../types/aggregation-type.type';
import { LocalizedValue } from './localized-value.interface';
import { FieldValue } from '../types/field-value.type';

export interface Field {
  fieldId: string;
  tableId: string;
  fieldGroupingId: string;
  fieldName: string;
  fieldDisplayName: LocalizedValue;
  description?: string;
  dataType: DataType | `${DataType}`;
  fieldType?: FieldType | `${FieldType}`;
  visible: boolean;
  isPrimaryKey: boolean;
  isIndex: boolean;
  isJoinField: boolean;
  usableInReports: boolean;
  filterable: boolean;
  sortable: boolean;
  groupable: boolean;
  format?: string;
  aggregationType?: AggregationType;
  lookupValues?: FieldValue<string>[];
}
