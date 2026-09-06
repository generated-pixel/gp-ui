import { DataType } from '../enums/data-type.enum';
import { FieldType } from '../enums/field-type.enum';
import { AggregationType } from '../types/aggregation-type.type';
import { Field } from './field.interface';
import { FieldValue } from '../types/field-value.type';
import { LocalizedValue } from './localized-value.interface';

export interface DatasetField {
  datasetFieldId: string;
  fieldId: string;
  tableId: string;
  fieldName: string;
  fieldDisplayName: LocalizedValue;
  dataType: DataType | `${DataType}`;
  fieldType?: FieldType | `${FieldType}`;
  format?: string;
  lookupValues?: FieldValue<string>[];
  visible: boolean;
  aggregationType: AggregationType;
  filterable: boolean;
  sortable: boolean;
  groupable: boolean;
  isGrouped?: boolean;
  currencyCode?: string;
  currencyField?: string;
  baseField: Field;
}
