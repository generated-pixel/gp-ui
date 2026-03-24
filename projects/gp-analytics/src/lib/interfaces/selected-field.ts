import { Field } from './field';

export type AggregationType = 'none' | 'sum' | 'avg' | 'min' | 'max' | 'count' | 'countDistinct';

export type SortDirection = 'asc' | 'desc';

export type DesignerArtifactType = 'tabular' | 'graph' | 'kpi';

export type GraphVisualizationType =
  | 'pie'
  | 'bar'
  | 'stacked-bar'
  | 'column'
  | 'stacked-column'
  | 'radial';

export type GraphFieldRole = 'x-axis' | 'y-axis' | 'series' | 'tooltip';

export type KpiFieldRole = 'value' | 'compare';

export type ColumnFormat =
  | 'default'
  | 'number-0'
  | 'number-2'
  | 'currency'
  | 'percent'
  | 'compact'
  | 'date-short'
  | 'date-long';

export interface SelectedField {
  field: Field;
  alias?: string;
  aggregation: AggregationType;
  groupBy: boolean;
  sortDirection?: SortDirection;
  sortPriority?: number;
  graphRole?: GraphFieldRole;
  kpiRole?: KpiFieldRole;
  columnFormat?: ColumnFormat;
}

export interface DesignerSelectionState {
  artifactType: DesignerArtifactType;
  graphType?: GraphVisualizationType;
  fields: SelectedField[];
}
