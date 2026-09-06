import { describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { GpSchemaCatalogue } from './schema-catalogue';
import { Field, Grouping, Relationship, createDatasetField } from '../../models';
import { GpTranslationService } from '../../services/translation.service';

describe('GpSchemaCatalogue', () => {
  const mockField1: Field = {
    fieldId: 'cust-id',
    tableId: 'customers',
    fieldGroupingId: 'cust-main',
    fieldName: 'id',
    fieldDisplayName: { value: 'Customer ID', displayValue: { en: 'Customer ID', fr: 'ID Client' } },
    dataType: 'guid',
    visible: true,
    isPrimaryKey: true,
    isIndex: true,
    isJoinField: true,
    usableInReports: true,
    filterable: true,
    sortable: true,
    groupable: true,
  };

  const mockField2: Field = {
    fieldId: 'cust-name',
    tableId: 'customers',
    fieldGroupingId: 'cust-main',
    fieldName: 'name',
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

  const mockOrdersField: Field = {
    fieldId: 'order-total',
    tableId: 'orders',
    fieldGroupingId: 'ord-main',
    fieldName: 'total',
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
  };

  const mockEmployeesField: Field = {
    fieldId: 'emp-name',
    tableId: 'employees',
    fieldGroupingId: 'emp-main',
    fieldName: 'emp_name',
    fieldDisplayName: { value: 'Employee Name', displayValue: { en: 'Employee Name' } },
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

  const mockGrouping: Grouping = {
    groupingId: 'commerce',
    groupingName: 'Commerce',
    relationships: [
      {
        relationshipId: 'cust-orders-rel',
        name: 'Customers to Orders',
        sourceTableId: 'customers',
        sourceFieldId: 'cust-id',
        targetTableId: 'orders',
        targetFieldId: 'order-cust-id',
        cardinality: 'one-to-many',
      },
    ],
    tables: [
      {
        tableId: 'customers',
        tableName: 'Customers',
        groupingId: 'commerce',
        fields: [{ fieldGroupingId: 'cust-main', fieldGroupingName: 'Main', tableId: 'customers', fields: [mockField1, mockField2] }],
      },
      {
        tableId: 'orders',
        tableName: 'Orders',
        groupingId: 'commerce',
        fields: [{ fieldGroupingId: 'ord-main', fieldGroupingName: 'Main', tableId: 'orders', fields: [mockOrdersField] }],
      },
      {
        tableId: 'employees',
        tableName: 'Employees',
        groupingId: 'commerce',
        fields: [{ fieldGroupingId: 'emp-main', fieldGroupingName: 'Main', tableId: 'employees', fields: [mockEmployeesField] }],
      },
    ],
  };

  function createComponent() {
    TestBed.configureTestingModule({
      imports: [GpSchemaCatalogue],
      providers: [GpTranslationService],
    });
    const fixture = TestBed.createComponent(GpSchemaCatalogue);
    const component = fixture.componentInstance;
    return { fixture, component };
  }

  it('initializes and computes all tables as eligible when dataset is empty', () => {
    const { fixture, component } = createComponent();
    fixture.componentRef.setInput('groupings', [mockGrouping]);
    fixture.componentRef.setInput('activeDatasetFields', []);
    fixture.detectChanges();

    expect(component.eligibleTableIds()).toBeNull(); // All eligible
    expect(component['isTableEligible']('customers')).toBe(true);
    expect(component['isTableEligible']('orders')).toBe(true);
    expect(component['isTableEligible']('employees')).toBe(true);
  });

  it('restricts eligibility when fields are active in dataset', () => {
    const { fixture, component } = createComponent();
    const activeDf = createDatasetField(mockField1); // Customers table field

    fixture.componentRef.setInput('groupings', [mockGrouping]);
    fixture.componentRef.setInput('activeDatasetFields', [activeDf]);
    fixture.detectChanges();

    // Customers is active table -> eligible
    expect(component['isTableEligible']('customers')).toBe(true);
    // Orders is directly linked via Relationship -> eligible
    expect(component['isTableEligible']('orders')).toBe(true);
    // Employees has NO relationship to Customers -> NOT eligible (disabled!)
    expect(component['isTableEligible']('employees')).toBe(false);

    const checkEmployeeField = component['checkFieldSelectable'](mockEmployeesField);
    expect(checkEmployeeField.selectable).toBe(false);
    expect(checkEmployeeField.reason).toBe('table-not-related');
  });

  it('emits fieldSelect when onAddField is called for a selectable field', () => {
    const { fixture, component } = createComponent();
    fixture.componentRef.setInput('groupings', [mockGrouping]);
    fixture.componentRef.setInput('activeDatasetFields', []);
    fixture.detectChanges();

    let emittedField: Field | null = null;
    component.fieldSelect.subscribe((f) => {
      emittedField = f;
    });

    component['onAddField'](mockField2);
    expect(emittedField).toBe(mockField2);
  });

  it('manages schema loader modal state and tabs', () => {
    const { fixture, component } = createComponent();
    fixture.componentRef.setInput('groupings', [mockGrouping]);
    fixture.detectChanges();

    expect(component['isSourceModalOpen']()).toBe(false);
    component['openSourceModal']();
    expect(component['isSourceModalOpen']()).toBe(true);

    component['setTab']('api');
    expect(component['activeTab']()).toBe('api');

    component['closeSourceModal']();
    expect(component['isSourceModalOpen']()).toBe(false);
  });

  it('loads healthcare preset and emits groupingsChange and schemaLoad', async () => {
    const { fixture, component } = createComponent();
    fixture.componentRef.setInput('groupings', [mockGrouping]);
    fixture.detectChanges();

    component['openSourceModal']();
    component['selectPreset']('healthcare');

    let loadedGroupings: Grouping[] = [];
    component.groupingsChange.subscribe((g) => {
      loadedGroupings = g;
    });

    let schemaResult: any = null;
    component.schemaLoad.subscribe((res) => {
      schemaResult = res;
    });

    await component['loadSourceSchema']();

    expect(component['isSourceModalOpen']()).toBe(false);
    expect(loadedGroupings.length).toBeGreaterThan(0);
    expect(loadedGroupings[0].tables.length).toBe(3); // patients, encounters, diagnoses
    expect(schemaResult).not.toBeNull();
    expect(schemaResult.sourceName).toBe('Healthcare & Clinical');
    expect(schemaResult.totalTables).toBe(3);
    expect(schemaResult.totalFields).toBe(11);
  });
});
