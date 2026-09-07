import { SchemaSourceType } from '../types/schema-source-type.type';

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
