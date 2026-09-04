import { DesignerArtifactType } from './designer-artifact-type.model';
import { GraphVisualizationType } from './graph-visualization-type.model';
import { ReportColumn } from './report-column.model';
import { ReportDataPoint } from './report-data-point.model';
import { ReportRow } from './report-row.model';

export interface GeneratedReport {
  id: string;
  title: string;
  description?: string;
  artifactType: DesignerArtifactType;
  graphType?: GraphVisualizationType;
  columns: ReportColumn[];
  rows: ReportRow[];
  dataPoints: ReportDataPoint[];
  summary?: Record<string, unknown>;
  generatedAt: Date;
  locale?: string;
}
