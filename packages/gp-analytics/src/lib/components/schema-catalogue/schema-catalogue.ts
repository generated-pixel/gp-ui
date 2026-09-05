import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GpTag } from '@generatedpixel/gp-ui';
import { GpAnalyticsComponent } from '../base/gp-analytics-component';
import { DatasetField, Field, Grouping, Relationship, Table } from '../../models';
import { GpRelationshipGraphService } from '../../services/relationship-graph.service';

@Component({
  selector: 'gp-schema-catalogue',
  standalone: true,
  imports: [FormsModule, GpTag],
  templateUrl: './schema-catalogue.html',
  styleUrl: './schema-catalogue.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GpSchemaCatalogue extends GpAnalyticsComponent {
  private readonly graphService = inject(GpRelationshipGraphService);

  /**
   * Groupings containing tables, fields, and internal relationships.
   */
  readonly groupings = input.required<Grouping[]>();

  /**
   * Optional relationships across groupings.
   */
  readonly additionalRelationships = input<Relationship[]>([]);

  /**
   * The list of fields currently present in the active dataset.
   * Used to calculate active tables and relationship eligibility.
   */
  readonly activeDatasetFields = input<DatasetField[]>([]);

  /**
   * Emitted when a user chooses to add a field (via + button or drag start).
   */
  readonly fieldSelect = output<Field>();

  /**
   * Search query to filter tables and fields.
   */
  protected readonly searchQuery = signal<string>('');

  /**
   * Selected grouping ID filter (null = all).
   */
  protected readonly selectedGroupingId = signal<string | null>(null);

  /**
   * Collapsed state for table panels.
   */
  protected readonly collapsedTableIds = signal<Set<string>>(new Set());

  /**
   * Dragged field reference during active drag operation.
   */
  protected readonly draggedField = signal<Field | null>(null);

  /**
   * All collected relationships.
   */
  readonly allRelationships = computed(() =>
    this.graphService.collectRelationships(this.groupings(), this.additionalRelationships()),
  );

  /**
   * Set of table IDs currently represented in the dataset by visible fields.
   */
  readonly activeTableIds = computed(() => {
    return new Set(
      this.activeDatasetFields()
        .filter((df) => df.visible !== false && (df.baseField ? df.baseField.visible !== false : true))
        .map((df) => df.tableId),
    );
  });

  /**
   * Set of field IDs currently represented in the dataset by visible fields.
   */
  readonly datasetFieldIds = computed(() => {
    return new Set(
      this.activeDatasetFields()
        .filter((df) => df.visible !== false && (df.baseField ? df.baseField.visible !== false : true))
        .map((df) => df.fieldId),
    );
  });

  /**
   * Eligible table IDs. Null if dataset is empty (all eligible).
   */
  readonly eligibleTableIds = computed(() => {
    return this.graphService.getEligibleTableIds(
      this.activeTableIds(),
      this.allRelationships(),
    );
  });

  /**
   * Filtered groupings and tables matching search and active group filter.
   */
  protected readonly filteredGroupings = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    const groupFilter = this.selectedGroupingId();
    const locale = this.i18n.locale();

    return this.groupings()
      .filter((group) => !groupFilter || group.groupingId === groupFilter)
      .map((group) => {
        const filteredTables = group.tables
          .map((table) => {
            const tableMatches = !q || table.tableName.toLowerCase().includes(q);
            const visibleFields = table.fields
              .flatMap((fg) => fg.fields)
              .filter((f) => f.visible);

            const matchingFields = tableMatches
              ? visibleFields
              : visibleFields.filter((field) => {
                  const label = (
                    field.fieldDisplayName.displayValue[locale] ??
                    String(field.fieldDisplayName.value)
                  ).toLowerCase();
                  const name = field.fieldName.toLowerCase();
                  return label.includes(q) || name.includes(q);
                });

            return {
              ...table,
              matchingFields,
              hasMatches: tableMatches || matchingFields.length > 0,
            };
          })
          .filter((t) => t.hasMatches);

        return {
          ...group,
          tables: filteredTables,
          hasMatches: filteredTables.length > 0,
        };
      })
      .filter((g) => g.hasMatches);
  });

  protected isTableEligible(tableId: string): boolean {
    const eligible = this.eligibleTableIds();
    if (eligible === null) {
      return true;
    }
    return eligible.has(tableId);
  }

  protected isTableInDataset(tableId: string): boolean {
    return this.activeTableIds().has(tableId);
  }

  protected checkFieldSelectable(field: Field): {
    selectable: boolean;
    reason?: string;
    message?: string;
  } {
    return this.graphService.checkFieldSelectability(
      field,
      this.activeTableIds(),
      this.allRelationships(),
    );
  }

  protected isFieldInDataset(fieldId: string): boolean {
    return this.datasetFieldIds().has(fieldId);
  }

  protected getFieldOccurrenceCount(fieldId: string): number {
    return this.activeDatasetFields().filter((df) => df.fieldId === fieldId).length;
  }

  protected toggleTableCollapse(tableId: string): void {
    this.collapsedTableIds.update((current) => {
      const next = new Set(current);
      if (next.has(tableId)) {
        next.delete(tableId);
      } else {
        next.add(tableId);
      }
      return next;
    });
  }

  protected isTableCollapsed(tableId: string): boolean {
    return this.collapsedTableIds().has(tableId);
  }

  protected onAddField(field: Field): void {
    const check = this.checkFieldSelectable(field);
    if (!check.selectable) {
      return;
    }
    this.fieldSelect.emit(field);
  }

  // HTML5 Drag and Drop handlers
  protected onDragStart(event: DragEvent, field: Field): void {
    const check = this.checkFieldSelectable(field);
    if (!check.selectable) {
      event.preventDefault();
      return;
    }

    this.draggedField.set(field);
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'copy';
      event.dataTransfer.setData('application/json', JSON.stringify(field));
      event.dataTransfer.setData('text/plain', field.fieldId);
    }
  }

  protected onDragEnd(): void {
    this.draggedField.set(null);
  }

  protected getFieldDisplayName(field: Field): string {
    return (
      field.fieldDisplayName.displayValue[this.i18n.locale()] ??
      String(field.fieldDisplayName.value)
    );
  }

  protected getTableLinkedNames(table: Table): string[] {
    const linkedIds = this.graphService.getDirectlyLinkedTableIds(
      table.tableId,
      this.allRelationships(),
    );
    const names: string[] = [];
    for (const group of this.groupings()) {
      for (const t of group.tables) {
        if (linkedIds.includes(t.tableId)) {
          names.push(t.tableName);
        }
      }
    }
    return names;
  }

  protected getDataTypeIcon(dataType: string): string {
    switch (dataType) {
      case 'currency':
        return '$';
      case 'number':
      case 'integer':
      case 'decimal':
        return '#';
      case 'date':
      case 'datetime':
      case 'timestamp':
        return '📅';
      case 'boolean':
        return '◩';
      case 'guid':
        return '🔑';
      default:
        return 'Aa';
    }
  }
}
