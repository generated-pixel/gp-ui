import { Grouping } from './grouping.model';
import { Relationship } from './relationship.model';

export type SchemaSourceType = 'file' | 'api' | 'json' | 'preset';

export interface SchemaSourceConfig {
  type: SchemaSourceType;
  file?: File;
  fileName?: string;
  url?: string;
  headers?: Record<string, string>;
  rawJson?: string;
  presetId?: string;
  dataPath?: string;
}

export interface SchemaPreset {
  id: string;
  name: string;
  description: string;
  icon?: string;
  groupings: Grouping[];
  relationships?: Relationship[];
}

export interface LoadedSchemaResult {
  groupings: Grouping[];
  relationships?: Relationship[];
  sourceType: SchemaSourceType;
  sourceName: string;
  totalTables: number;
  totalFields: number;
}
