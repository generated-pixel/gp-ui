import { DatasetDataSourceConfig } from '../interfaces/dataset-data-source-config.interface';
import { DatasetField } from '../interfaces/dataset-field.interface';
import { LoadedDataResult } from '../interfaces/loaded-data-result.interface';

export type CustomDataLoaderFn = (
  config: DatasetDataSourceConfig,
  context?: { fields: DatasetField[] }
) => Promise<Record<string, any>[] | LoadedDataResult> | Record<string, any>[] | LoadedDataResult;
