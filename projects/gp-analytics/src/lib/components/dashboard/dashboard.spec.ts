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

  it('should expand widget height to fit rendered content', () => {
    fixture.componentRef.setInput('widgets', [
      {
        id: 'tall',
        layout: { x: 0, y: 0, w: 4, h: 1 },
        item: {
          metadata: { id: 'tall', name: 'Tall', artifactType: 'kpi', fields: [] },
          data: { summary: 'Tall content' },
        },
      },
    ]);
    fixture.detectChanges();

    const tile = fixture.nativeElement.querySelector('.gp-dashboard-tile') as HTMLElement;
    const widget = tile.querySelector('gp-widget') as HTMLElement;

    Object.defineProperty(widget, 'scrollHeight', {
      configurable: true,
      get: () => 170,
    });
    Object.defineProperty(tile, 'scrollHeight', {
      configurable: true,
      get: () => 170,
    });

    (component as any).expandWidgetsToFitContent();

    const expanded = (component as any).managedWidgetsState()[0] as DashboardWidget;
    expect(expanded.layout.h).toBeGreaterThan(1);
  });

  it('should keep keyboard help collapsed by default', () => {
    fixture.componentRef.setInput('widgets', MANAGED_WIDGETS);
    fixture.detectChanges();

    const help = fixture.nativeElement.querySelector('#gp-dashboard-keyboard-help');
    expect(help).toBeTruthy();
    expect(help.hidden).toBe(true);

    const moveButton: HTMLButtonElement = fixture.nativeElement.querySelector(
      '.gp-dashboard-tile__move',
    );
    const resizeButton: HTMLButtonElement = fixture.nativeElement.querySelector(
      '.gp-dashboard-tile__resize',
    );
    expect(moveButton.getAttribute('aria-describedby')).toBeNull();
    expect(resizeButton.getAttribute('aria-describedby')).toBeNull();
  });

  it('should expand keyboard help and link controls via aria-describedby', () => {
    fixture.componentRef.setInput('widgets', MANAGED_WIDGETS);
    fixture.detectChanges();

    const toggleButton: HTMLButtonElement = fixture.nativeElement.querySelector(
      '.gp-dashboard-shortcuts-toggle',
    );
    toggleButton.click();
    fixture.detectChanges();

    const help = fixture.nativeElement.querySelector('#gp-dashboard-keyboard-help');
    expect(help.hidden).toBe(false);
    expect(help.textContent).toContain(DEFAULT_GP_ANALYTICS_TRANSLATIONS.dashboardKeyboardHint);
    expect(toggleButton.getAttribute('aria-expanded')).toBe('true');

    const moveButton: HTMLButtonElement = fixture.nativeElement.querySelector(
      '.gp-dashboard-tile__move',
    );
    const resizeButton: HTMLButtonElement = fixture.nativeElement.querySelector(
      '.gp-dashboard-tile__resize',
    );
    expect(moveButton.getAttribute('aria-describedby')).toBe('gp-dashboard-keyboard-help');
    expect(resizeButton.getAttribute('aria-describedby')).toBe('gp-dashboard-keyboard-help');
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

  it('should disable move but keep resize enabled for a fixed widget', () => {
    fixture.componentRef.setInput('widgets', [
      {
        ...MANAGED_WIDGETS[0],
        fixed: true,
      },
    ]);
    fixture.detectChanges();

    const moveButton: HTMLButtonElement = fixture.nativeElement.querySelector(
      '.gp-dashboard-tile__move',
    );
    const resizeButton: HTMLButtonElement = fixture.nativeElement.querySelector(
      '.gp-dashboard-tile__resize',
    );
    expect(moveButton.disabled).toBe(true);
    expect(resizeButton.disabled).toBe(false);
    expect(fixture.nativeElement.querySelector('.gp-dashboard-tile__lock-toggle')).toBeNull();
  });

  it('should toggle widget lock from the padlock control', () => {
    const emitSpy = vi.spyOn(component.widgetsChange, 'emit');
    fixture.componentRef.setInput('widgets', MANAGED_WIDGETS);
    fixture.detectChanges();

    const lockButton: HTMLButtonElement = fixture.nativeElement.querySelector(
      '.gp-dashboard-tile__lock-toggle',
    );
    expect(lockButton.getAttribute('aria-label')).toBe('Lock widget');

    lockButton.click();
    fixture.detectChanges();

    expect(emitSpy).toHaveBeenCalled();
    const payload = emitSpy.mock.calls.at(-1)?.[0] as DashboardWidget[];
    expect(payload.find((widget) => widget.id === 'a')?.locked).toBe(true);

    const updatedLockButton: HTMLButtonElement = fixture.nativeElement.querySelector(
      '.gp-dashboard-tile__lock-toggle',
    );
    expect(updatedLockButton.getAttribute('aria-label')).toBe('Unlock widget');
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
