import { DatasetField } from './dataset-field.interface';
import { GpFilterCondition } from './gp-filter-condition.interface';

export interface Dataset {
  datasetId: string;
  name: string;
  description?: string;
  fields: DatasetField[];
  filters?: GpFilterCondition[];
  createdAt?: string;
  updatedAt?: string;
}
