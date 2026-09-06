import { describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { GpAnalyticalChart } from './analytical-chart';
import { GpTranslationService } from '../../services/translation.service';

describe('GpAnalyticalChart', () => {
  const sampleData = {
    categories: ['EMEA', 'AMER', 'APAC'],
    series: [{ name: 'Revenue', data: [3000, 4500, 1500] }]
  };

  function createComponent() {
    TestBed.configureTestingModule({
      imports: [GpAnalyticalChart],
      providers: [GpTranslationService]
    });
    const fixture = TestBed.createComponent(GpAnalyticalChart);
    const component = fixture.componentInstance;
    return { fixture, component };
  }

  it('computes bar items with proportional heights and colors', () => {
    const { fixture, component } = createComponent();
    fixture.componentRef.setInput('type', 'bar');
    fixture.componentRef.setInput('data', sampleData);
    fixture.detectChanges();

    const bars = component.barItems();
    expect(bars).toHaveLength(3);
    // AMER is max (4500) -> 100%
    const amer = bars.find((b) => b.label === 'AMER');
    expect(amer?.heightPct).toBe(100);
    // APAC is 1500 / 4500 = 33.3%
    const apac = bars.find((b) => b.label === 'APAC');
    expect(apac?.heightPct).toBe(33.3);
  });

  it('computes donut slices with percentages summing to 100%', () => {
    const { fixture, component } = createComponent();
    fixture.componentRef.setInput('type', 'donut');
    fixture.componentRef.setInput('data', sampleData);
    fixture.detectChanges();

    const donut = component.donutSlices();
    expect(donut.total).toBe(9000);
    expect(donut.slices).toHaveLength(3);

    const totalPct = donut.slices.reduce((acc, s) => acc + s.percentage, 0);
    expect(Math.round(totalPct)).toBe(100);
  });

  it('computes smooth line path and points for line charts', () => {
    const { fixture, component } = createComponent();
    fixture.componentRef.setInput('type', 'line');
    fixture.componentRef.setInput('data', sampleData);
    fixture.detectChanges();

    const line = component.lineSvg();
    expect(line.points).toHaveLength(3);
    expect(line.path).toContain('M ');
    expect(line.area).toContain(' Z');
  });

  it('computes multi-series bar categories and handles series toggling', () => {
    const multiData = {
      categories: ['Q1', 'Q2'],
      series: [
        { name: 'Actual', data: [100, 200] },
        { name: 'Target', data: [150, 180] }
      ]
    };
    const { fixture, component } = createComponent();
    fixture.componentRef.setInput('type', 'bar');
    fixture.componentRef.setInput('data', multiData);
    fixture.detectChanges();

    const cats = component.barCategories();
    expect(cats).toHaveLength(2);
    expect(cats[0].seriesBars).toHaveLength(2); // Actual and Target

    // Toggle out 'Target'
    component.toggleSeries('Target');
    fixture.detectChanges();

    expect(component.hiddenSeries().has('Target')).toBe(true);
    expect(component.activeSeries()).toHaveLength(1);
    expect(component.barCategories()[0].seriesBars).toHaveLength(1);
  });

  it('generates valid standalone SVG markup for all chart modes', () => {
    const { fixture, component } = createComponent();
    fixture.componentRef.setInput('title', 'Sales Performance');
    fixture.componentRef.setInput('data', sampleData);

    // Test Bar SVG
    fixture.componentRef.setInput('type', 'bar');
    fixture.detectChanges();
    const barSvg = component.generateSvgContent();
    expect(barSvg).toContain('<svg');
    expect(barSvg).toContain('Sales Performance');
    expect(barSvg).toContain('<rect');

    // Test Donut SVG
    fixture.componentRef.setInput('type', 'donut');
    fixture.detectChanges();
    const donutSvg = component.generateSvgContent();
    expect(donutSvg).toContain('<svg');
    expect(donutSvg).toContain('<path');

    // Test Line SVG
    fixture.componentRef.setInput('type', 'line');
    fixture.detectChanges();
    const lineSvg = component.generateSvgContent();
    expect(lineSvg).toContain('<svg');
    expect(lineSvg).toContain('<circle');
  });
});
