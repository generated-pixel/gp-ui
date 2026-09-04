import { Relationship } from './relationship.model';
import { Table } from './table.model';

export interface Grouping {
  groupingId: string;
  groupingName: string;
  tables: Table[];
  relationships?: Relationship[];
}
