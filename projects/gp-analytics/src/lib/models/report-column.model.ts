import { AggregationType } from './aggregation-type.model';
import { ColumnFormat } from './column-format.model';
import { DataType } from './data-type.model';
import { Field } from './field.model';

export interface ReportColumn {
  key: string;
  label: string;
  dataType: DataType;
  format?: ColumnFormat;
  aggregation?: AggregationType;
  field?: Field;
}
