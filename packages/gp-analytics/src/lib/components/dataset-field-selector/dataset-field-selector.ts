import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GpAnalyticsComponent } from '../base/gp-analytics-component';
import {
  AggregationType,
  DatasetField,
  Field,
  GpFilterCondition,
  GpFilterOperator,
  getDatasetFieldDisplayLabel,
  getLookupValueDisplayLabel,
} from '../../models';

export type ListGroupingMode = 'none' | 'table' | 'role';

export interface FieldListSection {
  id: string;
  title: string;
  icon: string;
  fields: { field: DatasetField; globalIndex: number }[];
}

@Component({
  selector: 'gp-dataset-field-selector',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './dataset-field-selector.html',
  styleUrl: './dataset-field-selector.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GpDatasetFieldSelector extends GpAnalyticsComponent {
  /**
   * The list of fields configured in the current dataset.
   */
  readonly fields = input<DatasetField[]>([]);

  /**
   * Dataset-level filters applied to records.
   */
  readonly filters = input<GpFilterCondition[]>([]);

  /**
   * Current grouping mode for the dataset fields list ('none', 'table', 'role').
   */
  readonly listGrouping = model<ListGroupingMode>('none');

  /**
   * Currently active/selected dataset field ID for the properties panel.
   */
  readonly selectedFieldId = model<string | null>(null);

  /**
   * Emitted whenever the fields array or any field property changes.
   */
  readonly fieldsChange = output<DatasetField[]>();

  /**
   * Emitted whenever dataset filters change.
   */
  readonly filtersChange = output<GpFilterCondition[]>();

  /**
   * Emitted when a field is dropped into the component from the schema catalogue.
   */
  readonly fieldDrop = output<Field>();

  /**
   * Emitted when a field is removed.
   */
  readonly fieldRemove = output<string>();

  /**
   * Active tab in the selector workbench: 'fields' or 'filters'.
   */
  readonly activeTab = signal<'fields' | 'filters'>('fields');

  /**
   * State for the inline Add Filter card.
   */
  readonly isAddingFilter = signal<boolean>(false);
  readonly newFilterFieldId = signal<string>('');
  readonly newFilterOperator = signal<GpFilterOperator>('eq');
  readonly newFilterValue = signal<any>('');
  readonly newFilterSelectedItems = signal<string[]>([]);

  /**
   * Visual drag-over state for drop-zone.
   */
  protected readonly isDragOver = signal<boolean>(false);

  /**
   * Dragged item index for reordering within the dataset fields list.
   */
  protected readonly draggedIndex = signal<number | null>(null);

  /**
   * Hovered item index during drag over.
   */
  protected readonly dropTargetIndex = signal<number | null>(null);

  /**
   * Position relative to target ('before' or 'after').
   */
  protected readonly dropPosition = signal<'before' | 'after' | null>(null);

  /**
   * Collapsed state for grouped list sections.
   */
  protected readonly collapsedGroups = signal<Set<string>>(new Set());

  /**
   * Filtered dataset fields ensuring only visible fields are available.
   */
  readonly visibleFields = computed<DatasetField[]>(() => {
    return this.fields().filter(
      (f) => f.visible !== false && (f.baseField ? f.baseField.visible !== false : true),
    );
  });

  /**
   * Organizes visible fields into sections based on listGrouping mode.
   */
  readonly groupedSections = computed<FieldListSection[]>(() => {
    const list = this.visibleFields();
    const mode = this.listGrouping();

    if (mode === 'none') {
      return [
        {
          id: 'all',
          title: '',
          icon: '',
          fields: list.map((field, globalIndex) => ({ field, globalIndex })),
        },
      ];
    }

    if (mode === 'table') {
      const tableMap = new Map<string, { field: DatasetField; globalIndex: number }[]>();
      list.forEach((field, globalIndex) => {
        const key = field.tableId || 'other';
        if (!tableMap.has(key)) {
          tableMap.set(key, []);
        }
        tableMap.get(key)!.push({ field, globalIndex });
      });

      return Array.from(tableMap.entries()).map(([tableId, items]) => {
        const rawName = items[0]?.field?.baseField?.tableId ?? tableId;
        const formattedTitle = rawName.replace(/^table[-_]/i, '').replace(/[-_]/g, ' ');
        const capitalized = formattedTitle.charAt(0).toUpperCase() + formattedTitle.slice(1);

        return {
          id: `table-${tableId}`,
          title: capitalized,
          icon: '📁',
          fields: items,
        };
      });
    }

    if (mode === 'role') {
      const dimensions: { field: DatasetField; globalIndex: number }[] = [];
      const measures: { field: DatasetField; globalIndex: number }[] = [];

      list.forEach((field, globalIndex) => {
        const isMeasure = field.aggregationType && field.aggregationType !== 'none';
        if (isMeasure) {
          measures.push({ field, globalIndex });
        } else {
          dimensions.push({ field, globalIndex });
        }
      });

      const sections: FieldListSection[] = [];
      if (dimensions.length > 0 || measures.length === 0) {
        sections.push({
          id: 'role-dimensions',
          title: this.i18n.translate('dimensions'),
          icon: '📊',
          fields: dimensions,
        });
      }
      if (measures.length > 0) {
        sections.push({
          id: 'role-measures',
          title: this.i18n.translate('measures'),
          icon: '📈',
          fields: measures,
        });
      }
      return sections;
    }

    return [];
  });

  /**
   * The currently selected DatasetField instance for editing in the properties panel.
   */
  readonly activeField = computed<DatasetField | null>(() => {
    const list = this.visibleFields();
    const id = this.selectedFieldId();
    if (!id) {
      return list.length > 0 ? list[0] : null;
    }
    return list.find((f) => f.datasetFieldId === id) ?? (list.length > 0 ? list[0] : null);
  });

  /**
   * Available aggregation options based on the active field's data type.
   */
  readonly availableAggregations = computed<{ value: AggregationType; label: string }[]>(() => {
    const field = this.activeField();
    if (!field) {
      return [];
    }

    const allOptions: { value: AggregationType; labelKey: string }[] = [
      { value: 'none', labelKey: 'raw' },
      { value: 'sum', labelKey: 'sum' },
      { value: 'average', labelKey: 'average' },
      { value: 'min', labelKey: 'min' },
      { value: 'max', labelKey: 'max' },
      { value: 'count', labelKey: 'count' },
      { value: 'count-distinct', labelKey: 'countDistinct' },
    ];

    const numericTypes = ['currency', 'number', 'integer', 'decimal'];
    const isNumeric = numericTypes.includes(field.dataType);

    // Numeric types support all aggregations.
    // Non-numeric types only support none, count, count-distinct, min, max.
    const allowed = isNumeric
      ? allOptions
      : allOptions.filter((opt) => ['none', 'count', 'count-distinct', 'min', 'max'].includes(opt.value));

    return allowed.map((opt) => ({
      value: opt.value,
      label: this.i18n.translate(opt.labelKey as any),
    }));
  });

  /**
   * Fields that can be filtered (visible and filterable !== false on both dataset and baseField).
   */
  readonly filterableFields = computed<DatasetField[]>(() => {
    return this.visibleFields().filter(
      (f) => f.filterable !== false && (f.baseField ? f.baseField.filterable !== false : true),
    );
  });

  /**
   * Currently selected field in the Add Filter form.
   */
  readonly selectedFilterField = computed<DatasetField | null>(() => {
    const id = this.newFilterFieldId();
    if (!id) return null;
    return (
      this.fields().find((f) => f.datasetFieldId === id || f.fieldId === id || f.fieldName === id) ??
      null
    );
  });

  /**
   * Translated lookup options if the selected filter field has lookupValues.
   */
  readonly filterFieldLookupValues = computed(() => {
    return this.selectedFilterField()?.lookupValues ?? [];
  });

  /**
   * Available filter operators based on selected filter field and whether it has lookupValues.
   */
  readonly availableFilterOperators = computed<{ value: GpFilterOperator; label: string }[]>(() => {
    const field = this.selectedFilterField();
    const hasLookups = (field?.lookupValues && field.lookupValues.length > 0) ?? false;

    if (hasLookups) {
      return [
        { value: 'eq', label: this.i18n.translate('equals') },
        { value: 'neq', label: this.i18n.translate('notEquals') },
        { value: 'in', label: this.i18n.translate('inList') },
      ];
    }

    const type = field?.dataType ?? 'string';
    const isNumeric = ['number', 'integer', 'decimal', 'currency'].includes(type);
    const isDate = ['date', 'datetime'].includes(type);

    if (isNumeric || isDate) {
      return [
        { value: 'eq', label: this.i18n.translate('equals') },
        { value: 'neq', label: this.i18n.translate('notEquals') },
        { value: 'gt', label: this.i18n.translate('greaterThan') },
        { value: 'gte', label: this.i18n.translate('greaterOrEqual') },
        { value: 'lt', label: this.i18n.translate('lessThan') },
        { value: 'lte', label: this.i18n.translate('lessOrEqual') },
        { value: 'isNull', label: this.i18n.translate('isNull') },
        { value: 'isNotNull', label: this.i18n.translate('isNotNull') },
      ];
    }

    return [
      { value: 'eq', label: this.i18n.translate('equals') },
      { value: 'neq', label: this.i18n.translate('notEquals') },
      { value: 'contains', label: this.i18n.translate('contains') },
      { value: 'startsWith', label: this.i18n.translate('startsWith') },
      { value: 'in', label: this.i18n.translate('inList') },
      { value: 'isNull', label: this.i18n.translate('isNull') },
      { value: 'isNotNull', label: this.i18n.translate('isNotNull') },
    ];
  });

  // --- Filter Management Methods ---

  setActiveTab(tab: 'fields' | 'filters'): void {
    this.activeTab.set(tab);
  }

  startAddFilter(preselectedFieldId?: string): void {
    const fields = this.filterableFields();
    if (fields.length === 0) {
      return;
    }
    const targetField =
      (preselectedFieldId
        ? fields.find(
            (f) =>
              f.datasetFieldId === preselectedFieldId ||
              f.fieldId === preselectedFieldId ||
              f.fieldName === preselectedFieldId,
          )
        : null) ?? fields[0];

    this.newFilterFieldId.set(targetField.datasetFieldId);
    this.newFilterOperator.set('eq');

    if (targetField.lookupValues && targetField.lookupValues.length > 0) {
      this.newFilterValue.set(targetField.lookupValues[0].value);
      this.newFilterSelectedItems.set([String(targetField.lookupValues[0].value)]);
    } else {
      this.newFilterValue.set('');
      this.newFilterSelectedItems.set([]);
    }

    this.isAddingFilter.set(true);
  }

  cancelAddFilter(): void {
    this.isAddingFilter.set(false);
  }

  onFilterFieldChange(fieldId: string): void {
    this.newFilterFieldId.set(fieldId);
    const field = this.fields().find((f) => f.datasetFieldId === fieldId || f.fieldId === fieldId);
    this.newFilterOperator.set('eq');

    if (field?.lookupValues && field.lookupValues.length > 0) {
      this.newFilterValue.set(field.lookupValues[0].value);
      this.newFilterSelectedItems.set([String(field.lookupValues[0].value)]);
    } else {
      this.newFilterValue.set('');
      this.newFilterSelectedItems.set([]);
    }
  }

  toggleMultiSelectValue(val: string): void {
    const current = new Set(this.newFilterSelectedItems());
    if (current.has(val)) {
      current.delete(val);
    } else {
      current.add(val);
    }
    this.newFilterSelectedItems.set(Array.from(current));
    this.newFilterValue.set(Array.from(current));
  }

  applyNewFilter(): void {
    const fieldId = this.newFilterFieldId();
    if (!fieldId) {
      return;
    }

    const op = this.newFilterOperator();
    const field = this.selectedFilterField();
    let val = this.newFilterValue();

    if (op === 'isNull' || op === 'isNotNull') {
      val = null;
    } else if (op === 'in') {
      if (field?.lookupValues && field.lookupValues.length > 0) {
        val = this.newFilterSelectedItems();
      } else if (typeof val === 'string') {
        val = val.split(',').map((s) => s.trim()).filter(Boolean);
      }
      if (!Array.isArray(val) || val.length === 0) {
        return;
      }
    } else {
      if (val === '' || val === null || val === undefined) {
        return;
      }
      const isNumeric = ['number', 'integer', 'decimal', 'currency'].includes(field?.dataType ?? '');
      if (isNumeric && !isNaN(Number(val))) {
        val = Number(val);
      }
    }

    const condition: GpFilterCondition = {
      fieldId,
      operator: op,
      value: val,
    };

    const updated = [...this.filters(), condition];
    this.filtersChange.emit(updated);
    this.isAddingFilter.set(false);
  }

  removeFilter(index: number): void {
    const updated = this.filters().filter((_, i) => i !== index);
    this.filtersChange.emit(updated);
  }

  clearAllFilters(): void {
    this.filtersChange.emit([]);
  }

  filterByField(field: DatasetField): void {
    this.activeTab.set('filters');
    this.startAddFilter(field.datasetFieldId);
  }

  getFilterFieldDisplayLabel(fieldId: string): string {
    const field = this.fields().find(
      (f) => f.datasetFieldId === fieldId || f.fieldId === fieldId || f.fieldName === fieldId,
    );
    if (!field) return fieldId;
    return getDatasetFieldDisplayLabel(field, this.i18n.locale());
  }

  getFilterOperatorLabel(operator: GpFilterOperator): string {
    switch (operator) {
      case 'eq':
        return '=';
      case 'neq':
        return '!=';
      case 'gt':
        return '>';
      case 'gte':
        return '>=';
      case 'lt':
        return '<';
      case 'lte':
        return '<=';
      case 'in':
        return this.i18n.translate('inList');
      case 'contains':
        return this.i18n.translate('contains');
      case 'startsWith':
        return this.i18n.translate('startsWith');
      case 'isNull':
        return this.i18n.translate('isNull');
      case 'isNotNull':
        return this.i18n.translate('isNotNull');
      default:
        return operator;
    }
  }

  getFilterValueDisplay(condition: GpFilterCondition): string {
    if (condition.operator === 'isNull' || condition.operator === 'isNotNull') {
      return '';
    }

    const field = this.fields().find(
      (f) =>
        f.datasetFieldId === condition.fieldId ||
        f.fieldId === condition.fieldId ||
        f.fieldName === condition.fieldId,
    );

    const locale = this.i18n.locale();

    if (Array.isArray(condition.value)) {
      return condition.value
        .map((v) => getLookupValueDisplayLabel(field, v, locale))
        .join(', ');
    }

    return getLookupValueDisplayLabel(field, condition.value, locale);
  }

  /**
   * Dynamic display label for a dataset field.
   */
  protected getDisplayLabel(field: DatasetField): string {
    return getDatasetFieldDisplayLabel(field, this.i18n.locale());
  }

  /**
   * Base localized display label for a dataset field.
   */
  protected getBaseDisplayName(field: DatasetField): string {
    return (
      field.fieldDisplayName?.displayValue?.[this.i18n.locale()] ??
      (field.fieldDisplayName?.value != null ? String(field.fieldDisplayName.value) : '')
    );
  }

  /**
   * Selects a field to inspect/edit in the properties panel.
   */
  protected selectField(fieldId: string): void {
    this.selectedFieldId.set(fieldId);
  }

  /**
   * Removes a field from the dataset.
   */
  protected removeField(datasetFieldId: string, event?: Event): void {
    event?.stopPropagation();
    const updated = this.fields().filter((f) => f.datasetFieldId !== datasetFieldId);
    this.fieldsChange.emit(updated);
    this.fieldRemove.emit(datasetFieldId);

    if (this.selectedFieldId() === datasetFieldId) {
      this.selectedFieldId.set(updated.length > 0 ? updated[0].datasetFieldId : null);
    }
  }

  /**
   * Clears all fields from the dataset.
   */
  protected clearAllFields(): void {
    this.fieldsChange.emit([]);
    this.selectedFieldId.set(null);
  }

  /**
   * Updates aggregation type for the active field.
   */
  protected updateAggregation(agg: AggregationType): void {
    const field = this.activeField();
    if (!field) {
      return;
    }
    this.updateFieldProperty(field.datasetFieldId, { aggregationType: agg });
  }

  /**
   * Updates filterable flag.
   * Can only be changed if baseField.filterable is true!
   */
  protected updateFilterable(checked: boolean): void {
    const field = this.activeField();
    if (!field || !field.baseField.filterable) {
      return;
    }
    this.updateFieldProperty(field.datasetFieldId, { filterable: checked });
  }

  /**
   * Updates sortable flag.
   * Can only be changed if baseField.sortable is true!
   */
  protected updateSortable(checked: boolean): void {
    const field = this.activeField();
    if (!field || !field.baseField.sortable) {
      return;
    }
    this.updateFieldProperty(field.datasetFieldId, { sortable: checked });
  }

  /**
   * Updates groupable flag.
   * Can only be changed if baseField.groupable is true!
   */
  protected updateGroupable(checked: boolean): void {
    const field = this.activeField();
    if (!field || !field.baseField.groupable) {
      return;
    }
    this.updateFieldProperty(field.datasetFieldId, {
      groupable: checked,
      isGrouped: checked ? field.isGrouped : false,
    });
  }

  /**
   * Updates isGrouped flag.
   * Can only be changed if baseField.groupable is true!
   */
  protected updateIsGrouped(checked: boolean): void {
    const field = this.activeField();
    if (!field || !field.baseField.groupable) {
      return;
    }
    this.updateFieldProperty(field.datasetFieldId, { isGrouped: checked });
  }

  /**
   * Directly toggles 'Group By' (isGrouped) on a specific field chip.
   */
  protected toggleFieldGroupBy(datasetFieldId: string, event?: Event): void {
    event?.stopPropagation();
    const field = this.fields().find((f) => f.datasetFieldId === datasetFieldId);
    if (!field || !field.baseField.groupable) {
      return;
    }
    const currentVal = field.isGrouped ?? false;
    this.updateFieldProperty(datasetFieldId, { isGrouped: !currentVal });
  }

  /**
   * Switches the active list grouping mode.
   */
  protected setGroupingMode(mode: ListGroupingMode): void {
    this.listGrouping.set(mode);
  }

  /**
   * Toggles collapsed state of a grouped list section.
   */
  protected toggleGroupCollapse(groupId: string): void {
    const current = new Set(this.collapsedGroups());
    if (current.has(groupId)) {
      current.delete(groupId);
    } else {
      current.add(groupId);
    }
    this.collapsedGroups.set(current);
  }

  /**
   * Returns whether a grouped list section is collapsed.
   */
  protected isGroupCollapsed(groupId: string): boolean {
    return this.collapsedGroups().has(groupId);
  }

  private updateFieldProperty(
    datasetFieldId: string,
    changes: Partial<DatasetField>,
  ): void {
    const updated = this.fields().map((f) => {
      if (f.datasetFieldId === datasetFieldId) {
        return { ...f, ...changes };
      }
      return f;
    });
    this.fieldsChange.emit(updated);
  }

  // --- Drop Zone for external fields dropped from catalogue ---
  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy';
    }
    this.isDragOver.set(true);
  }

  protected onDragLeave(event: DragEvent): void {
    // Only reset if leaving the drop container
    const relatedTarget = event.relatedTarget as HTMLElement | null;
    const currentTarget = event.currentTarget as HTMLElement | null;
    if (!currentTarget?.contains(relatedTarget)) {
      this.isDragOver.set(false);
    }
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver.set(false);

    // If this drop was an internal list reorder, ignore in outer container
    const types = event.dataTransfer?.types ? Array.from(event.dataTransfer.types) : [];
    if (types.includes('application/x-gp-field-reorder')) {
      return;
    }

    const json = event.dataTransfer?.getData('application/json');
    if (json) {
      try {
        const field = JSON.parse(json) as Field;
        if (field && field.fieldId && field.visible) {
          this.fieldDrop.emit(field);
        }
      } catch (err) {
        console.warn('Invalid dropped field payload', err);
      }
    }
  }

  // --- Reordering within the dataset fields list ---
  protected onListDragStart(event: DragEvent, index: number): void {
    this.draggedIndex.set(index);
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', String(index));
      event.dataTransfer.setData('application/x-gp-field-reorder', String(index));
    }
  }

  protected onListDragOver(event: DragEvent, index: number): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.draggedIndex() === null) {
      return;
    }
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }

    const targetEl = event.currentTarget as HTMLElement;
    const rect = targetEl.getBoundingClientRect();
    const offset = event.clientY - rect.top;
    const pos: 'before' | 'after' = offset < rect.height / 2 ? 'before' : 'after';

    this.dropTargetIndex.set(index);
    this.dropPosition.set(pos);
  }

  protected onListDragLeave(event: DragEvent, index: number): void {
    const related = event.relatedTarget as HTMLElement | null;
    const current = event.currentTarget as HTMLElement | null;
    if (!current?.contains(related) && this.dropTargetIndex() === index) {
      this.dropTargetIndex.set(null);
      this.dropPosition.set(null);
    }
  }

  protected onListDrop(event: DragEvent, targetIndex: number): void {
    event.preventDefault();
    event.stopPropagation();

    const sourceIndex = this.draggedIndex();
    const pos = this.dropPosition();

    this.draggedIndex.set(null);
    this.dropTargetIndex.set(null);
    this.dropPosition.set(null);

    if (sourceIndex === null) {
      return;
    }

    let destination = pos === 'after' ? targetIndex + 1 : targetIndex;
    if (sourceIndex < destination) {
      destination -= 1;
    }

    if (sourceIndex === destination) {
      return;
    }

    const list = [...this.visibleFields()];
    const [moved] = list.splice(sourceIndex, 1);
    list.splice(destination, 0, moved);
    this.fieldsChange.emit(list);
  }

  protected onListDragEnd(): void {
    this.draggedIndex.set(null);
    this.dropTargetIndex.set(null);
    this.dropPosition.set(null);
  }

  protected moveItem(index: number, direction: 'up' | 'down', event?: Event): void {
    event?.stopPropagation();
    const target = direction === 'up' ? index - 1 : index + 1;
    const list = [...this.visibleFields()];
    if (target < 0 || target >= list.length) {
      return;
    }
    const [moved] = list.splice(index, 1);
    list.splice(target, 0, moved);
    this.fieldsChange.emit(list);
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
