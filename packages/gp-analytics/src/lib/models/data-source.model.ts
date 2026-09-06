import { DatasetField } from './dataset-field.model';

export type DatasetDataSourceType = 'simulated' | 'file' | 'api' | 'json' | 'custom';

export interface DatasetDataSourceConfig {
  type: DatasetDataSourceType;
  file?: File;
  fileName?: string;
  url?: string;
  headers?: Record<string, string>;
  rawJson?: string;
  dataPath?: string; // Optional dot-path to target array (e.g. 'data.items' or 'value')
}

export interface LoadedDataResult {
  sourceType: DatasetDataSourceType;
  sourceName: string;
  records: Record<string, any>[];
  totalRecords: number;
  matchedFields: string[];
  unmatchedFields: string[];
  timestamp: string;
}

export type CustomDataLoaderFn = (
  config: DatasetDataSourceConfig,
  context: { fields: DatasetField[] },
) => Promise<Record<string, any>[] | LoadedDataResult>;
