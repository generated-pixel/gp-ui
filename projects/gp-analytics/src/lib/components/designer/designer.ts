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
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import {
  AggregationType,
  ColumnFormat,
  DatasetFolder,
  DesignerArtifactType,
  DesignerSelectionState,
  Field,
  FieldFilter,
  FilterMatchTarget,
  FilterOperator,
  GeneratedReport,
  GraphVisualizationType,
  resolveFieldDescription,
  resolveFieldLabel,
  resolveFolderName,
  SelectedField,
  SortDirection,
} from '../../models';
import { LocalizationService } from '../../services/localization.service';
import { ReportGeneratorService } from '../../services/report-generator.service';
import { GpReportViewer } from '../report-viewer/report-viewer';

@Component({
  selector: 'gp-analytics-designer',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule, GpReportViewer],
  templateUrl: './designer.html',
  styleUrl: './designer.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GpAnalyticsDesigner implements OnInit {
  protected readonly generator = inject(ReportGeneratorService);
  protected readonly localization = inject(LocalizationService);

  readonly folders = input.required<DatasetFolder[]>();
  readonly dataset = input.required<Record<string, unknown>[]>();
  readonly initialTitle = input<string>('Custom Analytics Report');

  readonly reportGenerated = output<GeneratedReport>();
  readonly stateChanged = output<DesignerSelectionState>();

  // Available locales for live designer preview
  readonly availableLocales = [
    { code: 'en-US', label: '🇺🇸 English' },
    { code: 'fr-FR', label: '🇫🇷 Français' },
    { code: 'de-DE', label: '🇩🇪 Deutsch' },
    { code: 'es-ES', label: '🇪🇸 Español' },
  ];

  // Designer State
  protected readonly reportTitle = signal<string>('Custom Analytics Report');
  protected readonly reportDescription = signal<string>('');
  protected readonly selectedArtifactType = signal<DesignerArtifactType>('tabular');
  protected readonly selectedGraphType = signal<GraphVisualizationType>('bar');
  protected readonly selectedFields = signal<SelectedField[]>([]);
  protected readonly filters = signal<FieldFilter[]>([]);

  // Search filter for available fields
  protected readonly fieldSearch = signal<string>('');
  protected readonly expandedFolders = signal<Set<string>>(new Set());

  // Active locale signal from service
  protected readonly currentLocale = this.localization.activeLocale;

  // Computed Dimensions and Measures
  protected readonly dimensions = computed(() => this.selectedFields().filter((f) => f.groupBy));
  protected readonly measures = computed(() => this.selectedFields().filter((f) => !f.groupBy));

  // Computed Validation Errors
  protected readonly validationErrors = computed<string[]>(() => {
    const errors: string[] = [];
    const fields = this.selectedFields();
    const type = this.selectedArtifactType();

    if (fields.length === 0) {
      errors.push('Select or drag at least one field to generate a report.');
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
    filters: this.filters(),
    locale: this.currentLocale(),
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

  // Localization Helpers for Template
  protected resolveFolderName(folder: DatasetFolder): string {
    return resolveFolderName(folder, this.currentLocale());
  }

  protected resolveFieldLabel(field: Field): string {
    return resolveFieldLabel(field, this.currentLocale());
  }

  protected resolveFieldDescription(field: Field): string {
    return resolveFieldDescription(field, this.currentLocale());
  }

  protected setLocale(locale: string): void {
    this.localization.setLocale(locale);
    this.stateChanged.emit(this.currentState());
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
  protected addField(field: Field, asDimension?: boolean): void {
    const existing = this.selectedFields().find((f) => f.field.name === field.name);
    if (existing) return;

    const isDim =
      asDimension !== undefined
        ? asDimension
        : field.dataType === 'string' || field.dataType === 'date';

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

  // --- Drag and Drop Handlers ---
  protected onDropDimension(event: CdkDragDrop<Field | SelectedField | unknown>): void {
    const itemData = event.item.data as Field | SelectedField;
    if (!itemData) return;

    // Check if dragging an already selected field or new available field
    if ('groupBy' in itemData) {
      // Reordering within dimensions
      const dims = [...this.dimensions()];
      moveItemInArray(dims, event.previousIndex, event.currentIndex);
      const otherFields = this.measures();
      this.selectedFields.set([...dims, ...otherFields]);
    } else {
      // Dragged from available fields into dimensions
      this.addField(itemData, true);
    }
    this.stateChanged.emit(this.currentState());
  }

  protected onDropMeasure(event: CdkDragDrop<Field | SelectedField | unknown>): void {
    const itemData = event.item.data as Field | SelectedField;
    if (!itemData) return;

    if ('groupBy' in itemData) {
      // Reordering within measures
      const ms = [...this.measures()];
      moveItemInArray(ms, event.previousIndex, event.currentIndex);
      const otherFields = this.dimensions();
      this.selectedFields.set([...otherFields, ...ms]);
    } else {
      // Dragged from available fields into measures
      this.addField(itemData, false);
    }
    this.stateChanged.emit(this.currentState());
  }

  protected onDropFilter(event: CdkDragDrop<Field | unknown>): void {
    const field = event.item.data as Field;
    if (!field || !('name' in field)) return;
    this.addFilter(field);
  }

  // --- Filter Management ---
  protected addFilter(field: Field): void {
    const newFilter: FieldFilter = {
      id: `flt-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      fieldName: field.name,
      operator: field.dataType === 'number' ? 'gte' : 'contains',
      value: '',
      matchTarget: 'both',
      locale: this.currentLocale(),
    };
    this.filters.update((current) => [...current, newFilter]);
    this.stateChanged.emit(this.currentState());
  }

  protected removeFilter(filterId: string | undefined): void {
    if (!filterId) return;
    this.filters.update((current) => current.filter((f) => f.id !== filterId));
    this.stateChanged.emit(this.currentState());
  }

  protected updateFilterOperator(filterId: string | undefined, op: FilterOperator): void {
    if (!filterId) return;
    this.filters.update((current) =>
      current.map((f) => (f.id === filterId ? { ...f, operator: op } : f)),
    );
    this.stateChanged.emit(this.currentState());
  }

  protected updateFilterValue(filterId: string | undefined, value: unknown): void {
    if (!filterId) return;
    this.filters.update((current) =>
      current.map((f) => (f.id === filterId ? { ...f, value } : f)),
    );
    this.stateChanged.emit(this.currentState());
  }

  protected updateFilterTarget(filterId: string | undefined, target: FilterMatchTarget): void {
    if (!filterId) return;
    this.filters.update((current) =>
      current.map((f) => (f.id === filterId ? { ...f, matchTarget: target } : f)),
    );
    this.stateChanged.emit(this.currentState());
  }

  protected getFieldByName(fieldName: string): Field | undefined {
    for (const folder of this.folders()) {
      const found = folder.fields.find((f) => f.name === fieldName);
      if (found) return found;
    }
    return undefined;
  }
}
