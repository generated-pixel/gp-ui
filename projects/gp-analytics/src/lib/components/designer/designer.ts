import { NgStyle } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { CdkDropListGroup } from '@angular/cdk/drag-drop';

import { Folder } from '../../interfaces/folder';
import {
  DesignerArtifactType,
  DesignerSelectionState,
  GraphVisualizationType,
  SelectedField,
} from '../../interfaces/selected-field';
import { gpAnalyticsThemeCssVariables } from '../../config/gp-analytics-config';
import { GpIconMapperService } from '../../icons/gp-icon-mapper.service';
import { DesignedItem, DesignedItemDataPoint } from '../../interfaces/designed-item';
import { GpAnalyticsService } from '../../services/gp-analytics.service';
import { GP_ANALYTICS_CONFIG, GP_ANALYTICS_TRANSLATIONS } from '../../tokens/gp-analytics.token';
import { FieldList } from './field-list/field-list';
import { FieldPicker } from './field-picker/field-picker';
import { Widget } from '../widget/widget';
import { GpIcon } from '../icon/icon';

@Component({
  selector: 'gp-designer',
  imports: [NgStyle, CdkDropListGroup, FieldPicker, FieldList, Widget, GpIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './designer.html',
  styleUrls: ['./designer.css'],
})
export class Designer {
  readonly title = input<string | undefined>(undefined);
  readonly folders = input<Folder[]>([]);

  readonly selectionChange = output<DesignerSelectionState>();

  protected readonly artifactTypes: DesignerArtifactType[] = ['tabular', 'graph', 'kpi'];
  protected readonly graphTypes: GraphVisualizationType[] = [
    'pie',
    'bar',
    'stacked-bar',
    'column',
    'stacked-column',
    'radial',
  ];
  protected readonly selectedArtifactType = signal<DesignerArtifactType>('tabular');
  protected readonly selectedGraphType = signal<GraphVisualizationType>('bar');
  protected readonly selectedFields = signal<SelectedField[]>([]);
  protected readonly previewItem = signal<DesignedItem | undefined>(undefined);
  protected readonly lastRefreshedAt = signal<string | undefined>(undefined);
  protected readonly previewSelectionSignature = signal<string | undefined>(undefined);

  private readonly config = inject(GP_ANALYTICS_CONFIG, { optional: true });
  protected readonly t = inject(GP_ANALYTICS_TRANSLATIONS);
  private readonly analytics = inject(GpAnalyticsService);
  private readonly iconMapper = inject(GpIconMapperService);
  protected readonly themeStyle = computed(() => gpAnalyticsThemeCssVariables(this.config?.theme));
  protected readonly resolvedTitle = computed(() => this.title() ?? this.t.designerDefaultTitle);
  protected readonly selectedArtifactIcon = computed(() =>
    this.iconMapper.artifact(this.selectedArtifactType()),
  );
  protected readonly selectedGraphIcon = computed(() =>
    this.iconMapper.graphType(this.selectedGraphType()),
  );
  protected readonly artifactTypeLabels = computed<Record<DesignerArtifactType, string>>(() => ({
    tabular: this.t.artifactTypeTabular,
    graph: this.t.artifactTypeGraph,
    kpi: this.t.artifactTypeKpi,
  }));
  protected readonly graphTypeLabels = computed<Record<GraphVisualizationType, string>>(() => ({
    pie: this.t.graphTypePie,
    bar: this.t.graphTypeBar,
    'stacked-bar': this.t.graphTypeStackedBar,
    column: this.t.graphTypeColumn,
    'stacked-column': this.t.graphTypeStackedColumn,
    radial: this.t.graphTypeRadial,
  }));
  protected readonly artifactHint = computed(() => {
    const type = this.selectedArtifactType();
    if (type === 'kpi') {
      return this.t.designerHintKpi;
    }

    if (type === 'graph') {
      return this.t.designerHintGraph;
    }

    return this.t.designerHintTabular;
  });
  protected readonly validationErrors = computed(() => {
    const type = this.selectedArtifactType();
    const fields = this.selectedFields();
    const errors: string[] = [];

    if (type === 'tabular') {
      if (fields.length === 0) {
        errors.push(this.t.designerErrorAtLeastOneField);
      }
      return errors;
    }

    if (type === 'graph') {
      if (fields.length === 0) {
        errors.push(this.t.designerErrorAtLeastOneField);
        return errors;
      }

      const hasXAxis = fields.some((x) => x.graphRole === 'x-axis');
      const hasYAxis = fields.some((x) => x.graphRole === 'y-axis');
      if (!hasXAxis) {
        errors.push(this.t.designerErrorGraphNeedsXAxis);
      }
      if (!hasYAxis) {
        errors.push(this.t.designerErrorGraphNeedsYAxis);
      }
      return errors;
    }

    if (fields.length === 0) {
      errors.push(this.t.designerErrorKpiNeedsValueField);
      return errors;
    }

    if (!this.isNumericField(fields[0])) {
      errors.push(this.t.designerErrorKpiValueMustBeNumeric);
    }

    if (fields.length > 2) {
      errors.push(this.t.designerErrorKpiTooManyFields);
    }

    return errors;
  });
  protected readonly canRefreshPreview = computed(
    () => this.validationErrors().length === 0 && this.selectedFields().length > 0,
  );
  protected readonly isPreviewStale = computed(() => {
    const last = this.previewSelectionSignature();
    if (!last) {
      return false;
    }

    return last !== this.currentSelectionSignature();
  });
  protected readonly formattedLastRefreshed = computed(() => {
    const value = this.lastRefreshedAt();
    return value ? this.analytics.formatDate(value, 'long') : undefined;
  });
  protected readonly previewStatus = computed(() => {
    if (!this.previewItem()) {
      return this.canRefreshPreview()
        ? this.t.designerPreviewStatusNotRefreshed
        : this.t.designerPreviewInvalidConfig;
    }

    return this.isPreviewStale()
      ? this.t.designerPreviewStatusOutdated
      : this.t.designerPreviewStatusUpToDate;
  });

  protected setArtifactType(type: DesignerArtifactType): void {
    this.selectedArtifactType.set(type);
    if (type !== 'graph') {
      this.selectedGraphType.set('bar');
    }
    this.selectedFields.set(this.normalizeFieldsForType(this.selectedFields(), type));
    this.emitSelection();
  }

  protected setGraphType(type: GraphVisualizationType): void {
    this.selectedGraphType.set(type);
    this.emitSelection();
  }

  protected updateSelectedFields(fields: SelectedField[]): void {
    this.selectedFields.set(this.normalizeFieldsForType(fields, this.selectedArtifactType()));
    this.emitSelection();
  }

  protected refreshPreview(): void {
    if (!this.canRefreshPreview()) {
      return;
    }

    const refreshedAt = new Date().toISOString();
    const selection = this.currentSelectionState();
    this.previewSelectionSignature.set(this.currentSelectionSignature());
    this.lastRefreshedAt.set(refreshedAt);
    this.previewItem.set(this.buildPreviewItem(selection, refreshedAt));
  }

  private emitSelection(): void {
    this.selectionChange.emit({
      artifactType: this.selectedArtifactType(),
      graphType: this.selectedArtifactType() === 'graph' ? this.selectedGraphType() : undefined,
      fields: this.selectedFields(),
    });
  }

  private currentSelectionState(): DesignerSelectionState {
    return {
      artifactType: this.selectedArtifactType(),
      graphType: this.selectedArtifactType() === 'graph' ? this.selectedGraphType() : undefined,
      fields: this.selectedFields(),
    };
  }

  private currentSelectionSignature(): string {
    const selection = this.currentSelectionState();
    return JSON.stringify({
      artifactType: selection.artifactType,
      graphType: selection.graphType,
      fields: selection.fields.map((f) => ({
        name: f.field.name,
        alias: f.alias,
        aggregation: f.aggregation,
        groupBy: f.groupBy,
        sortDirection: f.sortDirection,
        graphRole: f.graphRole,
        kpiRole: f.kpiRole,
        columnFormat: f.columnFormat,
      })),
    });
  }

  private buildPreviewItem(selection: DesignerSelectionState, refreshedAt: string): DesignedItem {
    const summary =
      selection.artifactType === 'graph'
        ? this.t.designerPreviewSummaryGraph
        : selection.artifactType === 'kpi'
          ? this.t.designerPreviewSummaryKpi
          : this.t.designerPreviewSummaryTabular;

    return {
      metadata: {
        id: `preview-${Date.now()}`,
        name: this.resolvedTitle(),
        artifactType: selection.artifactType,
        graphType: selection.graphType,
        fields: selection.fields,
        generatedAt: refreshedAt,
      },
      style: {
        compact: true,
        highlighted: true,
      },
      data: {
        summary,
        points: selection.fields
          .slice(0, 5)
          .map((field, index) => this.buildPreviewPoint(field, index)),
      },
    };
  }

  private buildPreviewPoint(selected: SelectedField, index: number): DesignedItemDataPoint {
    const label = selected.alias ?? selected.field.label ?? selected.field.name;
    const isNumeric = this.isNumericField(selected);

    switch (selected.field.dataType) {
      case 'number':
      case 'integer':
        return {
          key: `${selected.field.name}-${index}`,
          label,
          value: 1000 + index * 111,
          valueType: 'number',
        };
      case 'boolean':
        return {
          key: `${selected.field.name}-${index}`,
          label,
          value: index % 2 === 0,
          valueType: 'boolean',
        };
      case 'date':
        return {
          key: `${selected.field.name}-${index}`,
          label,
          value: new Date().toISOString(),
          valueType: 'date',
        };
      case 'datetime':
        return {
          key: `${selected.field.name}-${index}`,
          label,
          value: new Date().toISOString(),
          valueType: 'datetime',
        };
      default:
        return {
          key: `${selected.field.name}-${index}`,
          label,
          value:
            selected.graphRole === 'y-axis' || isNumeric ? `${100 + index}` : `Sample ${index + 1}`,
          valueType: 'text',
        };
    }
  }

  private normalizeFieldsForType(
    fields: SelectedField[],
    type: DesignerArtifactType,
  ): SelectedField[] {
    if (type === 'kpi') {
      return fields
        .filter((x) => this.isNumericField(x))
        .slice(0, 2)
        .map((x, i) => ({
          ...x,
          kpiRole: i === 0 ? 'value' : 'compare',
          graphRole: undefined,
        }));
    }

    if (type === 'graph') {
      return fields.map((x, i) => ({
        ...x,
        graphRole:
          x.graphRole ?? (this.isNumericField(x) ? 'y-axis' : i === 0 ? 'x-axis' : 'series'),
        kpiRole: undefined,
      }));
    }

    return fields.map((x) => ({
      ...x,
      graphRole: undefined,
      kpiRole: undefined,
      columnFormat: x.columnFormat ?? 'default',
    }));
  }

  private isNumericField(field: SelectedField): boolean {
    return field.field.dataType === 'number' || field.field.dataType === 'integer';
  }
}
