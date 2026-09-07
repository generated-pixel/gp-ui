export interface GpSortSpec {
  fieldId: string;
  order: 'asc' | 'desc';
  direction?: 'asc' | 'desc';
  priority?: number;
}
