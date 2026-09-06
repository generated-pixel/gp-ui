import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { GpAnalyticsComponent } from '../base/gp-analytics-component';
import {
  createDatasetField,
  createEmptyDataset,
  Dataset,
  DatasetField,
  Field,
  Grouping,
  Relationship,
  DatasetDataSourceConfig,
  CustomDataLoaderFn,
  LoadedDataResult,
  LoadedSchemaResult,
  GpFilterCondition,
} from '../../models';
import { GpSchemaCatalogue } from '../schema-catalogue/schema-catalogue';
import { GpDatasetFieldSelector } from '../dataset-field-selector/dataset-field-selector';
import { GpDatasetPreview } from '../dataset-preview/dataset-preview';

@Component({
  selector: 'gp-dataset-builder',
  standalone: true,
  imports: [GpSchemaCatalogue, GpDatasetFieldSelector, GpDatasetPreview],
  templateUrl: './dataset-builder.html',
  styleUrl: './dataset-builder.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GpDatasetBuilder extends GpAnalyticsComponent {
  /**
   * Groupings representing metadata schema. Supports two-way [(groupings)].
   */
  readonly groupings = model.required<Grouping[]>();

  /**
   * Optional relationships across groupings. Supports two-way [(additionalRelationships)].
   */
  readonly additionalRelationships = model<Relationship[]>([]);

  /**
   * Emitted when metadata schema is loaded from external source or preset.
   */
  readonly schemaLoad = output<LoadedSchemaResult>();

  /**
   * Dataset model being built. Two-way bindable via [(dataset)].
   */
  readonly dataset = model<Dataset>(createEmptyDataset());

  /**
   * Currently active field ID in the field selector.
   */
  readonly selectedFieldId = model<string | null>(null);

  /**
   * Optional custom records passed directly to preview.
   */
  readonly customData = input<Record<string, any>[] | null>(null);

  /**
   * Optional custom data loader function for specialized or authenticated fetching.
   */
  readonly customDataLoader = input<CustomDataLoaderFn | null>(null);

  /**
   * Optional initial data source configuration.
   */
  readonly dataSourceConfig = input<DatasetDataSourceConfig | null>(null);

  /**
   * Emitted whenever the dataset changes.
   */
  readonly datasetChange = output<Dataset>();

  /**
   * Emitted when custom data is loaded from a source.
   */
  readonly dataSourceLoaded = output<LoadedDataResult>();

  /**
   * Emitted when preview is reset to simulated data.
   */
  readonly dataSourceReset = output<void>();

  /**
   * Computed list of visible dataset fields.
   */
  readonly datasetFields = computed(() =>
    (this.dataset().fields ?? []).filter(
      (f) => f.visible !== false && (f.baseField ? f.baseField.visible !== false : true),
    ),
  );

  /**
   * Handles adding a field from the schema catalogue (via click or drag drop).
   */
  protected onAddField(field: Field): void {
    if (!field.visible) {
      return;
    }
    const newDatasetField = createDatasetField(field);
    const currentFields = this.datasetFields();

    const updatedDataset: Dataset = {
      ...this.dataset(),
      fields: [...currentFields, newDatasetField],
      updatedAt: new Date().toISOString(),
    };

    this.dataset.set(updatedDataset);
    this.datasetChange.emit(updatedDataset);

    // Focus the newly added field in the properties panel
    this.selectedFieldId.set(newDatasetField.datasetFieldId);
  }

  /**
   * Handles changes from the dataset-field-selector component.
   */
  protected onFieldsChange(fields: DatasetField[]): void {
    const updatedDataset: Dataset = {
      ...this.dataset(),
      fields,
      updatedAt: new Date().toISOString(),
    };

    this.dataset.set(updatedDataset);
    this.datasetChange.emit(updatedDataset);
  }

  /**
   * Handles removing a single field.
   */
  protected onFieldRemove(datasetFieldId: string): void {
    const currentFields = this.datasetFields();
    const updatedFields = currentFields.filter((f) => f.datasetFieldId !== datasetFieldId);

    const updatedDataset: Dataset = {
      ...this.dataset(),
      fields: updatedFields,
      updatedAt: new Date().toISOString(),
    };

    this.dataset.set(updatedDataset);
    this.datasetChange.emit(updatedDataset);
  }

  /**
   * Handles schema metadata loaded from external source or preset.
   */
  protected onSchemaLoad(result: LoadedSchemaResult): void {
    this.groupings.set(result.groupings);
    if (result.relationships) {
      this.additionalRelationships.set(result.relationships);
    }
    this.schemaLoad.emit(result);
  }

  /**
   * Handles direct groupings updates from catalogue.
   */
  protected onGroupingsChange(groupings: Grouping[]): void {
    this.groupings.set(groupings);
  }

  /**
   * Handles direct relationships updates from catalogue.
   */
  protected onRelationshipsChange(relationships: Relationship[]): void {
    this.additionalRelationships.set(relationships);
  }

  /**
   * Handles dataset filter updates from field selector.
   */
  protected onFiltersChange(filters: GpFilterCondition[]): void {
    const updatedDataset: Dataset = {
      ...this.dataset(),
      filters,
      updatedAt: new Date().toISOString(),
    };

    this.dataset.set(updatedDataset);
    this.datasetChange.emit(updatedDataset);
  }

  /**
   * Handles removing a single filter from preview chip.
   */
  protected onFilterRemove(index: number): void {
    const current = this.dataset().filters || [];
    const updated = current.filter((_, i) => i !== index);
    this.onFiltersChange(updated);
  }

  /**
   * Clears all filters from preview chip bar.
   */
  protected onFiltersClear(): void {
    this.onFiltersChange([]);
  }
}
