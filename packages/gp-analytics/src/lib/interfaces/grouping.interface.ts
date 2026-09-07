import { LocalizedValue } from './localized-value.interface';
import { Table } from './table.interface';
import { Relationship } from './relationship.interface';

export interface Grouping {
  groupingId: string;
  name?: string;
  groupingName?: string;
  displayName?: LocalizedValue;
  description?: LocalizedValue;
  icon?: string;
  tables: Table[];
  relationships?: Relationship[];
  displayOrder?: number;
  isExpanded?: boolean;
}
