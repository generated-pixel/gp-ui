import { describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { GpDatasetBuilder } from './dataset-builder';
import { Field, Grouping, Dataset } from '../../../models';
import { GpTranslationService } from '../../../services/translation.service';

describe('GpDatasetBuilder', () => {
  const sampleField: Field = {
    fieldId: 'cust-name',
    tableId: 'customers',
    fieldGroupingId: 'fg1',
    fieldName: 'name',
    fieldDisplayName: { value: 'Name', displayValue: { en: 'Name' } },
    dataType: 'string',
    visible: true,
    isPrimaryKey: false,
    isIndex: false,
    isJoinField: false,
    usableInReports: true,
    filterable: true,
    sortable: true,
    groupable: true
  };

  const sampleGrouping: Grouping = {
    groupingId: 'grp1',
    groupingName: 'Commerce',
    tables: [
      {
        tableId: 'customers',
        tableName: 'Customers',
        groupingId: 'grp1',
        fields: [{ fieldGroupingId: 'fg1', fieldGroupingName: 'General', tableId: 'customers', fields: [sampleField] }]
      }
    ]
  };

  function createComponent() {
    TestBed.configureTestingModule({
      imports: [GpDatasetBuilder],
      providers: [GpTranslationService]
    });
    const fixture = TestBed.createComponent(GpDatasetBuilder);
    const component = fixture.componentInstance;
    return { fixture, component };
  }

  it('adds a field, updates dataset fields, and emits datasetChange', () => {
    const { fixture, component } = createComponent();
    fixture.componentRef.setInput('groupings', [sampleGrouping]);
    fixture.detectChanges();

    let emittedDataset: Dataset | null = null;
    component.dataset.subscribe((ds: Dataset) => (emittedDataset = ds));

    component['onAddField'](sampleField);

    expect(component.datasetFields().length).toBe(1);
    expect(component.datasetFields()[0].fieldId).toBe('cust-name');
    expect(emittedDataset).not.toBeNull();
    expect(emittedDataset!.fields.length).toBe(1);
  });

  it('removes a field and updates dataset', () => {
    const { fixture, component } = createComponent();
    fixture.componentRef.setInput('groupings', [sampleGrouping]);
    fixture.detectChanges();

    component['onAddField'](sampleField);
    const dfId = component.datasetFields()[0].datasetFieldId;

    component['onFieldRemove'](dfId);
    expect(component.datasetFields().length).toBe(0);
  });

  it('rejects adding non-visible fields and excludes them from datasetFields', () => {
    const { fixture, component } = createComponent();
    fixture.componentRef.setInput('groupings', [sampleGrouping]);
    fixture.detectChanges();

    const hiddenField: Field = {
      ...sampleField,
      fieldId: 'cust-hidden',
      visible: false
    };

    component['onAddField'](hiddenField);
    expect(component.datasetFields().length).toBe(0);
  });
});
