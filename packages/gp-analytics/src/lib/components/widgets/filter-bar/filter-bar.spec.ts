import { describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { GpFilterBar } from './filter-bar';
import { GpTranslationService } from '../../../services/translation.service';

describe('GpFilterBar', () => {
  function createComponent() {
    TestBed.configureTestingModule({
      imports: [GpFilterBar],
      providers: [GpTranslationService]
    });
    const fixture = TestBed.createComponent(GpFilterBar);
    const component = fixture.componentInstance;
    return { fixture, component };
  }

  it('renders quick presets and applies them on click', () => {
    const { fixture, component } = createComponent();
    const preset = {
      label: 'AMER Region',
      condition: { fieldId: 'region', operator: 'eq' as const, value: 'AMER' }
    };
    fixture.componentRef.setInput('quickPresets', [preset]);
    fixture.detectChanges();

    let emittedFilters: any = null;
    component.filterChange.subscribe((f) => (emittedFilters = f));

    component['applyQuickPreset'](preset);
    fixture.detectChanges();

    expect(component.filters()).toHaveLength(1);
    expect(component.filters()[0].fieldId).toBe('region');
    expect(emittedFilters).toHaveLength(1);
  });

  it('removes active filter when remove button is clicked', () => {
    const { fixture, component } = createComponent();
    component.filters.set([
      { fieldId: 'region', operator: 'eq', value: 'EMEA' },
      { fieldId: 'status', operator: 'eq', value: 'Active' }
    ]);
    fixture.detectChanges();

    component['removeFilter'](0);
    fixture.detectChanges();

    expect(component.filters()).toHaveLength(1);
    expect(component.filters()[0].fieldId).toBe('status');
  });

  it('applies temporal date range presets and adds between condition', () => {
    const { fixture, component } = createComponent();
    fixture.componentRef.setInput('dateField', 'order_date');
    fixture.detectChanges();

    let emitted: any = null;
    component.filterChange.subscribe((f) => (emitted = f));

    component.applyDatePreset('last7');
    fixture.detectChanges();

    expect(component.filters()).toHaveLength(1);
    const filter = component.filters()[0];
    expect(filter.fieldId).toBe('order_date');
    expect(filter.operator).toBe('between');
    expect(Array.isArray(filter.value)).toBe(true);
    expect(filter.value).toHaveLength(2);
    expect(emitted).toEqual(component.filters());
  });

  it('adds between range filter rule with dual start/end values', () => {
    const { fixture, component } = createComponent();
    fixture.componentRef.setInput('availableFields', [{ fieldId: 'amount', label: 'Amount' }]);
    fixture.detectChanges();

    component['openAddModal']();
    component['selectedField'].set('amount');
    component['selectedOperator'].set('between');
    component['filterValue'].set('100');
    component['filterValueTo'].set('500');

    component['addCondition']();
    fixture.detectChanges();

    expect(component.filters()).toHaveLength(1);
    expect(component.filters()[0]).toEqual({
      fieldId: 'amount',
      operator: 'between',
      value: ['100', '500']
    });
  });
});
