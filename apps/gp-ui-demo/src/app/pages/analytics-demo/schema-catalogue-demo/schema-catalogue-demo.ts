import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { GpBadge, GpToast, GpToastService } from 'gp-ui';
import { DocApiTable, DocApiProperty } from '../../../shared/doc-api-table';
import { DocCode } from '../../../shared/doc-code';
import { ANALYTICS_SAMPLE_GROUPINGS } from '../analytics-demo-data';

@Component({
  selector: 'app-schema-catalogue-demo',
  standalone: true,
  imports: [GpBadge, GpToast, GpSchemaCatalogue, DocApiTable, DocCode],
  templateUrl: './schema-catalogue-demo.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchemaCatalogueDemo {
  private readonly toastService = inject(GpToastService);

  protected readonly groupings = signal<Grouping[]>(ANALYTICS_SAMPLE_GROUPINGS);
  protected readonly activeDatasetFields = signal([]);

  protected onGroupingsChange(groupings: Grouping[]): void {
    this.groupings.set(groupings);
  }

  protected onFieldSelect(field: Field): void {
    this.toastService.add({
      severity: 'info',
      summary: 'Field selected',
      detail: field.fieldDisplayName.displayValue['en']
    });
  }

  protected onSchemaLoad(result: LoadedSchemaResult): void {
    this.toastService.add({
      severity: 'success',
      summary: 'Schema loaded',
      detail: `${result.groupings.length} grouping(s) loaded`
    });
  }

  protected readonly usageCode = `<gp-schema-catalogue
  [groupings]="groupings()"
  [activeDatasetFields]="activeDatasetFields()"
  (groupingsChange)="onGroupingsChange($event)"
  (fieldSelect)="onFieldSelect($event)"
  (schemaLoad)="onSchemaLoad($event)"
/>`;

  protected readonly properties: DocApiProperty[] = [
    {
      name: 'groupings',
      type: 'input.required<Grouping[]>',
      description: 'Metadata schema to browse: groupings, tables, field groupings, and fields.'
    },
    {
      name: 'additionalRelationships',
      type: 'input<Relationship[]>',
      default: '[]',
      description: 'Cross-grouping relationships used to resolve join eligibility.'
    },
    {
      name: 'activeDatasetFields',
      type: 'input<DatasetField[]>',
      default: '[]',
      description: 'Fields already present in the active dataset, used to highlight added fields.'
    },
    { name: 'id', type: 'input<string>', default: 'auto-generated', description: 'Unique element identifier.' },
    {
      name: 'styleClass',
      type: 'input<string>',
      default: "''",
      description: 'Custom CSS class applied to the host/root container.'
    },
    {
      name: 'style',
      type: 'input<{[k:string]:any}|null>',
      default: 'null',
      description: 'Custom inline styles applied to the host/root container.'
    },
    { name: 'ariaLabel', type: 'input<string>', default: "''", description: 'Accessible label for screen readers.' },
    { name: 'disabled', type: 'input<boolean>', default: 'false', description: 'Disabled state.' },
    { name: 'loading', type: 'input<boolean>', default: 'false', description: 'Loading state indicator.' }
  ];

  protected readonly events: DocApiProperty[] = [
    {
      name: 'groupingsChange',
      type: 'output<Grouping[]>',
      description: 'Emitted when groupings are updated via preset loading or an external source.'
    },
    {
      name: 'additionalRelationshipsChange',
      type: 'output<Relationship[]>',
      description: 'Emitted when relationships are updated via preset loading or an external source.'
    },
    {
      name: 'schemaLoad',
      type: 'output<LoadedSchemaResult>',
      description: 'Emitted when metadata schema is loaded from a preset, file, API, or JSON.'
    },
    {
      name: 'fieldSelect',
      type: 'output<Field>',
      description: 'Emitted when a user chooses to add a field (via the + button or drag start).'
    }
  ];
}
