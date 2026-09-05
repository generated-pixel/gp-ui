import { describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { GpDatasetPreview } from './dataset-preview';
import { Field, createDatasetField } from '../../models';
import { GpTranslationService } from '../../services/translation.service';

describe('GpDatasetPreview', () => {
  const sampleField1: Field = {
    fieldId: 'f1',
    tableId: 'customers',
    fieldGroupingId: 'fg1',
    fieldName: 'customer_name',
    fieldDisplayName: { value: 'Customer Name', displayValue: { en: 'Customer Name' } },
    dataType: 'string',
    visible: true,
    isPrimaryKey: false,
    isIndex: false,
    isJoinField: false,
    usableInReports: true,
    filterable: true,
    sortable: true,
    groupable: true,
  };

  const sampleField2: Field = {
    fieldId: 'f2',
    tableId: 'orders',
    fieldGroupingId: 'fg1',
    fieldName: 'order_total',
    fieldDisplayName: { value: 'Total', displayValue: { en: 'Total' } },
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

  function createComponent() {
    TestBed.configureTestingModule({
      imports: [GpDatasetPreview],
      providers: [GpTranslationService],
    });
    const fixture = TestBed.createComponent(GpDatasetPreview);
    const component = fixture.componentInstance;
    return { fixture, component };
  }

  it('computes columns with dynamic labels including aggregation', () => {
    const { fixture, component } = createComponent();
    const df1 = createDatasetField(sampleField1);
    const df2 = createDatasetField(sampleField2); // aggregation = sum

    fixture.componentRef.setInput('fields', [df1, df2]);
    fixture.detectChanges();

    const cols = component.columns();
    expect(cols.length).toBe(2);
    expect(cols[0].header).toBe('Customer Name');
    expect(cols[1].header).toBe('Total (SUM)');
  });

  it('generates simulated data rows for populated fields', () => {
    const { fixture, component } = createComponent();
    const df1 = createDatasetField(sampleField1);
    const df2 = createDatasetField(sampleField2);

    fixture.componentRef.setInput('fields', [df1, df2]);
    fixture.detectChanges();

    const rows = component.rows();
    expect(rows.length).toBe(6); // Default 6 rows
    expect(rows[0][df1.datasetFieldId]).toBeDefined();
    expect(rows[0][df2.datasetFieldId]).toBeDefined();
  });

  it('renders custom data if provided', () => {
    const { fixture, component } = createComponent();
    const df1 = createDatasetField(sampleField1);

    const mockRecords = [
      { _id: '1', [df1.datasetFieldId]: 'Custom Alpha' },
      { _id: '2', [df1.datasetFieldId]: 'Custom Beta' },
    ];

    fixture.componentRef.setInput('fields', [df1]);
    fixture.componentRef.setInput('customData', mockRecords);
    fixture.detectChanges();

    const rows = component.rows();
    expect(rows.length).toBe(2);
    expect(rows[0][df1.datasetFieldId]).toBe('Custom Alpha');
  });

  it('toggles column sort order on click', () => {
    const { fixture, component } = createComponent();
    const df1 = createDatasetField(sampleField1);

    fixture.componentRef.setInput('fields', [df1]);
    fixture.detectChanges();

    const col = component.columns()[0];
    component['onHeaderClick'](col);
    expect(component['sortColumn']()).toBe(col.datasetFieldId);
    expect(component['sortOrder']()).toBe(1);

    // Toggle again -> reverse order
    component['onHeaderClick'](col);
    expect(component['sortOrder']()).toBe(-1);
  });

  it('excludes non-visible fields from preview columns and rows', () => {
    const { fixture, component } = createComponent();
    const visibleDf = createDatasetField(sampleField1);
    const hiddenField: Field = {
      ...sampleField2,
      fieldId: 'f-hidden',
      fieldName: 'hidden_total',
      visible: false,
    };
    const hiddenDf = createDatasetField(hiddenField);

    fixture.componentRef.setInput('fields', [visibleDf, hiddenDf]);
    fixture.detectChanges();

    expect(component.columns().length).toBe(1);
    expect(component.columns()[0].fieldId).toBe('f1');
  });

  it('automagically shows flat table if nothing is selected for grouping, and groups by dimension when selected', () => {
    const { fixture, component } = createComponent();
    const dfCust = createDatasetField(sampleField1);
    const dfTotal = createDatasetField(sampleField2);

    // Initial state: nothing selected for grouping (isGrouped: false on both)
    fixture.componentRef.setInput('fields', [dfCust, dfTotal]);
    fixture.detectChanges();

    expect(component.hasActiveGrouping()).toBe(false);
    expect(component.primaryGroupColumn()).toBeNull();
    expect(component.groupedRowSections().length).toBe(1);
    expect(component.groupedRowSections()[0].groupValue).toBe(''); // Flat table!

    // Automagic: mark dfCust as selected for grouping
    const groupedCust = { ...dfCust, isGrouped: true };
    fixture.componentRef.setInput('fields', [groupedCust, dfTotal]);
    fixture.detectChanges();

    expect(component.hasActiveGrouping()).toBe(true);
    expect(component.primaryGroupColumn()?.fieldId).toBe('f1');
    const sections = component.groupedRowSections();
    expect(sections.length).toBeGreaterThanOrEqual(2);
    expect(sections[0].groupValue).toBe('Northwind Trading');
    expect(sections[0].rows.length).toBe(2);
    expect(sections[1].groupValue).toBe('Acme Industrial Corp');

    // Automagic: deselect grouping again -> immediately returns to flat table
    fixture.componentRef.setInput('fields', [dfCust, dfTotal]);
    fixture.detectChanges();
    expect(component.hasActiveGrouping()).toBe(false);
    expect(component.groupedRowSections().length).toBe(1);
  });
});
