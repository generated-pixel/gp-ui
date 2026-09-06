import { DatasetField } from './dataset-field.model';
import { GpFilterCondition } from './query.model';

export interface Dataset {
  datasetId: string;
  name: string;
  description?: string;
  fields: DatasetField[];
  filters?: GpFilterCondition[];
  createdAt?: string;
  updatedAt?: string;
}

export function createEmptyDataset(name: string = 'New Dataset'): Dataset {
  return {
    datasetId: `dataset_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
    name,
    fields: [],
    filters: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
