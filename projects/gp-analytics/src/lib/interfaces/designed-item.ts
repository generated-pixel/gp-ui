import { DesignerArtifactType, GraphVisualizationType, SelectedField } from './selected-field';

export type DesignedItemTone = 'default' | 'muted' | 'accent' | 'success' | 'warning' | 'danger';

export type DesignedItemValueType =
  | 'text'
  | 'number'
  | 'currency'
  | 'percent'
  | 'date'
  | 'datetime'
  | 'boolean';

export interface DesignedItemStyle {
  highlighted?: boolean;
  compact?: boolean;
  tone?: DesignedItemTone;
  borderColor?: string;
  backgroundColor?: string;
  textColor?: string;
}

export interface DesignedItemMetadata {
  id: string;
  name: string;
  artifactType: DesignerArtifactType;
  graphType?: GraphVisualizationType;
  fields: SelectedField[];
  generatedAt?: string;
}

export interface DesignedItemDataPoint {
  key: string;
  label: string;
  value: string | number | boolean | null;
  valueType?: DesignedItemValueType;
  currencyCode?: string;
}

export interface DesignedItemData {
  summary?: string;
  points?: DesignedItemDataPoint[];
  raw?: unknown;
}

export interface DesignedItem {
  metadata: DesignedItemMetadata;
  style?: DesignedItemStyle;
  data: DesignedItemData;
}
