import { describe, expect, it } from 'vitest';
import { Field } from './field.model';
import {
  canModifyFieldCapability,
  createDatasetField,
  getDatasetFieldDisplayLabel,
  getLookupValueDisplayLabel,
} from './dataset-field.model';

describe('dataset-field model', () => {
  const sampleBaseField: Field = {
    fieldId: 'order-total',
    tableId: 'orders',
    fieldGroupingId: 'order-metrics',
    fieldName: 'total',
    fieldDisplayName: {
      value: 'Order total',
      displayValue: { en: 'Order total', fr: 'Total de la commande' },
    },
    dataType: 'currency',
    visible: true,
    isPrimaryKey: false,
    isIndex: false,
    isJoinField: false,
    usableInReports: true,
    filterable: true,
    sortable: true,
    groupable: false,
    aggregationType: 'sum',
  };

  it('creates dataset field inheriting base properties and default aggregation', () => {
    const df = createDatasetField(sampleBaseField);

    expect(df.fieldId).toBe('order-total');
    expect(df.tableId).toBe('orders');
    expect(df.fieldName).toBe('total');
    expect(df.dataType).toBe('currency');
    expect(df.aggregationType).toBe('sum');
    expect(df.filterable).toBe(true);
    expect(df.sortable).toBe(true);
    expect(df.groupable).toBe(false);
    expect(df.visible).toBe(true);
    expect(df.baseField).toBe(sampleBaseField);

    const hiddenBase: Field = { ...sampleBaseField, visible: false };
    const dfHidden = createDatasetField(hiddenBase);
    expect(dfHidden.visible).toBe(false);
  });

  it('formats dynamic display label with aggregation in uppercase', () => {
    const df = createDatasetField(sampleBaseField);

    // With aggregation = sum
    expect(getDatasetFieldDisplayLabel(df, 'en')).toBe('Order total (SUM)');
    expect(getDatasetFieldDisplayLabel(df, 'fr')).toBe('Total de la commande (SUM)');

    // With aggregation = none
    df.aggregationType = 'none';
    expect(getDatasetFieldDisplayLabel(df, 'en')).toBe('Order total');

    // With aggregation = count-distinct
    df.aggregationType = 'count-distinct';
    expect(getDatasetFieldDisplayLabel(df, 'en')).toBe('Order total (COUNT DISTINCT)');
  });

  it('enforces capability modification restrictions based on base field', () => {
    expect(canModifyFieldCapability(sampleBaseField, 'filterable')).toBe(true);
    expect(canModifyFieldCapability(sampleBaseField, 'sortable')).toBe(true);
    expect(canModifyFieldCapability(sampleBaseField, 'groupable')).toBe(false);

    const nonSortableField: Field = {
      ...sampleBaseField,
      sortable: false,
      filterable: false,
    };

    expect(canModifyFieldCapability(nonSortableField, 'sortable')).toBe(false);
    expect(canModifyFieldCapability(nonSortableField, 'filterable')).toBe(false);
  });

  it('inherits lookupValues and resolves localized display label for values', () => {
    const statusField: Field = {
      ...sampleBaseField,
      fieldId: 'order-status',
      fieldName: 'status',
      lookupValues: [
        { value: 'completed', displayValue: { en: 'Completed', fr: 'Complété' } },
        { value: 'processing', displayValue: { en: 'Processing', fr: 'En traitement' } },
        { value: 'shipped', displayValue: { en: 'Shipped', fr: 'Expédié' } },
      ],
    };

    const df = createDatasetField(statusField);
    expect(df.lookupValues).toBeDefined();
    expect(df.lookupValues!.length).toBe(3);

    // English resolution
    expect(getLookupValueDisplayLabel(df, 'completed', 'en')).toBe('Completed');
    expect(getLookupValueDisplayLabel(df, 'processing', 'en')).toBe('Processing');

    // French resolution
    expect(getLookupValueDisplayLabel(df, 'completed', 'fr')).toBe('Complété');
    expect(getLookupValueDisplayLabel(df, 'processing', 'fr')).toBe('En traitement');

    // Unmatched value fallback
    expect(getLookupValueDisplayLabel(df, 'unknown', 'en')).toBe('unknown');
    expect(getLookupValueDisplayLabel(undefined, 'custom', 'en')).toBe('custom');
  });
});
