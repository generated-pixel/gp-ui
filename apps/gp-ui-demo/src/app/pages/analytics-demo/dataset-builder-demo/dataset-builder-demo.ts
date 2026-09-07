import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { GpBadge, GpToast, GpToastService } from 'gp-ui';
import { createEmptyDataset, Dataset, GpDatasetBuilder, LoadedDataResult, LoadedSchemaResult, Relationship } from 'gp-analytics';
import { DocApiTable, DocApiProperty } from '../../../shared/doc-api-table';
import { DocCode } from '../../../shared/doc-code';
import { ANALYTICS_SAMPLE_GROUPINGS, ANALYTICS_SAMPLE_RECORDS } from '../analytics-demo-data';

@Component({
  selector: 'app-dataset-builder-demo',
  standalone: true,
  imports: [GpBadge, GpToast, GpDatasetBuilder, DocApiTable, DocCode],
  templateUrl: './dataset-builder-demo.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatasetBuilderDemo {
  private readonly toastService = inject(GpToastService);

  protected readonly groupings = signal(ANALYTICS_SAMPLE_GROUPINGS);
  protected readonly additionalRelationships = signal<Relationship[]>([]);
  protected readonly dataset = signal<Dataset>(createEmptyDataset('Custom Dataset'));
  protected readonly selectedFieldId = signal<string | null>(null);
  protected readonly customData = signal(ANALYTICS_SAMPLE_RECORDS);

  protected onSchemaLoad(result: LoadedSchemaResult): void {
    this.toastService.add({ severity: 'success', summary: 'Schema loaded', detail: `${result.groupings.length} grouping(s)` });
  }

  protected onDataSourceLoaded(result: LoadedDataResult): void {
    this.toastService.add({ severity: 'success', summary: 'Data source loaded', detail: `${result.records.length} record(s)` });
  }

  protected onDataSourceReset(): void {
    this.toastService.add({ severity: 'info', summary: 'Preview reset to simulated data' });
  }

  protected readonly usageCode = `<gp-dataset-builder
  [(groupings)]="groupings"
  [(additionalRelationships)]="additionalRelationships"
  [(dataset)]="dataset"
  [(selectedFieldId)]="selectedFieldId"
  [customData]="customData()"
  (schemaLoad)="onSchemaLoad($event)"
  (dataSourceLoaded)="onDataSourceLoaded($event)"
  (dataSourceReset)="onDataSourceReset()"
/>`;

  protected readonly properties: DocApiProperty[] = [
    { name: 'groupings', type: 'model.required<Grouping[]>', kind: 'model', description: 'Metadata schema. Two-way bindable via [(groupings)].' },
    { name: 'additionalRelationships', type: 'model<Relationship[]>', default: '[]', kind: 'model', description: 'Cross-grouping relationships. Two-way bindable via [(additionalRelationships)].' },
    { name: 'dataset', type: 'model<Dataset>', default: 'createEmptyDataset()', kind: 'model', description: 'The dataset model being built. Two-way bindable via [(dataset)].' },
    { name: 'selectedFieldId', type: 'model<string | null>', default: 'null', kind: 'model', description: 'Currently active field ID in the field selector.' },
    { name: 'customData', type: 'input<Record<string, any>[] | null>', default: 'null', description: 'Optional custom records passed directly to the preview.' },
    { name: 'customDataLoader', type: 'input<CustomDataLoaderFn | null>', default: 'null', description: 'Optional custom data loader function for specialized or authenticated fetching.' },
    { name: 'dataSourceConfig', type: 'input<DatasetDataSourceConfig | null>', default: 'null', description: 'Optional initial data source configuration.' }
  ];

  protected readonly events: DocApiProperty[] = [
    { name: 'schemaLoad', type: 'output<LoadedSchemaResult>', description: 'Emitted when metadata schema is loaded from an external source or preset.' },
    { name: 'dataSourceLoaded', type: 'output<LoadedDataResult>', description: 'Emitted when custom data is loaded from a source.' },
    { name: 'dataSourceReset', type: 'output<void>', description: 'Emitted when the preview is reset to simulated data.' }
  ];
}
