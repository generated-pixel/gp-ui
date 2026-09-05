import { DatasetField } from './dataset-field.model';

export interface Dataset {
  datasetId: string;
  name: string;
  description?: string;
  fields: DatasetField[];
  createdAt?: string;
  updatedAt?: string;
}

export function createEmptyDataset(name: string = 'New Dataset'): Dataset {
  return {
    datasetId: `dataset_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
    name,
    fields: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
