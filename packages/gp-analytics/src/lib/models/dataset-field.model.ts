export * from '../interfaces/dataset-field.interface';

import { DatasetField } from '../interfaces/dataset-field.interface';
import { Field } from '../interfaces/field.interface';

/**
 * Creates a new DatasetField instance from a base Field schema.
 * Initial values inherit from base Field, but flags can never exceed base capabilities.
 */
export function createDatasetField(baseField: Field, customId?: string): DatasetField {
  const uid =
    customId ?? `df_${baseField.fieldId}_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;

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
    lookupValues: baseField.lookupValues ? [...baseField.lookupValues] : undefined,
    currencyCode: baseField.currencyCode,
    currencyField: baseField.currencyField,
    baseField
  };
}

/**
 * Resolves the localized display value for a lookup list item.
 * If the field has lookupValues matching the given value, returns the translated string in the given locale.
 * Otherwise falls back to String(val).
 */
export function getLookupValueDisplayLabel(
  field: DatasetField | Field | undefined,
  val: any,
  locale: string = 'en'
): string {
  if (val == null) return '';
  if (field?.lookupValues && field.lookupValues.length > 0) {
    const match = field.lookupValues.find((item) => item.value === val || String(item.value) === String(val));
    if (match) {
      return match.displayValue?.[locale] ?? match.displayValue?.['en'] ?? String(match.value);
    }
  }
  return String(val);
}

/**
 * Computes the dynamic display label for a DatasetField:
 * - If aggregation is 'none' or absent: returns base localized display value.
 * - If aggregation is applied: returns "BASE_DISPLAY_VALUE (AGGREGATION_TYPE)"
 *   e.g. "Order total (SUM)" or "Customer name (COUNT DISTINCT)".
 */
export function getDatasetFieldDisplayLabel(
  field: Pick<DatasetField, 'fieldDisplayName' | 'aggregationType'>,
  locale: string = 'en'
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
  capability: 'filterable' | 'sortable' | 'groupable'
): boolean {
  return Boolean(baseField?.[capability]);
}
