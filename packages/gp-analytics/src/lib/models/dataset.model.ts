export * from '../interfaces/dataset.interface';

import { Dataset } from '../interfaces/dataset.interface';

export function createEmptyDataset(name: string = 'New Dataset'): Dataset {
  return {
    datasetId: `dataset_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
    name,
    fields: [],
    filters: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}
