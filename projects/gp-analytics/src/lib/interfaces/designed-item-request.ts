import { DesignerArtifactType, GraphVisualizationType, SelectedField } from './selected-field';
import { DesignedItemStyle } from './designed-item';

export interface DesignedItemRequest {
  name: string;
  artifactType: DesignerArtifactType;
  graphType?: GraphVisualizationType;
  fields: SelectedField[];
  style?: DesignedItemStyle;
  requestedAt: string;
}

export interface BuildDesignedItemRequestOptions {
  name?: string;
  style?: DesignedItemStyle;
  requestedAt?: string;
}
