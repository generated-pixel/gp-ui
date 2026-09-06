import { describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { GpAnalyticsDashboard } from './analytics-dashboard';
import { GpDataEngineService } from '../../services/data-engine.service';
import { GpTranslationService } from '../../services/translation.service';

describe('GpAnalyticsDashboard', () => {
  const mockData = [
    { customer_name: 'Northwind', status: 'Completed', total: 5000 },
    { customer_name: 'Acme', status: 'Completed', total: 8000 },
    { customer_name: 'Acme', status: 'Pending', total: 2000 },
  ];

  function createComponent() {
    TestBed.configureTestingModule({
      imports: [GpAnalyticsDashboard],
      providers: [GpDataEngineService, GpTranslationService],
    });
    const fixture = TestBed.createComponent(GpAnalyticsDashboard);
    const component = fixture.componentInstance;
    return { fixture, component };
  }

  it('computes executive KPIs and breakdown chart from records', () => {
    const { fixture, component } = createComponent();
    fixture.componentRef.setInput('records', mockData);
    fixture.detectChanges();

    const rev = component.kpiRevenue();
    expect(rev.currentValue).toBe(15000);
    expect(rev.title).toBe('Total Revenue');

    const orders = component.kpiOrders();
    expect(orders.currentValue).toBe(3);

    const chart = component.customerBreakdownChart();
    expect(chart.categories).toContain('Acme');
    expect(chart.categories).toContain('Northwind');
  });

  it('initializes gp-grid layout items', () => {
    const { fixture, component } = createComponent();
    fixture.detectChanges();

    const items = component.gridItems();
    expect(items.length).toBeGreaterThanOrEqual(5);
    expect(items.find((i) => i.id === 'kpi-1')).toBeDefined();
    expect(items.find((i) => i.id === 'chart-bar')).toBeDefined();
    expect(items.find((i) => i.id === 'report-table')).toBeDefined();
  });
});
