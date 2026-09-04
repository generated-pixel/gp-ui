export type DataType = 'string' | 'number' | 'date' | 'boolean';

export type AggregationType = 'none' | 'sum' | 'avg' | 'min' | 'max' | 'count' | 'countDistinct';

export type SortDirection = 'asc' | 'desc';

export type DesignerArtifactType = 'tabular' | 'graph' | 'kpi';

export type GraphVisualizationType =
  | 'bar'
  | 'column'
  | 'stacked-bar'
  | 'stacked-column'
  | 'pie'
  | 'radial';

export type ColumnFormat =
  | 'default'
  | 'number-0'
  | 'number-2'
  | 'currency'
  | 'percent'
  | 'date-short'
  | 'date-long';

export type GraphFieldRole = 'x-axis' | 'y-axis' | 'series' | 'tooltip';

export type KpiFieldRole = 'value' | 'compare';

export interface Field {
  name: string;
  label: string;
  dataType: DataType;
  folderId?: string;
  description?: string;
  filterable?: boolean;
  sortable?: boolean;
  groupable?: boolean;
  defaultAggregation?: AggregationType;
  defaultFormat?: ColumnFormat;
}

export interface DatasetFolder {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  fields: Field[];
}

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
  filterValue?: string | number | boolean;
  filterOperator?: 'eq' | 'neq' | 'gt' | 'lt' | 'gte' | 'lte' | 'contains';
}

export interface DesignerSelectionState {
  title: string;
  description?: string;
  artifactType: DesignerArtifactType;
  graphType?: GraphVisualizationType;
  fields: SelectedField[];
}

export interface ReportRow {
  [key: string]: unknown;
}

export interface ReportColumn {
  key: string;
  label: string;
  dataType: DataType;
  format?: ColumnFormat;
  aggregation?: AggregationType;
}

export interface ReportDataPoint {
  key: string;
  label: string;
  value: number | string | boolean | null;
  formattedValue: string;
  role?: string;
  color?: string;
}

export interface GeneratedReport {
  id: string;
  title: string;
  description?: string;
  artifactType: DesignerArtifactType;
  graphType?: GraphVisualizationType;
  generatedAt: Date;
  columns: ReportColumn[];
  rows: ReportRow[];
  dataPoints: ReportDataPoint[];
  summary: {
    totalRows: number;
    metricsSummary?: Record<string, number | string>;
  };
  rawDefinition: DesignerSelectionState;
}
