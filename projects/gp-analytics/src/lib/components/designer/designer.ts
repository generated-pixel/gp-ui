import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  AggregationType,
  ColumnFormat,
  DatasetFolder,
  DesignerArtifactType,
  DesignerSelectionState,
  Field,
  GeneratedReport,
  GraphVisualizationType,
  SelectedField,
  SortDirection,
} from '../../models/designer.models';
import { ReportGeneratorService } from '../../services/report-generator.service';
import { GpReportViewer } from '../report-viewer/report-viewer';

@Component({
  selector: 'gp-analytics-designer',
  standalone: true,
  imports: [CommonModule, FormsModule, GpReportViewer],
  templateUrl: './designer.html',
  styleUrl: './designer.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GpAnalyticsDesigner implements OnInit {
  private readonly generator = inject(ReportGeneratorService);

  readonly folders = input.required<DatasetFolder[]>();
  readonly dataset = input.required<Record<string, unknown>[]>();
  readonly initialTitle = input<string>('Custom Analytics Report');

  readonly reportGenerated = output<GeneratedReport>();
  readonly stateChanged = output<DesignerSelectionState>();

  // Designer State
  protected readonly reportTitle = signal<string>('Custom Analytics Report');
  protected readonly reportDescription = signal<string>('');
  protected readonly selectedArtifactType = signal<DesignerArtifactType>('tabular');
  protected readonly selectedGraphType = signal<GraphVisualizationType>('bar');
  protected readonly selectedFields = signal<SelectedField[]>([]);

  // Search filter for available fields
  protected readonly fieldSearch = signal<string>('');
  protected readonly expandedFolders = signal<Set<string>>(new Set());

  // Computed Dimensions and Measures
  protected readonly dimensions = computed(() => this.selectedFields().filter((f) => f.groupBy));
  protected readonly measures = computed(() => this.selectedFields().filter((f) => !f.groupBy));

  // Computed Validation Errors
  protected readonly validationErrors = computed<string[]>(() => {
    const errors: string[] = [];
    const fields = this.selectedFields();
    const type = this.selectedArtifactType();

    if (fields.length === 0) {
      errors.push('Select at least one field to generate a report.');
      return errors;
    }

    if (type === 'graph') {
      const hasDim = fields.some((f) => f.groupBy);
      const hasMeasure = fields.some((f) => !f.groupBy && f.field.dataType === 'number');
      if (!hasDim) errors.push('Graphs require at least one dimension for categories/x-axis.');
      if (!hasMeasure) errors.push('Graphs require at least one numeric measure.');
    }

    if (type === 'kpi') {
      const measureCount = fields.filter((f) => !f.groupBy && f.field.dataType === 'number').length;
      if (measureCount === 0) errors.push('KPI cards require at least one numeric measure.');
    }

    return errors;
  });

  // Computed Current Definition State
  protected readonly currentState = computed<DesignerSelectionState>(() => ({
    title: this.reportTitle(),
    description: this.reportDescription(),
    artifactType: this.selectedArtifactType(),
    graphType: this.selectedGraphType(),
    fields: this.selectedFields(),
  }));

  // Computed Real-Time Live Preview Report
  protected readonly previewReport = computed<GeneratedReport | null>(() => {
    if (this.validationErrors().length > 0) return null;
    return this.generator.generateReport(this.currentState(), this.dataset());
  });

  ngOnInit(): void {
    if (this.initialTitle()) {
      this.reportTitle.set(this.initialTitle());
    }
    // Expand all folders by default
    const allFolderIds = new Set(this.folders().map((f) => f.id));
    this.expandedFolders.set(allFolderIds);
  }

  // Folder accordion toggle
  protected toggleFolder(folderId: string): void {
    this.expandedFolders.update((current) => {
      const next = new Set(current);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  }

  // Field selection actions
  protected addField(field: Field, asDimension = false): void {
    const existing = this.selectedFields().find((f) => f.field.name === field.name);
    if (existing) return;

    const isDim = asDimension || field.dataType === 'string' || field.dataType === 'date';
    const newField: SelectedField = {
      field,
      aggregation: isDim ? 'none' : field.defaultAggregation ?? 'sum',
      groupBy: isDim,
      columnFormat: field.defaultFormat ?? (field.dataType === 'number' ? 'number-2' : 'default'),
    };

    this.selectedFields.update((current) => [...current, newField]);
    this.stateChanged.emit(this.currentState());
  }

  protected removeField(fieldName: string): void {
    this.selectedFields.update((current) => current.filter((f) => f.field.name !== fieldName));
    this.stateChanged.emit(this.currentState());
  }

  protected updateAggregation(fieldName: string, agg: AggregationType): void {
    this.selectedFields.update((current) =>
      current.map((f) => (f.field.name === fieldName ? { ...f, aggregation: agg } : f)),
    );
    this.stateChanged.emit(this.currentState());
  }

  protected updateFormat(fieldName: string, format: ColumnFormat): void {
    this.selectedFields.update((current) =>
      current.map((f) => (f.field.name === fieldName ? { ...f, columnFormat: format } : f)),
    );
    this.stateChanged.emit(this.currentState());
  }

  protected updateSort(fieldName: string, direction: SortDirection | undefined): void {
    this.selectedFields.update((current) =>
      current.map((f) => (f.field.name === fieldName ? { ...f, sortDirection: direction } : f)),
    );
    this.stateChanged.emit(this.currentState());
  }

  protected setArtifactType(type: DesignerArtifactType): void {
    this.selectedArtifactType.set(type);
    this.stateChanged.emit(this.currentState());
  }

  protected setGraphType(graphType: GraphVisualizationType): void {
    this.selectedGraphType.set(graphType);
    this.stateChanged.emit(this.currentState());
  }

  protected emitSaveReport(): void {
    const report = this.previewReport();
    if (report) {
      this.reportGenerated.emit(report);
    }
  }

  protected isFieldSelected(fieldName: string): boolean {
    return this.selectedFields().some((f) => f.field.name === fieldName);
  }
}
