import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { GpBadge, GpToast, GpToastService } from 'gp-ui';
import { DatasetField, Field, GpFilterCondition, GpDatasetFieldSelector } from 'gp-analytics';
import { DocApiTable, DocApiProperty } from '../../../shared/doc-api-table';
import { DocCode } from '../../../shared/doc-code';
import { ANALYTICS_SAMPLE_DATASET_FIELDS } from '../analytics-demo-data';

@Component({
  selector: 'app-dataset-field-selector-demo',
  standalone: true,
  imports: [GpBadge, GpToast, GpDatasetFieldSelector, DocApiTable, DocCode],
  templateUrl: './dataset-field-selector-demo.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatasetFieldSelectorDemo {
  private readonly toastService = inject(GpToastService);

  protected readonly fields = signal<DatasetField[]>(ANALYTICS_SAMPLE_DATASET_FIELDS);
  protected readonly filters = signal<GpFilterCondition[]>([]);
  protected readonly listGrouping = signal<'none' | 'table' | 'role'>('none');
  protected readonly selectedFieldId = signal<string | null>(null);

  protected onFieldsChange(fields: DatasetField[]): void {
    this.fields.set(fields);
  }

  protected onFiltersChange(filters: GpFilterCondition[]): void {
    this.filters.set(filters);
  }

  protected onFieldDrop(field: Field): void {
    this.toastService.add({ severity: 'info', summary: 'Field dropped', detail: field.fieldName });
  }

  protected onFieldRemove(fieldId: string): void {
    this.toastService.add({ severity: 'warning', summary: 'Field removed', detail: fieldId });
  }

  protected readonly usageCode = `<gp-dataset-field-selector
  [fields]="fields()"
  [filters]="filters()"
  [(listGrouping)]="listGrouping"
  [(selectedFieldId)]="selectedFieldId"
  (fieldsChange)="onFieldsChange($event)"
  (filtersChange)="onFiltersChange($event)"
  (fieldDrop)="onFieldDrop($event)"
  (fieldRemove)="onFieldRemove($event)"
/>`;

  protected readonly properties: DocApiProperty[] = [
    { name: 'fields', type: 'input<DatasetField[]>', default: '[]', description: 'The list of fields configured in the current dataset.' },
    { name: 'filters', type: 'input<GpFilterCondition[]>', default: '[]', description: 'Dataset-level filters applied to records.' },
    { name: 'listGrouping', type: 'model<ListGroupingMode>', default: "'none'", kind: 'model', description: "Two-way grouping mode for the fields list: 'none' | 'table' | 'role'." },
    { name: 'selectedFieldId', type: 'model<string | null>', default: 'null', kind: 'model', description: 'Two-way currently active/selected dataset field ID for the properties panel.' },
    { name: 'disabled', type: 'input<boolean>', default: 'false', description: 'Disabled state.' },
    { name: 'loading', type: 'input<boolean>', default: 'false', description: 'Loading state indicator.' }
  ];

  protected readonly events: DocApiProperty[] = [
    { name: 'fieldsChange', type: 'output<DatasetField[]>', description: 'Emitted whenever the fields array or any field property changes.' },
    { name: 'filtersChange', type: 'output<GpFilterCondition[]>', description: 'Emitted whenever dataset filters change.' },
    { name: 'fieldDrop', type: 'output<Field>', description: 'Emitted when a field is dropped into the component from the schema catalogue.' },
    { name: 'fieldRemove', type: 'output<string>', description: 'Emitted when a field is removed, with the removed field ID.' }
  ];
}
