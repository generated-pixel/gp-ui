import { TestBed } from '@angular/core/testing';

import { DashboardWidget } from '../interfaces/dashboard-layout';
import { DashboardLayoutService } from './dashboard-layout.service';

describe('DashboardLayoutService', () => {
  let service: DashboardLayoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardLayoutService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should normalize widget size and position to column bounds', () => {
    const widgets: DashboardWidget[] = [
      {
        id: 'a',
        layout: { x: 20, y: -2, w: 99, h: 0 },
      },
    ];

    const normalized = service.normalizeLayout(widgets, 12);
    expect(normalized[0].layout.x).toBe(0);
    expect(normalized[0].layout.y).toBe(0);
    expect(normalized[0].layout.w).toBe(12);
    expect(normalized[0].layout.h).toBe(1);
  });

  it('should move a widget and push overlapping widgets down', () => {
    const widgets: DashboardWidget[] = [
      { id: 'a', layout: { x: 0, y: 0, w: 4, h: 2 } },
      { id: 'b', layout: { x: 4, y: 0, w: 4, h: 2 } },
      { id: 'c', layout: { x: 0, y: 2, w: 4, h: 2 } },
    ];

    const moved = service.moveWidget(widgets, 'b', 0, 0, 12);

    const a = moved.find((x) => x.id === 'a')!;
    const b = moved.find((x) => x.id === 'b')!;
    const c = moved.find((x) => x.id === 'c')!;

    expect(b.layout.x).toBe(0);
    expect(b.layout.y).toBe(0);
    expect(a.layout.y).toBeGreaterThanOrEqual(2);
    expect(c.layout.y).toBeGreaterThanOrEqual(a.layout.y + a.layout.h);
  });

  it('should not move a locked target widget', () => {
    const widgets: DashboardWidget[] = [
      { id: 'a', locked: true, layout: { x: 0, y: 0, w: 4, h: 2 } },
      { id: 'b', layout: { x: 4, y: 0, w: 4, h: 2 } },
    ];

    const moved = service.moveWidget(widgets, 'a', 6, 5, 12);
    const a = moved.find((x) => x.id === 'a')!;
    expect(a.layout.x).toBe(0);
    expect(a.layout.y).toBe(0);
  });

  it('should keep locked widgets fixed and move the active widget around them', () => {
    const widgets: DashboardWidget[] = [
      { id: 'locked', locked: true, layout: { x: 0, y: 0, w: 6, h: 2 } },
      { id: 'free', layout: { x: 6, y: 0, w: 6, h: 2 } },
    ];

    const moved = service.moveWidget(widgets, 'free', 0, 0, 12);
    const locked = moved.find((x) => x.id === 'locked')!;
    const free = moved.find((x) => x.id === 'free')!;

    expect(locked.layout.x).toBe(0);
    expect(locked.layout.y).toBe(0);
    expect(free.layout.y).toBeGreaterThanOrEqual(2);
  });

  it('should resize a widget and push overlaps down', () => {
    const widgets: DashboardWidget[] = [
      { id: 'a', layout: { x: 0, y: 0, w: 4, h: 2 } },
      { id: 'b', layout: { x: 4, y: 0, w: 4, h: 2 } },
    ];

    const resized = service.resizeWidget(widgets, 'a', 8, 2, 12);
    const a = resized.find((x) => x.id === 'a')!;
    const b = resized.find((x) => x.id === 'b')!;

    expect(a.layout.w).toBe(8);
    expect(b.layout.y).toBeGreaterThanOrEqual(2);
  });

  it('should push initially overlapped widgets down during normalizeLayout', () => {
    const widgets: DashboardWidget[] = [
      { id: 'a', layout: { x: 0, y: 0, w: 4, h: 4 } },
      { id: 'b', layout: { x: 0, y: 2, w: 4, h: 3 } },
      { id: 'c', layout: { x: 4, y: 1, w: 4, h: 2 } },
    ];

    const normalized = service.normalizeLayout(widgets, 12);
    const a = normalized.find((x) => x.id === 'a')!;
    const b = normalized.find((x) => x.id === 'b')!;
    const c = normalized.find((x) => x.id === 'c')!;

    expect(a.layout.x).toBe(0);
    expect(a.layout.y).toBe(0);
    expect(b.layout.y).toBeGreaterThanOrEqual(a.layout.y + a.layout.h);
    expect(c.layout.x).toBe(4);
    expect(c.layout.y).toBe(1);
  });

  it('should push later locked widgets down during normalizeLayout', () => {
    const widgets: DashboardWidget[] = [
      { id: 'a', locked: true, layout: { x: 0, y: 0, w: 6, h: 2 } },
      { id: 'b', locked: true, layout: { x: 0, y: 1, w: 6, h: 2 } },
    ];

    const normalized = service.normalizeLayout(widgets, 12);
    const a = normalized.find((x) => x.id === 'a')!;
    const b = normalized.find((x) => x.id === 'b')!;

    expect(a.layout.y).toBe(0);
    expect(b.layout.y).toBeGreaterThanOrEqual(a.layout.y + a.layout.h);
  });
});
