import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';

import { Field } from '../../../interfaces/field';
import {
  AggregationType,
  ColumnFormat,
  DesignerArtifactType,
  GraphFieldRole,
  SelectedField,
  SortDirection,
} from '../../../interfaces/selected-field';
import { GpIconName } from '../../../icons/gp-icon-names';
import { GpIconMapperService } from '../../../icons/gp-icon-mapper.service';
import { GP_ANALYTICS_TRANSLATIONS } from '../../../tokens/gp-analytics.token';
import { FieldItem } from '../field-item/field-item';
import { GpIcon } from '../../icon/icon';

@Component({
  selector: 'gp-field-list',
  imports: [CdkDrag, CdkDragHandle, CdkDropList, FieldItem, GpIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './field-list.html',
  styleUrls: ['./field-list.css'],
})
export class FieldList {
  readonly fields = input<SelectedField[]>([]);
  readonly artifactType = input<DesignerArtifactType>('tabular');
  readonly fieldsChange = output<SelectedField[]>();

  protected readonly AGGREGATIONS: AggregationType[] = [
    'none',
    'sum',
    'avg',
    'min',
    'max',
    'count',
    'countDistinct',
  ];

  protected readonly GRAPH_ROLES: GraphFieldRole[] = ['x-axis', 'y-axis', 'series', 'tooltip'];
  protected readonly COLUMN_FORMATS: ColumnFormat[] = [
    'default',
    'number-0',
    'number-2',
    'currency',
    'percent',
    'compact',
    'date-short',
    'date-long',
  ];
  protected readonly t = inject(GP_ANALYTICS_TRANSLATIONS);
  private readonly iconMapper = inject(GpIconMapperService);
  protected readonly dragHandleIcon: GpIconName = 'drag-handle';
  protected readonly removeIcon: GpIconName = 'remove';

  protected readonly aggregationLabels = computed<Record<AggregationType, string>>(() => ({
    none: this.t.aggregationNoneLabel,
    sum: this.t.aggregationSumLabel,
    avg: this.t.aggregationAvgLabel,
    min: this.t.aggregationMinLabel,
    max: this.t.aggregationMaxLabel,
    count: this.t.aggregationCountLabel,
    countDistinct: this.t.aggregationCountDistinctLabel,
  }));

  protected readonly graphRoleLabels = computed<Record<GraphFieldRole, string>>(() => ({
    'x-axis': this.t.graphRoleXAxisLabel,
    'y-axis': this.t.graphRoleYAxisLabel,
    series: this.t.graphRoleSeriesLabel,
    tooltip: this.t.graphRoleTooltipLabel,
  }));

  protected readonly columnFormatLabels = computed<Record<ColumnFormat, string>>(() => ({
    default: this.t.columnFormatDefaultLabel,
    'number-0': this.t.columnFormatNumber0Label,
    'number-2': this.t.columnFormatNumber2Label,
    currency: this.t.columnFormatCurrencyLabel,
    percent: this.t.columnFormatPercentLabel,
    compact: this.t.columnFormatCompactLabel,
    'date-short': this.t.columnFormatDateShortLabel,
    'date-long': this.t.columnFormatDateLongLabel,
  }));

  protected readonly kpiRoleLabels = computed(() => ({
    value: this.t.fieldListKpiRoleValueLabel,
    compare: this.t.fieldListKpiRoleCompareLabel,
  }));

  protected onDrop(event: CdkDragDrop<SelectedField[]>): void {
    const items = [...this.fields()];
    if (event.previousContainer === event.container) {
      moveItemInArray(items, event.previousIndex, event.currentIndex);
    } else {
      const field = event.item.data as Field;
      if (items.some((x) => x.field.name === field.name)) {
        return;
      }

      if (this.artifactType() === 'kpi' && !this.isNumericField(field)) {
        return;
      }

      if (this.artifactType() === 'kpi' && items.length >= 2) {
        return;
      }

      const newItem: SelectedField = {
        field,
        aggregation: 'none',
        groupBy: false,
        columnFormat: 'default',
      };
      items.splice(event.currentIndex, 0, newItem);
    }
    this.fieldsChange.emit(this.normalizeFields(items));
  }

  protected removeField(index: number): void {
    const items = [...this.fields()];
    items.splice(index, 1);
    this.fieldsChange.emit(this.normalizeFields(items));
  }

  protected updateAggregation(index: number, aggregation: AggregationType): void {
    this.fieldsChange.emit(
      this.normalizeFields(this.fields().map((f, i) => (i === index ? { ...f, aggregation } : f))),
    );
  }

  protected updateGroupBy(index: number, groupBy: boolean): void {
    this.fieldsChange.emit(
      this.normalizeFields(this.fields().map((f, i) => (i === index ? { ...f, groupBy } : f))),
    );
  }

  protected toggleSort(index: number): void {
    const current = this.fields()[index].sortDirection;
    const next: SortDirection | undefined =
      current === undefined ? 'asc' : current === 'asc' ? 'desc' : undefined;
    this.fieldsChange.emit(
      this.normalizeFields(
        this.fields().map((f, i) => (i === index ? { ...f, sortDirection: next } : f)),
      ),
    );
  }

  protected updateAlias(index: number, alias: string): void {
    this.fieldsChange.emit(
      this.normalizeFields(
        this.fields().map((f, i) => (i === index ? { ...f, alias: alias || undefined } : f)),
      ),
    );
  }

  protected updateGraphRole(index: number, graphRole: GraphFieldRole): void {
    this.fieldsChange.emit(
      this.normalizeFields(this.fields().map((f, i) => (i === index ? { ...f, graphRole } : f))),
    );
  }

  protected updateColumnFormat(index: number, columnFormat: ColumnFormat): void {
    this.fieldsChange.emit(
      this.normalizeFields(this.fields().map((f, i) => (i === index ? { ...f, columnFormat } : f))),
    );
  }

  protected isTabular(): boolean {
    return this.artifactType() === 'tabular';
  }

  protected isGraph(): boolean {
    return this.artifactType() === 'graph';
  }

  protected isKpi(): boolean {
    return this.artifactType() === 'kpi';
  }

  protected sortIcon(sort?: SortDirection): GpIconName {
    return this.iconMapper.sortDirection(sort);
  }

  private normalizeFields(items: SelectedField[]): SelectedField[] {
    const withSortPriority = this.applySortPriority(items);

    if (this.artifactType() === 'kpi') {
      const numeric = withSortPriority.filter((x) => this.isNumericField(x.field)).slice(0, 2);
      return numeric.map((x, i) => ({
        ...x,
        kpiRole: i === 0 ? 'value' : 'compare',
        graphRole: undefined,
      }));
    }

    if (this.artifactType() === 'graph') {
      return withSortPriority.map((x, i) => ({
        ...x,
        graphRole:
          x.graphRole ?? (this.isNumericField(x.field) ? 'y-axis' : i === 0 ? 'x-axis' : 'series'),
        kpiRole: undefined,
      }));
    }

    return withSortPriority.map((x) => ({
      ...x,
      graphRole: undefined,
      kpiRole: undefined,
      columnFormat: x.columnFormat ?? 'default',
    }));
  }

  private applySortPriority(items: SelectedField[]): SelectedField[] {
    let priority = 1;
    return items.map((item) => {
      if (!item.sortDirection) {
        return { ...item, sortPriority: undefined };
      }

      const next = { ...item, sortPriority: priority };
      priority += 1;
      return next;
    });
  }

  private isNumericField(field: Field): boolean {
    return field.dataType === 'number' || field.dataType === 'integer';
  }
}
