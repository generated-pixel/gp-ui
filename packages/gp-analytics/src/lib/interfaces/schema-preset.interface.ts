import { Grouping } from './grouping.interface';
import { Relationship } from './relationship.interface';

export interface SchemaPreset {
  id: string;
  name: string;
  description: string;
  icon?: string;
  groupings: Grouping[];
  relationships?: Relationship[];
}
