import { describe, expect, it } from 'vitest';
import { Field } from './field.model';
import {
  canModifyFieldCapability,
  createDatasetField,
  getDatasetFieldDisplayLabel,
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
});
