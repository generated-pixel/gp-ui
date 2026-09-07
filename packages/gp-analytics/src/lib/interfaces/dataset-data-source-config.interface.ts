import { DatasetDataSourceType } from '../types/dataset-data-source-type.type';

export interface DatasetDataSourceConfig {
  type: DatasetDataSourceType;
  file?: File;
  fileName?: string;
  url?: string;
  headers?: Record<string, string>;
  rawJson?: string;
  dataPath?: string;
}
