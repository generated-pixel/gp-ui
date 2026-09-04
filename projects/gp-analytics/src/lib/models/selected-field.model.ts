import { AggregationType } from './aggregation-type.model';
import { ColumnFormat } from './column-format.model';
import { Field } from './field.model';
import { FilterMatchTarget, FilterOperator } from './field-filter.model';
import { GraphFieldRole, KpiFieldRole } from './graph-visualization-type.model';
import { LocalizedText } from './localized-text.model';
import { SortDirection } from './sort-direction.model';

export interface SelectedField {
  field: Field;
  alias?: LocalizedText;
  aggregation: AggregationType;
  groupBy: boolean;
  sortDirection?: SortDirection;
  sortPriority?: number;
  graphRole?: GraphFieldRole;
  kpiRole?: KpiFieldRole;
  columnFormat?: ColumnFormat;
  filterValue?: unknown;
  filterOperator?: FilterOperator;
  filterMatchTarget?: FilterMatchTarget;
}
