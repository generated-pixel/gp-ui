import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DEFAULT_GP_ANALYTICS_TRANSLATIONS } from '../../config/gp-analytics-config';
import { DashboardWidget } from '../../interfaces/dashboard-layout';
import { GP_ANALYTICS_TRANSLATIONS } from '../../tokens/gp-analytics.token';
import { Dashboard } from './dashboard';

const MANAGED_WIDGETS: DashboardWidget[] = [
  {
    id: 'a',
    layout: { x: 0, y: 0, w: 4, h: 3 },
    item: {
      metadata: { id: 'a', name: 'A', artifactType: 'kpi', fields: [] },
      data: { summary: 'A' },
    },
  },
  {
    id: 'b',
    layout: { x: 4, y: 0, w: 4, h: 3 },
    item: {
      metadata: { id: 'b', name: 'B', artifactType: 'kpi', fields: [] },
      data: { summary: 'B' },
    },
  },
];

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [
        { provide: GP_ANALYTICS_TRANSLATIONS, useValue: DEFAULT_GP_ANALYTICS_TRANSLATIONS },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title input', () => {
    fixture.componentRef.setInput('title', 'Sales Dashboard');
    fixture.detectChanges();

    const titleElement = fixture.nativeElement.querySelector('.gp-dashboard-title');
    expect(titleElement.textContent).toContain('Sales Dashboard');
  });

  it('should fall back to translation default title', () => {
    fixture.detectChanges();
    const titleElement = fixture.nativeElement.querySelector('.gp-dashboard-title');
    expect(titleElement.textContent).toContain(
      DEFAULT_GP_ANALYTICS_TRANSLATIONS.dashboardDefaultTitle,
    );
  });

  it('should render managed dashboard tiles when widgets input is provided', () => {
    fixture.componentRef.setInput('widgets', MANAGED_WIDGETS);
    fixture.detectChanges();

    const tiles = fixture.nativeElement.querySelectorAll('.gp-dashboard-tile');
    expect(tiles.length).toBe(2);
  });

  it('should not start move interaction for a locked widget', () => {
    fixture.componentRef.setInput('widgets', [
      {
        ...MANAGED_WIDGETS[0],
        locked: true,
      },
    ]);
    fixture.detectChanges();

    const moveButton: HTMLButtonElement = fixture.nativeElement.querySelector(
      '.gp-dashboard-tile__move',
    );
    expect(moveButton.disabled).toBe(true);
  });

  it('should emit widgetsChange after a move interaction', () => {
    const emitSpy = vi.spyOn(component.widgetsChange, 'emit');
    fixture.componentRef.setInput('widgets', MANAGED_WIDGETS);
    fixture.detectChanges();

    const firstTileMove: HTMLButtonElement = fixture.nativeElement.querySelector(
      '.gp-dashboard-tile__move',
    );
    firstTileMove.dispatchEvent(new PointerEvent('pointerdown', { clientX: 0, clientY: 0 }));

    (component as any).onPointerMove(new PointerEvent('pointermove', { clientX: 80, clientY: 0 }));
    (component as any).onPointerUp();

    expect(emitSpy).toHaveBeenCalled();
    const payload = emitSpy.mock.calls.at(-1)?.[0] as DashboardWidget[];
    expect(payload.length).toBe(2);
    expect(
      payload.some((x) => x.layout.x !== MANAGED_WIDGETS.find((y) => y.id === x.id)!.layout.x),
    ).toBe(true);
  });

  it('should move widget with arrow keys on move handle', () => {
    const emitSpy = vi.spyOn(component.widgetsChange, 'emit');
    fixture.componentRef.setInput('widgets', MANAGED_WIDGETS);
    fixture.detectChanges();

    const moveButton: HTMLButtonElement = fixture.nativeElement.querySelector(
      '.gp-dashboard-tile__move',
    );
    moveButton.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    fixture.detectChanges();

    expect(emitSpy).toHaveBeenCalled();
    const payload = emitSpy.mock.calls.at(-1)?.[0] as DashboardWidget[];
    expect(payload.find((x) => x.id === 'a')!.layout.x).toBe(1);
  });

  it('should resize widget with arrow keys on resize handle', () => {
    const emitSpy = vi.spyOn(component.widgetsChange, 'emit');
    fixture.componentRef.setInput('widgets', MANAGED_WIDGETS);
    fixture.detectChanges();

    const resizeButton: HTMLButtonElement = fixture.nativeElement.querySelector(
      '.gp-dashboard-tile__resize',
    );
    resizeButton.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    fixture.detectChanges();

    expect(emitSpy).toHaveBeenCalled();
    const payload = emitSpy.mock.calls.at(-1)?.[0] as DashboardWidget[];
    expect(payload.find((x) => x.id === 'a')!.layout.w).toBe(5);
  });

  it('should ignore keyboard move/resize when dashboard is locked', () => {
    const emitSpy = vi.spyOn(component.widgetsChange, 'emit');
    fixture.componentRef.setInput('widgets', MANAGED_WIDGETS);
    fixture.componentRef.setInput('locked', true);
    fixture.detectChanges();

    const moveButton: HTMLButtonElement = fixture.nativeElement.querySelector(
      '.gp-dashboard-tile__move',
    );
    const resizeButton: HTMLButtonElement = fixture.nativeElement.querySelector(
      '.gp-dashboard-tile__resize',
    );
    moveButton.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    resizeButton.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

    expect(emitSpy).not.toHaveBeenCalled();
  });
});
