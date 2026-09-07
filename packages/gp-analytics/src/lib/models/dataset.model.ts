export * from '../interfaces/dataset.interface';

import { Dataset } from '../interfaces/dataset.interface';
import { UniqueId } from '../utils/unique-id';

export function createEmptyDataset(name: string = 'New Dataset'): Dataset {
  return {
    datasetId: UniqueId.generate('dataset_'),
    name,
    fields: [],
    filters: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}
