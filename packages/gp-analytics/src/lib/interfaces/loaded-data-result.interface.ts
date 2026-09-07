import { DatasetDataSourceType } from '../types/dataset-data-source-type.type';

export interface LoadedDataResult {
  sourceType: DatasetDataSourceType;
  sourceName: string;
  records: Record<string, any>[];
  totalRecords: number;
  matchedFields: string[];
  unmatchedFields: string[];
  timestamp: string;
}
