import { AggregationType } from './aggregation-type.model';
import { DataType, FieldType } from './data-type.model';
import { FieldValue } from './field-value.model';
import { LocalizedValue } from './localized-value.model';

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
  /**
   * Predefined or discrete list of values with localized display names for filtering and selection.
   */
  lookupValues?: FieldValue<string>[];
}
