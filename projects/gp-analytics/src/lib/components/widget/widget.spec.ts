import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DEFAULT_GP_ANALYTICS_TRANSLATIONS } from '../../config/gp-analytics-config';
import { GP_ANALYTICS_TRANSLATIONS } from '../../tokens/gp-analytics.token';
import { Widget } from './widget';

describe('Widget', () => {
  let component: Widget;
  let fixture: ComponentFixture<Widget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Widget],
      providers: [
        { provide: GP_ANALYTICS_TRANSLATIONS, useValue: DEFAULT_GP_ANALYTICS_TRANSLATIONS },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Widget);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title input', () => {
    fixture.componentRef.setInput('title', 'Sales Chart');
    fixture.detectChanges();

    const titleElement = fixture.nativeElement.querySelector('.gp-widget-title');
    expect(titleElement.textContent).toContain('Sales Chart');
  });

  it('should fall back to translation default title', () => {
    fixture.detectChanges();
    const titleElement = fixture.nativeElement.querySelector('.gp-widget-title');
    expect(titleElement.textContent).toContain(
      DEFAULT_GP_ANALYTICS_TRANSLATIONS.widgetDefaultTitle,
    );
  });

  it('should apply highlighted class when highlighted input is true', () => {
    fixture.componentRef.setInput('highlighted', true);
    fixture.detectChanges();

    const widget = fixture.nativeElement.querySelector('.gp-widget');
    expect(widget.classList.contains('gp-widget--highlighted')).toBe(true);
  });

  it('should render item metadata and points', () => {
    fixture.componentRef.setInput('item', {
      metadata: {
        id: 'item-1',
        name: 'Revenue KPI',
        artifactType: 'graph',
        graphType: 'bar',
        fields: [],
        generatedAt: '2026-03-24T00:00:00.000Z',
      },
      style: {
        tone: 'success',
      },
      data: {
        summary: 'Current month performance',
        points: [
          { key: 'revenue', label: 'Revenue', value: 125000, valueType: 'currency' },
          { key: 'growth', label: 'Growth', value: 0.12, valueType: 'percent' },
        ],
      },
    });
    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector('.gp-widget-title');
    const summary = fixture.nativeElement.querySelector('.gp-widget-summary');
    const pointRows = fixture.nativeElement.querySelectorAll('.gp-widget-points__row');
    const meta = fixture.nativeElement.querySelector('.gp-widget-meta')?.textContent ?? '';

    expect(title.textContent).toContain('Revenue KPI');
    expect(meta).toContain(DEFAULT_GP_ANALYTICS_TRANSLATIONS.widgetGraphTypeLabel);
    expect(meta).toContain(DEFAULT_GP_ANALYTICS_TRANSLATIONS.widgetGraphTypeBar);
    expect(summary.textContent).toContain('Current month performance');
    expect(pointRows.length).toBe(2);
  });

  it('should render empty item message when no points are returned', () => {
    fixture.componentRef.setInput('item', {
      metadata: {
        id: 'item-2',
        name: 'Empty item',
        artifactType: 'tabular',
        fields: [],
      },
      data: {},
    });
    fixture.detectChanges();

    const empty = fixture.nativeElement.querySelector('.gp-widget-empty');
    expect(empty.textContent).toContain(DEFAULT_GP_ANALYTICS_TRANSLATIONS.widgetItemNoDataLabel);
  });
});
