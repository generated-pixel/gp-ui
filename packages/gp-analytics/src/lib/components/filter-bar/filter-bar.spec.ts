import { describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { GpFilterBar } from './filter-bar';
import { GpTranslationService } from '../../services/translation.service';

describe('GpFilterBar', () => {
  function createComponent() {
    TestBed.configureTestingModule({
      imports: [GpFilterBar],
      providers: [GpTranslationService],
    });
    const fixture = TestBed.createComponent(GpFilterBar);
    const component = fixture.componentInstance;
    return { fixture, component };
  }

  it('renders quick presets and applies them on click', () => {
    const { fixture, component } = createComponent();
    const preset = {
      label: 'AMER Region',
      condition: { fieldId: 'region', operator: 'eq' as const, value: 'AMER' },
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
      { fieldId: 'status', operator: 'eq', value: 'Active' },
    ]);
    fixture.detectChanges();

    component['removeFilter'](0);
    fixture.detectChanges();

    expect(component.filters()).toHaveLength(1);
    expect(component.filters()[0].fieldId).toBe('status');
  });
});
