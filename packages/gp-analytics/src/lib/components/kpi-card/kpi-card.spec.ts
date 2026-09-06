import { describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { GpKpiCard } from './kpi-card';
import { GpTranslationService } from '../../services/translation.service';

describe('GpKpiCard', () => {
  function createComponent() {
    TestBed.configureTestingModule({
      imports: [GpKpiCard],
      providers: [GpTranslationService]
    });
    const fixture = TestBed.createComponent(GpKpiCard);
    const component = fixture.componentInstance;
    return { fixture, component };
  }

  it('renders title and formatted metric value correctly', () => {
    const { fixture, component } = createComponent();
    fixture.componentRef.setInput('title', 'Total Revenue');
    fixture.componentRef.setInput('formattedValue', '$48,250.00');
    fixture.detectChanges();

    expect(component.displayValue()).toBe('$48,250.00');
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.kpi-title')?.textContent).toContain('Total Revenue');
    expect(el.querySelector('.kpi-value')?.textContent).toContain('$48,250.00');
  });

  it('renders trend badge and severity styles', () => {
    const { fixture, component } = createComponent();
    fixture.componentRef.setInput('variancePercentage', 14.5);
    fixture.componentRef.setInput('trend', 'up');
    fixture.componentRef.setInput('severity', 'success');
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    const badge = el.querySelector('.trend-badge');
    expect(badge?.textContent).toContain('+14.5%');
    expect(badge?.classList.contains('trend-up')).toBe(true);
    expect(el.querySelector('.gp-kpi-card')?.classList.contains('severity-success')).toBe(true);
  });

  it('computes smooth SVG sparkline coordinates when points are provided', () => {
    const { fixture, component } = createComponent();
    fixture.componentRef.setInput('sparklinePoints', [10, 25, 15, 30, 45]);
    fixture.detectChanges();

    const spark = component.sparklineSvg();
    expect(spark.points).toHaveLength(5);
    expect(spark.path).toContain('M ');
    expect(spark.path).toContain(' C ');
    expect(spark.areaPath).toContain(' Z');
  });

  it('triggers target threshold alert when condition is met', () => {
    const { fixture, component } = createComponent();
    fixture.componentRef.setInput('value', 42);
    fixture.componentRef.setInput('alertThreshold', 50);
    fixture.componentRef.setInput('alertCondition', 'below');
    fixture.componentRef.setInput('alertMessage', 'Low Performance');
    fixture.detectChanges();

    expect(component.isAlertActive()).toBe(true);
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Low Performance');
  });

  it('handles sparkline hovering and updates hoveredPoint', () => {
    const { fixture, component } = createComponent();
    fixture.componentRef.setInput('sparklinePoints', [10, 20, 30]);
    fixture.detectChanges();

    expect(component.hoveredPoint()).toBeNull();
    component.onSparklineHover(1);
    expect(component.hoveredPoint()?.val).toBe(20);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.sparkline-tooltip')?.textContent?.trim()).toBe('20');
  });
});
