import { DatasetField } from './dataset-field.interface';

export interface FieldListSection {
  id: string;
  title: string;
  icon: string;
  fields: { field: DatasetField; globalIndex: number }[];
}
