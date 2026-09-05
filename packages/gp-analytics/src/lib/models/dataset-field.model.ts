import { AggregationType } from './aggregation-type.model';
import { DataType, FieldType } from './data-type.model';
import { Field } from './field.model';
import { LocalizedValue } from './localized-value.model';

/**
 * DatasetField represents a field configured as part of a user-defined dataset.
 * It is decoupled from the base Field schema, storing custom aggregation,
 * filterable, sortable, and groupable flags restricted by base capabilities.
 */
export interface DatasetField {
  datasetFieldId: string;
  fieldId: string;
  tableId: string;
  fieldName: string;
  fieldDisplayName: LocalizedValue;
  dataType: DataType | `${DataType}`;
  fieldType?: FieldType | `${FieldType}`;
  format?: string;

  /**
   * Visibility flag inherited from base Field schema.
   */
  visible: boolean;

  /**
   * Aggregation type selected for this dataset field.
   */
  aggregationType: AggregationType;

  /**
   * Whether this dataset field can be filtered.
   * Can only be true if baseField.filterable is true.
   */
  filterable: boolean;

  /**
   * Whether this dataset field can be sorted.
   * Can only be true if baseField.sortable is true.
   */
  sortable: boolean;

  /**
   * Whether this dataset field can be grouped.
   * Can only be true if baseField.groupable is true.
   */
  groupable: boolean;

  /**
   * Whether this dataset field is actively marked as a grouped dimension (Group By).
   * Can only be true if baseField.groupable is true.
   */
  isGrouped?: boolean;

  /**
   * Reference to the base Field schema for capability validation.
   */
  baseField: Field;
}

/**
 * Creates a new DatasetField instance from a base Field schema.
 * Initial values inherit from base Field, but flags can never exceed base capabilities.
 */
export function createDatasetField(baseField: Field, customId?: string): DatasetField {
  const uid =
    customId ??
    `df_${baseField.fieldId}_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;

  return {
    datasetFieldId: uid,
    fieldId: baseField.fieldId,
    tableId: baseField.tableId,
    fieldName: baseField.fieldName,
    fieldDisplayName: baseField.fieldDisplayName,
    dataType: baseField.dataType,
    format: baseField.format,
    visible: baseField.visible,
    aggregationType: baseField.aggregationType ?? 'none',
    filterable: baseField.filterable,
    sortable: baseField.sortable,
    groupable: baseField.groupable,
    isGrouped: false,
    baseField,
  };
}

/**
 * Computes the dynamic display label for a DatasetField:
 * - If aggregation is 'none' or absent: returns base localized display value.
 * - If aggregation is applied: returns "BASE_DISPLAY_VALUE (AGGREGATION_TYPE)"
 *   e.g. "Order total (SUM)" or "Customer name (COUNT DISTINCT)".
 */
export function getDatasetFieldDisplayLabel(
  field: Pick<DatasetField, 'fieldDisplayName' | 'aggregationType'>,
  locale: string = 'en',
): string {
  const baseLabel =
    field.fieldDisplayName?.displayValue?.[locale] ??
    (field.fieldDisplayName?.value != null ? String(field.fieldDisplayName.value) : '');

  if (!field.aggregationType || field.aggregationType === 'none') {
    return baseLabel;
  }

  const formattedAgg = field.aggregationType.replace('-', ' ').toUpperCase();
  return `${baseLabel} (${formattedAgg})`;
}

/**
 * Validates whether a capability (filterable, sortable, groupable) can be modified
 * on a DatasetField based on the underlying Field schema.
 */
export function canModifyFieldCapability(
  baseField: Field,
  capability: 'filterable' | 'sortable' | 'groupable',
): boolean {
  return Boolean(baseField?.[capability]);
}
