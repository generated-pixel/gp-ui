import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { GpBadge, GpToast, GpToastService } from 'gp-ui';
import { GpFilterCondition, GpDatasetPreview, LoadedDataResult } from 'gp-analytics';
import { DocApiTable, DocApiProperty } from '../../../shared/doc-api-table';
import { DocCode } from '../../../shared/doc-code';
import { ANALYTICS_SAMPLE_DATASET_FIELDS, ANALYTICS_SAMPLE_RECORDS } from '../analytics-demo-data';

@Component({
  selector: 'app-dataset-preview-demo',
  standalone: true,
  imports: [GpBadge, GpToast, GpDatasetPreview, DocApiTable, DocCode],
  templateUrl: './dataset-preview-demo.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatasetPreviewDemo {
  private readonly toastService = inject(GpToastService);

  protected readonly fields = signal(ANALYTICS_SAMPLE_DATASET_FIELDS);
  protected readonly customData = signal(ANALYTICS_SAMPLE_RECORDS);
  protected readonly filters = signal<GpFilterCondition[]>([]);

  protected onDataSourceLoaded(result: LoadedDataResult): void {
    this.toastService.add({
      severity: 'success',
      summary: 'Data source loaded',
      detail: `${result.records.length} record(s)`
    });
  }

  protected onDataSourceReset(): void {
    this.toastService.add({ severity: 'info', summary: 'Preview reset to simulated data' });
  }

  protected onFilterRemove(index: number): void {
    this.filters.update((filters) => filters.filter((_, i) => i !== index));
  }

  protected onFiltersClear(): void {
    this.filters.set([]);
  }

  protected readonly usageCode = `<gp-dataset-preview
  datasetName="Custom Dataset"
  [fields]="fields()"
  [customData]="customData()"
  [filters]="filters()"
  [showSummaryStats]="true"
  (dataSourceLoaded)="onDataSourceLoaded($event)"
  (dataSourceReset)="onDataSourceReset()"
  (filterRemove)="onFilterRemove($event)"
  (filtersClear)="onFiltersClear()"
/>`;

  protected readonly properties: DocApiProperty[] = [
    {
      name: 'showSummaryStats',
      type: 'input<boolean>',
      default: 'true',
      description: 'Whether the per-column summary statistics panel is shown.'
    },
    {
      name: 'fields',
      type: 'input<DatasetField[]>',
      default: '[]',
      description: 'The list of dataset fields forming the columns of this table preview.'
    },
    {
      name: 'datasetName',
      type: 'input<string>',
      default: "'Custom Dataset'",
      description: 'Dataset name displayed on the header.'
    },
    {
      name: 'customData',
      type: 'input<Record<string, any>[] | null>',
      default: 'null',
      description: 'Optional custom/real dataset records. If null and no source is loaded, simulated data is rendered.'
    },
    {
      name: 'customDataLoader',
      type: 'input<CustomDataLoaderFn | null>',
      default: 'null',
      description: 'Optional custom data loader function for specialized or authenticated fetching.'
    },
    {
      name: 'dataSourceConfig',
      type: 'input<DatasetDataSourceConfig | null>',
      default: 'null',
      description: 'Optional initial or pre-configured data source.'
    },
    {
      name: 'filters',
      type: 'input<GpFilterCondition[]>',
      default: '[]',
      description: 'Dataset-level filters applied to records in the preview.'
    }
  ];

  protected readonly events: DocApiProperty[] = [
    {
      name: 'dataSourceLoaded',
      type: 'output<LoadedDataResult>',
      description: 'Emitted when custom data is loaded from a source.'
    },
    {
      name: 'dataSourceReset',
      type: 'output<void>',
      description: 'Emitted when the preview is reset to simulated data.'
    },
    {
      name: 'filterRemove',
      type: 'output<number>',
      description: 'Emitted with the index of a filter chip that was removed.'
    },
    { name: 'filtersClear', type: 'output<void>', description: 'Emitted when all filters are cleared.' }
  ];
}
