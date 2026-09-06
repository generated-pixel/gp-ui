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

  it('renders custom data records and maps fields automatically', () => {
    const { fixture, component } = createComponent();
    const dfCust = createDatasetField(sampleField1, 'df_cust');
    const dfTotal = createDatasetField(sampleField2, 'df_tot');

    fixture.componentRef.setInput('fields', [dfCust, dfTotal]);

    // Pass custom records using human-friendly field names
    const customRecords = [
      { customer_name: 'Custom Client Alpha', order_total: 8500 },
      { customer_name: 'Custom Client Beta', order_total: 12400 },
    ];
    fixture.componentRef.setInput('customData', customRecords);
    fixture.detectChanges();

    const rows = component.rows();
    expect(rows).toHaveLength(2);
    expect(rows[0]['df_cust']).toBe('Custom Client Alpha');
    expect(rows[0]['df_tot']).toBe(8500);
    expect(rows[1]['df_cust']).toBe('Custom Client Beta');
    expect(rows[1]['df_tot']).toBe(12400);
  });

  it('automagically groups custom loaded records by selected dimension', () => {
    const { fixture, component } = createComponent();
    const dfCust = { ...createDatasetField(sampleField1, 'df_cust'), isGrouped: true };
    const dfTotal = createDatasetField(sampleField2, 'df_tot');

    fixture.componentRef.setInput('fields', [dfCust, dfTotal]);

    const customRecords = [
      { customer_name: 'Alpha Corp', order_total: 100 },
      { customer_name: 'Alpha Corp', order_total: 200 },
      { customer_name: 'Beta LLC', order_total: 300 },
    ];
    fixture.componentRef.setInput('customData', customRecords);
    fixture.detectChanges();

    expect(component.hasActiveGrouping()).toBe(true);
    const sections = component.groupedRowSections();
    expect(sections).toHaveLength(2);
    expect(sections[0].groupValue).toBe('Alpha Corp');
    expect(sections[0].count).toBe(2);
    expect(sections[1].groupValue).toBe('Beta LLC');
    expect(sections[1].count).toBe(1);
  });

  it('handles loading preset and resetting to simulated data', () => {
    const { fixture, component } = createComponent();
    const dfCust = createDatasetField(sampleField1, 'df_cust');
    fixture.componentRef.setInput('fields', [dfCust]);
    fixture.detectChanges();

    expect(component.isCustomSourceActive()).toBe(false);

    // Load preset
    let emittedResult: any = null;
    component.dataSourceLoaded.subscribe((res) => (emittedResult = res));

    component.loadPreset(
      [{ customer_name: 'External Source Co' }],
      'my-test.json',
    );
    fixture.detectChanges();

    expect(component.isCustomSourceActive()).toBe(true);
    expect(component.loadedSourceResult()?.sourceName).toBe('my-test.json');
    expect(emittedResult?.sourceName).toBe('my-test.json');
    expect(component.rows()[0]['df_cust']).toBe('External Source Co');

    // Reset back to simulated
    let resetEmitted = false;
    component.dataSourceReset.subscribe(() => (resetEmitted = true));

    component.resetToSimulatedData();
    fixture.detectChanges();

    expect(component.isCustomSourceActive()).toBe(false);
    expect(resetEmitted).toBe(true);
  });

  it('filters preview records and formats lookup values with active locale', () => {
    const { fixture, component } = createComponent();
    const statusField: Field = {
      ...sampleField1,
      fieldId: 'f-status',
      fieldName: 'status',
      lookupValues: [
        { value: 'completed', displayValue: { en: 'Completed', fr: 'Complété' } },
        { value: 'pending', displayValue: { en: 'Pending', fr: 'En attente' } },
      ],
    };

    const dfStatus = createDatasetField(statusField, 'df_status');
    fixture.componentRef.setInput('fields', [dfStatus]);

    const customRecords = [
      { df_status: 'completed' },
      { df_status: 'pending' },
      { df_status: 'completed' },
    ];
    fixture.componentRef.setInput('customData', customRecords);
    fixture.detectChanges();

    // Verify unfiltered count
    expect(component.rows().length).toBe(3);
    expect(component.filteredRows().length).toBe(3);

    // Apply filter: status == 'completed'
    fixture.componentRef.setInput('filters', [
      { fieldId: 'df_status', operator: 'eq', value: 'completed' },
    ]);
    fixture.detectChanges();

    expect(component.filteredRows().length).toBe(2);

    // Verify cell formatting in English
    const col = component.columns()[0];
    expect(component.formatCellValue(col, 'completed')).toBe('Completed');
    expect(component.formatCellValue(col, 'pending')).toBe('Pending');

    // Switch to French and verify translated cell values
    const i18n = TestBed.inject(GpTranslationService);
    i18n.setLocale('fr');
    expect(component.formatCellValue(col, 'completed')).toBe('Complété');
    expect(component.formatCellValue(col, 'pending')).toBe('En attente');
  });
});
