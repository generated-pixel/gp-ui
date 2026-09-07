import { Grouping } from './grouping.interface';
import { Relationship } from './relationship.interface';
import { SchemaSourceType } from '../types/schema-source-type.type';

export interface LoadedSchemaResult {
  groupings: Grouping[];
  relationships?: Relationship[];
  sourceType: SchemaSourceType;
  sourceName: string;
  totalTables: number;
  totalFields: number;
}
