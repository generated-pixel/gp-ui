import { describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { GpDatasetFieldSelector } from './dataset-field-selector';
import { Field, createDatasetField, DatasetField } from '../../models';
import { GpTranslationService } from '../../services/translation.service';

describe('GpDatasetFieldSelector', () => {
  const sortableField: Field = {
    fieldId: 'f-sortable',
    tableId: 'orders',
    fieldGroupingId: 'fg1',
    fieldName: 'order_amount',
    fieldDisplayName: { value: 'Amount', displayValue: { en: 'Amount' } },
    dataType: 'currency',
    visible: true,
    isPrimaryKey: false,
    isIndex: false,
    isJoinField: false,
    usableInReports: true,
    filterable: true,
    sortable: true,
    groupable: true,
    aggregationType: 'none',
  };

  const restrictedField: Field = {
    fieldId: 'f-restricted',
    tableId: 'orders',
    fieldGroupingId: 'fg1',
    fieldName: 'raw_payload',
    fieldDisplayName: { value: 'Payload', displayValue: { en: 'Payload' } },
    dataType: 'string',
    visible: true,
    isPrimaryKey: false,
    isIndex: false,
    isJoinField: false,
    usableInReports: true,
    filterable: false, // NOT filterable in base!
    sortable: false,   // NOT sortable in base!
    groupable: false,  // NOT groupable in base!
  };

  function createComponent() {
    TestBed.configureTestingModule({
      imports: [GpDatasetFieldSelector],
      providers: [GpTranslationService],
    });
    const fixture = TestBed.createComponent(GpDatasetFieldSelector);
    const component = fixture.componentInstance;
    return { fixture, component };
  }

  it('sets the first field as active by default and displays dynamic label', () => {
    const { fixture, component } = createComponent();
    const df1 = createDatasetField(sortableField);
    df1.aggregationType = 'sum';

    fixture.componentRef.setInput('fields', [df1]);
    fixture.detectChanges();

    expect(component.activeField()?.datasetFieldId).toBe(df1.datasetFieldId);
    expect(component['getDisplayLabel'](df1)).toBe('Amount (SUM)');
  });

  it('updates aggregation and emits updated fields with new dynamic label', () => {
    const { fixture, component } = createComponent();
    const df = createDatasetField(sortableField);

    fixture.componentRef.setInput('fields', [df]);
    fixture.detectChanges();

    let emitted: DatasetField[] = [];
    component.fieldsChange.subscribe((f) => {
      emitted = f;
    });

    component['updateAggregation']('average');
    expect(emitted.length).toBe(1);
    expect(emitted[0].aggregationType).toBe('average');
    expect(component['getDisplayLabel'](emitted[0])).toBe('Amount (AVERAGE)');
  });

  it('strictly prevents modifying capabilities if base field has them as false', () => {
    const { fixture, component } = createComponent();
    const dfRestricted = createDatasetField(restrictedField);

    fixture.componentRef.setInput('fields', [dfRestricted]);
    fixture.detectChanges();

    let changeEmitted = false;
    component.fieldsChange.subscribe(() => {
      changeEmitted = true;
    });

    // Attempt to turn on sortable when base is false
    component['updateSortable'](true);
    expect(changeEmitted).toBe(false);

    // Attempt to turn on filterable when base is false
    component['updateFilterable'](true);
    expect(changeEmitted).toBe(false);

    // Attempt to turn on groupable when base is false
    component['updateGroupable'](true);
    expect(changeEmitted).toBe(false);
  });

  it('allows toggling capabilities when base field has them as true', () => {
    const { fixture, component } = createComponent();
    const dfSortable = createDatasetField(sortableField);

    fixture.componentRef.setInput('fields', [dfSortable]);
    fixture.detectChanges();

    let emitted: DatasetField[] = [];
    component.fieldsChange.subscribe((f) => {
      emitted = f;
    });

    // Toggle sortable to false
    component['updateSortable'](false);
    expect(emitted.length).toBe(1);
    expect(emitted[0].sortable).toBe(false);
  });

  it('removes field and emits fieldRemove and fieldsChange', () => {
    const { fixture, component } = createComponent();
    const df = createDatasetField(sortableField);

    fixture.componentRef.setInput('fields', [df]);
    fixture.detectChanges();

    let removedId: string | null = null;
    let newFields: DatasetField[] = [];
    component.fieldRemove.subscribe((id) => (removedId = id));
    component.fieldsChange.subscribe((list) => (newFields = list));

    component['removeField'](df.datasetFieldId);
    expect(removedId).toBe(df.datasetFieldId);
    expect(newFields.length).toBe(0);
  });

  it('excludes non-visible fields from the available dataset field list', () => {
    const { fixture, component } = createComponent();
    const visibleDf = createDatasetField(sortableField);
    const hiddenBaseField: Field = {
      ...sortableField,
      fieldId: 'f-hidden',
      fieldName: 'internal_secret',
      visible: false,
    };
    const hiddenDf = createDatasetField(hiddenBaseField);

    fixture.componentRef.setInput('fields', [visibleDf, hiddenDf]);
    fixture.detectChanges();

    // visibleFields should only contain the visible field
    expect(component.visibleFields().length).toBe(1);
    expect(component.visibleFields()[0].fieldId).toBe('f-sortable');
  });

  it('ignores drop events if the dropped field is not visible', () => {
    const { fixture, component } = createComponent();
    fixture.componentRef.setInput('fields', []);
    fixture.detectChanges();

    let droppedField: Field | null = null;
    component.fieldDrop.subscribe((f) => (droppedField = f));

    const hiddenBaseField: Field = {
      ...sortableField,
      fieldId: 'f-hidden',
      visible: false,
    };

    const mockDropEvent = {
      preventDefault: () => {},
      dataTransfer: {
        getData: (type: string) => (type === 'application/json' ? JSON.stringify(hiddenBaseField) : ''),
      },
    } as unknown as DragEvent;

    component['onDrop'](mockDropEvent);
    expect(droppedField).toBeNull();
  });

  it('reorders fields when dropped via drag-and-drop', () => {
    const { fixture, component } = createComponent();
    const df1 = createDatasetField({ ...sortableField, fieldId: 'f-1', fieldName: 'Field 1' });
    const df2 = createDatasetField({ ...sortableField, fieldId: 'f-2', fieldName: 'Field 2' });
    const df3 = createDatasetField({ ...sortableField, fieldId: 'f-3', fieldName: 'Field 3' });

    fixture.componentRef.setInput('fields', [df1, df2, df3]);
    fixture.detectChanges();

    let reordered: DatasetField[] = [];
    component.fieldsChange.subscribe((list) => (reordered = list));

    const mockDataTransfer = {
      effectAllowed: '',
      dropEffect: '',
      data: {} as Record<string, string>,
      setData(key: string, val: string) {
        this.data[key] = val;
      },
      getData(key: string) {
        return this.data[key] ?? '';
      },
    };

    // Drag df1 (index 0)
    component['onListDragStart'](
      { dataTransfer: mockDataTransfer } as unknown as DragEvent,
      0,
    );
    expect(component['draggedIndex']()).toBe(0);

    // Drag over df3 (index 2) positioned 'after'
    const mockTarget = {
      getBoundingClientRect: () => ({ top: 100, height: 40 }),
    } as unknown as HTMLElement;

    component['onListDragOver'](
      {
        preventDefault: () => {},
        stopPropagation: () => {},
        dataTransfer: mockDataTransfer,
        currentTarget: mockTarget,
        clientY: 130, // > 100 + 20 -> 'after'
      } as unknown as DragEvent,
      2,
    );
    expect(component['dropTargetIndex']()).toBe(2);
    expect(component['dropPosition']()).toBe('after');

    // Drop
    component['onListDrop'](
      {
        preventDefault: () => {},
        stopPropagation: () => {},
      } as unknown as DragEvent,
      2,
    );

    expect(reordered.length).toBe(3);
    // Moved df1 to the end (after df3): [df2, df3, df1]
    expect(reordered[0].fieldId).toBe('f-2');
    expect(reordered[1].fieldId).toBe('f-3');
    expect(reordered[2].fieldId).toBe('f-1');
  });

  it('moves items up and down using moveItem', () => {
    const { fixture, component } = createComponent();
    const df1 = createDatasetField({ ...sortableField, fieldId: 'f-1' });
    const df2 = createDatasetField({ ...sortableField, fieldId: 'f-2' });

    fixture.componentRef.setInput('fields', [df1, df2]);
    fixture.detectChanges();

    let reordered: DatasetField[] = [];
    component.fieldsChange.subscribe((list) => (reordered = list));

    // Move first item down
    component['moveItem'](0, 'down');
    expect(reordered[0].fieldId).toBe('f-2');
    expect(reordered[1].fieldId).toBe('f-1');

    // Move second item up
    fixture.componentRef.setInput('fields', reordered);
    fixture.detectChanges();
    component['moveItem'](1, 'up');
    expect(reordered[0].fieldId).toBe('f-1');
    expect(reordered[1].fieldId).toBe('f-2');
  });

  it('groups fields by table and by role', () => {
    const { fixture, component } = createComponent();
    const dfCust = createDatasetField({ ...sortableField, fieldId: 'c1', tableId: 'customers' });
    const dfOrderDim = createDatasetField({ ...sortableField, fieldId: 'o1', tableId: 'orders' });
    const dfOrderAgg = createDatasetField({ ...sortableField, fieldId: 'o2', tableId: 'orders' });
    dfOrderAgg.aggregationType = 'sum';

    fixture.componentRef.setInput('fields', [dfCust, dfOrderDim, dfOrderAgg]);
    fixture.detectChanges();

    // Default: 'none'
    expect(component['groupedSections']().length).toBe(1);
    expect(component['groupedSections']()[0].fields.length).toBe(3);

    // Switch to 'table'
    component['setGroupingMode']('table');
    fixture.detectChanges();
    const tableSections = component['groupedSections']();
    expect(tableSections.length).toBe(2);
    expect(tableSections[0].title).toBe('Customers');
    expect(tableSections[1].title).toBe('Orders');

    // Switch to 'role'
    component['setGroupingMode']('role');
    fixture.detectChanges();
    const roleSections = component['groupedSections']();
    expect(roleSections.length).toBe(2);
    // Dimensions (dfCust, dfOrderDim)
    expect(roleSections[0].fields.length).toBe(2);
    // Measures (dfOrderAgg)
    expect(roleSections[1].fields.length).toBe(1);
  });

  it('toggles group collapse correctly', () => {
    const { fixture, component } = createComponent();
    expect(component['isGroupCollapsed']('table-orders')).toBe(false);

    component['toggleGroupCollapse']('table-orders');
    expect(component['isGroupCollapsed']('table-orders')).toBe(true);

    component['toggleGroupCollapse']('table-orders');
    expect(component['isGroupCollapsed']('table-orders')).toBe(false);
  });

  it('toggles isGrouped on groupable fields and enforces invariant on non-groupable fields', () => {
    const { fixture, component } = createComponent();
    const dfGroupable = createDatasetField(sortableField);
    const dfRestricted = createDatasetField(restrictedField);

    fixture.componentRef.setInput('fields', [dfGroupable, dfRestricted]);
    fixture.detectChanges();

    let emitted: DatasetField[] = [];
    component.fieldsChange.subscribe((list) => (emitted = list));

    // Toggle on groupable field
    const initialVal = dfGroupable.isGrouped;
    component['toggleFieldGroupBy'](dfGroupable.datasetFieldId);
    expect(emitted.length).toBe(2);
    expect(emitted[0].isGrouped).toBe(!initialVal);

    // Attempt toggle on restricted (groupable: false) field
    emitted = [];
    component['toggleFieldGroupBy'](dfRestricted.datasetFieldId);
    expect(emitted.length).toBe(0);
  });

  it('manages filters, switches tabs, and builds filters with translated lookup values', () => {
    const { fixture, component } = createComponent();
    const lookupField: Field = {
      ...sortableField,
      fieldId: 'order-status',
      fieldName: 'status',
      lookupValues: [
        { value: 'completed', displayValue: { en: 'Completed', fr: 'Complété' } },
        { value: 'processing', displayValue: { en: 'Processing', fr: 'En traitement' } },
      ],
    };

    const dfLookup = createDatasetField(lookupField);
    fixture.componentRef.setInput('fields', [dfLookup]);
    fixture.detectChanges();

    expect(component.activeTab()).toBe('fields');
    component.setActiveTab('filters');
    expect(component.activeTab()).toBe('filters');

    // Start adding a filter
    component.startAddFilter(dfLookup.datasetFieldId);
    expect(component.isAddingFilter()).toBe(true);
    expect(component.selectedFilterField()?.datasetFieldId).toBe(dfLookup.datasetFieldId);
    expect(component.filterFieldLookupValues().length).toBe(2);

    let emittedFilters: any[] = [];
    component.filtersChange.subscribe((f) => (emittedFilters = f));

    // Apply the filter
    component.applyNewFilter();
    expect(component.isAddingFilter()).toBe(false);
    expect(emittedFilters.length).toBe(1);
    expect(emittedFilters[0].fieldId).toBe(dfLookup.datasetFieldId);
    expect(emittedFilters[0].operator).toBe('eq');
    expect(emittedFilters[0].value).toBe('completed');

    // Display localized value representation
    expect(component.getFilterValueDisplay(emittedFilters[0])).toBe('Completed');

    // Switch locale to French and verify translation
    const i18n = TestBed.inject(GpTranslationService);
    i18n.setLocale('fr');
    expect(component.getFilterValueDisplay(emittedFilters[0])).toBe('Complété');

    // Test filterByField shortcut
    i18n.setLocale('en');
    component.filterByField(dfLookup);
    expect(component.activeTab()).toBe('filters');
    expect(component.isAddingFilter()).toBe(true);
  });
});
