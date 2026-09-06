import { describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { GpPivotGrid } from './pivot-grid';
import { GpDataEngineService } from '../../services/data-engine.service';
import { GpTranslationService } from '../../services/translation.service';

describe('GpPivotGrid', () => {
  const mockData = [
    { customer: 'Northwind', region: 'EMEA', revenue: 1500 },
    { customer: 'Acme', region: 'AMER', revenue: 2500 },
    { customer: 'Acme', region: 'EMEA', revenue: 500 },
  ];

  function createComponent() {
    TestBed.configureTestingModule({
      imports: [GpPivotGrid],
      providers: [GpDataEngineService, GpTranslationService],
    });
    const fixture = TestBed.createComponent(GpPivotGrid);
    const component = fixture.componentInstance;
    return { fixture, component };
  }

  it('builds 2D pivot matrix across row and column dimensions', () => {
    const { fixture, component } = createComponent();
    fixture.componentRef.setInput('records', mockData);
    fixture.componentRef.setInput('rowDimension', 'customer');
    fixture.componentRef.setInput('colDimension', 'region');
    fixture.componentRef.setInput('measure', { fieldId: 'revenue', aggregation: 'sum' });
    fixture.detectChanges();

    const matrix = component.pivotMatrix();
    expect(matrix).toBeDefined();
    expect(matrix!.rowHeaders).toEqual(['Acme', 'Northwind']);
    expect(matrix!.colHeaders).toEqual(['AMER', 'EMEA']);
    expect(matrix!.grandTotal).toBe(4500);

    // Acme in AMER is 2500
    expect(matrix!.matrix[0][0]).toBe(2500);
    // Acme in EMEA is 500
    expect(matrix!.matrix[0][1]).toBe(500);
    // Acme row total is 3000
    expect(matrix!.rowTotals[0]).toBe(3000);
  });

  it('swaps axes when swapAxes is called', () => {
    const { fixture, component } = createComponent();
    fixture.componentRef.setInput('records', mockData);
    fixture.componentRef.setInput('rowDimension', 'customer');
    fixture.componentRef.setInput('colDimension', 'region');
    fixture.detectChanges();

    expect(component.effectiveRowDim()).toBe('customer');
    expect(component.effectiveColDim()).toBe('region');

    component.swapAxes();
    fixture.detectChanges();

    expect(component.effectiveRowDim()).toBe('region');
    expect(component.effectiveColDim()).toBe('customer');

    const matrix = component.pivotMatrix();
    expect(matrix!.rowHeaders).toEqual(['AMER', 'EMEA']);
    expect(matrix!.colHeaders).toEqual(['Acme', 'Northwind']);
  });

  it('computes cell background based on configurable heatmap modes', () => {
    const { fixture, component } = createComponent();
    fixture.componentRef.setInput('records', mockData);
    fixture.componentRef.setInput('rowDimension', 'customer');
    fixture.componentRef.setInput('colDimension', 'region');
    fixture.detectChanges();

    // Primary mode
    expect(component.getCellBg(2500)).toContain('var(--gp-color-primary');

    // Emerald mode
    component.heatmapMode.set('emerald');
    fixture.detectChanges();
    expect(component.getCellBg(2500)).toContain('#059669');

    // Amber mode
    component.heatmapMode.set('amber');
    fixture.detectChanges();
    expect(component.getCellBg(2500)).toContain('#d97706');

    // None mode
    component.heatmapMode.set('none');
    fixture.detectChanges();
    expect(component.getCellBg(2500)).toBe('transparent');
  });
});
