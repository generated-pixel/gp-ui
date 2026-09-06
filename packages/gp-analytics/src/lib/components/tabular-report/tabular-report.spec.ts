import { describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { GpTabularReport } from './tabular-report';
import { GpDataEngineService } from '../../services/data-engine.service';
import { GpTranslationService } from '../../services/translation.service';

describe('GpTabularReport', () => {
  const mockData = [
    { customer: 'Northwind', revenue: 1200 },
    { customer: 'Northwind', revenue: 800 },
    { customer: 'Acme', revenue: 3000 },
  ];

  function createComponent() {
    TestBed.configureTestingModule({
      imports: [GpTabularReport],
      providers: [GpDataEngineService, GpTranslationService],
    });
    const fixture = TestBed.createComponent(GpTabularReport);
    const component = fixture.componentInstance;
    return { fixture, component };
  }

  it('aggregates data by dimensions and measures with grand total', () => {
    const { fixture, component } = createComponent();
    fixture.componentRef.setInput('records', mockData);
    fixture.componentRef.setInput('dimensions', ['customer']);
    fixture.componentRef.setInput('measures', [{ fieldId: 'revenue', aggregation: 'sum' }]);
    fixture.detectChanges();

    const res = component.queryResult();
    expect(res).toBeDefined();
    expect(res!.totalCount).toBe(2); // Northwind, Acme

    const northwind = res!.rows.find((r) => r['customer'] === 'Northwind');
    expect(northwind!['revenue_sum']).toBe(2000);

    const acme = res!.rows.find((r) => r['customer'] === 'Acme');
    expect(acme!['revenue_sum']).toBe(3000);

    expect(res!.grandTotal!['revenue_sum']).toBe(5000);
  });

  it('generates columns with formatted headers and measure metadata', () => {
    const { fixture, component } = createComponent();
    fixture.componentRef.setInput('dimensions', ['customer']);
    fixture.componentRef.setInput('measures', [{ fieldId: 'revenue', aggregation: 'sum' }]);
    fixture.detectChanges();

    const cols = component.columns();
    expect(cols).toHaveLength(2);
    expect(cols[0].isDimension).toBe(true);
    expect(cols[0].header).toBe('Customer');
    expect(cols[1].isMeasure).toBe(true);
    expect(cols[1].header).toBe('Revenue (SUM)');
  });

  it('filters rows based on searchQuery signal', () => {
    const { fixture, component } = createComponent();
    fixture.componentRef.setInput('records', mockData);
    fixture.componentRef.setInput('dimensions', ['customer']);
    fixture.componentRef.setInput('measures', [{ fieldId: 'revenue', aggregation: 'sum' }]);
    fixture.detectChanges();

    expect(component.filteredRows()).toHaveLength(2);

    // Search for 'Acme'
    component.searchQuery.set('Acme');
    fixture.detectChanges();

    expect(component.filteredRows()).toHaveLength(1);
    expect(component.filteredRows()[0]['customer']).toBe('Acme');

    // Search for non-existent term
    component.searchQuery.set('XYZ');
    fixture.detectChanges();
    expect(component.filteredRows()).toHaveLength(0);
  });
});
