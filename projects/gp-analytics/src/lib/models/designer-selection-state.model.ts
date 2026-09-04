import { DesignerArtifactType } from './designer-artifact-type.model';
import { FieldFilter } from './field-filter.model';
import { GraphVisualizationType } from './graph-visualization-type.model';
import { LocalizedText } from './localized-text.model';
import { SelectedField } from './selected-field.model';

export interface DesignerSelectionState {
  title: LocalizedText;
  description?: LocalizedText;
  artifactType: DesignerArtifactType;
  graphType?: GraphVisualizationType;
  fields: SelectedField[];
  filters?: FieldFilter[];
  locale?: string;
}
