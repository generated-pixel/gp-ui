import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GpTag } from '@generatedpixel/gp-ui';
import { GpAnalyticsComponent } from '../../base/gp-analytics-component';
import { DatasetField, Field, Grouping, LoadedSchemaResult, Relationship, Table } from '../../../models';
import { GpRelationshipGraphService } from '../../../services/relationship-graph.service';
import { GpSchemaDataLoaderService } from '../../../services/schema-data-loader.service';

@Component({
  selector: 'gp-schema-catalogue',
  standalone: true,
  imports: [FormsModule, GpTag],
  templateUrl: './schema-catalogue.html',
  styleUrl: './schema-catalogue.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GpSchemaCatalogue extends GpAnalyticsComponent {
  private readonly graphService = inject(GpRelationshipGraphService);
  protected readonly schemaDataLoader = inject(GpSchemaDataLoaderService);

  /**
   * Groupings containing tables, fields, and internal relationships.
   */
  readonly groupings = input.required<Grouping[]>();

  /**
   * Emitted when groupings are updated via external source or preset loading.
   */
  readonly groupingsChange = output<Grouping[]>();

  /**
   * Optional relationships across groupings.
   */
  readonly additionalRelationships = input<Relationship[]>([]);

  /**
   * Emitted when relationships are updated via external source or preset loading.
   */
  readonly additionalRelationshipsChange = output<Relationship[]>();

  /**
   * Emitted when metadata schema is loaded from preset, file, API, or JSON.
   */
  readonly schemaLoad = output<LoadedSchemaResult>();

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
   * Schema Loader modal state
   */
  protected readonly isSourceModalOpen = signal<boolean>(false);
  protected readonly activeTab = signal<'presets' | 'file' | 'api' | 'json'>('presets');
  protected readonly selectedPresetId = signal<string>('commerce');
  protected readonly selectedFile = signal<File | null>(null);
  protected readonly apiUrlInput = signal<string>('');
  protected readonly rawJsonInput = signal<string>('');
  protected readonly dataPathInput = signal<string>('');
  protected readonly isLoadingSource = signal<boolean>(false);
  protected readonly sourceError = signal<string | null>(null);
  protected readonly loadedSchemaResult = signal<LoadedSchemaResult | null>(null);

  /**
   * Domain presets available for selection
   */
  protected readonly presets = this.schemaDataLoader.getPresetSchemas();

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
    this.graphService.collectRelationships(this.groupings(), this.additionalRelationships())
  );

  /**
   * Set of table IDs currently represented in the dataset by visible fields.
   */
  readonly activeTableIds = computed(() => {
    return new Set(
      this.activeDatasetFields()
        .filter((df) => df.visible !== false && (df.baseField ? df.baseField.visible !== false : true))
        .map((df) => df.tableId)
    );
  });

  /**
   * Set of field IDs currently represented in the dataset by visible fields.
   */
  readonly datasetFieldIds = computed(() => {
    return new Set(
      this.activeDatasetFields()
        .filter((df) => df.visible !== false && (df.baseField ? df.baseField.visible !== false : true))
        .map((df) => df.fieldId)
    );
  });

  /**
   * Eligible table IDs. Null if dataset is empty (all eligible).
   */
  readonly eligibleTableIds = computed(() => {
    return this.graphService.getEligibleTableIds(this.activeTableIds(), this.allRelationships());
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
            const visibleFields = table.fields.flatMap((fg) => fg.fields).filter((f) => f.visible);

            const matchingFields = tableMatches
              ? visibleFields
              : visibleFields.filter((field) => {
                  const label = (
                    field.fieldDisplayName.displayValue[locale] ?? String(field.fieldDisplayName.value)
                  ).toLowerCase();
                  const name = field.fieldName.toLowerCase();
                  return label.includes(q) || name.includes(q);
                });

            return {
              ...table,
              matchingFields,
              hasMatches: tableMatches || matchingFields.length > 0
            };
          })
          .filter((t) => t.hasMatches);

        return {
          ...group,
          tables: filteredTables,
          hasMatches: filteredTables.length > 0
        };
      })
      .filter((g) => g.hasMatches);
  });

  /**
   * Total count of matching fields across all filtered tables.
   */
  readonly totalMatchingFields = computed<number>(() => {
    let count = 0;
    for (const g of this.filteredGroupings()) {
      for (const t of g.tables) {
        count += t.matchingFields.length;
      }
    }
    return count;
  });

  /**
   * Splits text into segments indicating whether they match the active search query for visual highlighting.
   */
  highlightMatch(text: string): { part: string; isMatch: boolean }[] {
    const q = this.searchQuery().trim();
    if (!q || !text) {
      return [{ part: text, isMatch: false }];
    }
    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    const parts = text.split(regex);
    return parts.filter(Boolean).map((part) => ({
      part,
      isMatch: part.toLowerCase() === q.toLowerCase()
    }));
  }

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
    return this.graphService.checkFieldSelectability(field, this.activeTableIds(), this.allRelationships());
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
    return field.fieldDisplayName.displayValue[this.i18n.locale()] ?? String(field.fieldDisplayName.value);
  }

  protected getTableLinkedNames(table: Table): string[] {
    const linkedIds = this.graphService.getDirectlyLinkedTableIds(table.tableId, this.allRelationships());
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

  // Schema Loader Modal actions
  protected openSourceModal(): void {
    this.sourceError.set(null);
    this.isSourceModalOpen.set(true);
  }

  protected closeSourceModal(): void {
    this.isSourceModalOpen.set(false);
    this.sourceError.set(null);
  }

  protected setTab(tab: 'presets' | 'file' | 'api' | 'json'): void {
    this.activeTab.set(tab);
    this.sourceError.set(null);
  }

  protected selectPreset(id: string): void {
    this.selectedPresetId.set(id);
  }

  protected onFileSelected(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    if (inputEl.files && inputEl.files.length > 0) {
      this.selectedFile.set(inputEl.files[0]);
      this.sourceError.set(null);
    }
  }

  protected onFileDropped(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      if (file.name.endsWith('.json') || file.type === 'application/json') {
        this.selectedFile.set(file);
        this.sourceError.set(null);
      } else {
        this.sourceError.set('Please drop a valid JSON file');
      }
    }
  }

  protected onModalDragOver(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy';
    }
  }

  protected onApiUrlChange(val: string): void {
    this.apiUrlInput.set(val);
  }

  protected onRawJsonChange(val: string): void {
    this.rawJsonInput.set(val);
  }

  protected onDataPathChange(val: string): void {
    this.dataPathInput.set(val);
  }

  protected async loadSourceSchema(): Promise<void> {
    this.isLoadingSource.set(true);
    this.sourceError.set(null);

    try {
      let result: LoadedSchemaResult;
      const tab = this.activeTab();

      if (tab === 'presets') {
        result = await this.schemaDataLoader.loadSchema({
          type: 'preset',
          presetId: this.selectedPresetId()
        });
      } else if (tab === 'file') {
        const file = this.selectedFile();
        if (!file) {
          throw new Error(this.i18n.translate('noFileSelected'));
        }
        result = await this.schemaDataLoader.loadSchema({
          type: 'file',
          file,
          dataPath: this.dataPathInput().trim() || undefined
        });
      } else if (tab === 'api') {
        const url = this.apiUrlInput().trim();
        if (!url || (!url.startsWith('http://') && !url.startsWith('https://'))) {
          throw new Error(this.i18n.translate('enterValidUrl'));
        }
        result = await this.schemaDataLoader.loadSchema({
          type: 'api',
          url,
          dataPath: this.dataPathInput().trim() || undefined
        });
      } else {
        const json = this.rawJsonInput().trim();
        if (!json) {
          throw new Error(this.i18n.translate('enterValidJson'));
        }
        result = await this.schemaDataLoader.loadSchema({
          type: 'json',
          rawJson: json,
          dataPath: this.dataPathInput().trim() || undefined
        });
      }

      this.loadedSchemaResult.set(result);
      this.groupingsChange.emit(result.groupings);
      if (result.relationships) {
        this.additionalRelationshipsChange.emit(result.relationships);
      }
      this.schemaLoad.emit(result);
      this.closeSourceModal();
    } catch (err: any) {
      this.sourceError.set(err.message || 'Failed to load schema');
    } finally {
      this.isLoadingSource.set(false);
    }
  }
}
