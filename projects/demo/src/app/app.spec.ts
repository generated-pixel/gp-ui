import { TestBed } from '@angular/core/testing';
import { DEFAULT_GP_ANALYTICS_TRANSLATIONS, GP_ANALYTICS_TRANSLATIONS } from 'gp-analytics';
import { App } from './app';
import { DEMO_DASHBOARD_WIDGETS } from './demo-sample-data';

function overlaps(
  left: (typeof DEMO_DASHBOARD_WIDGETS)[number],
  right: (typeof DEMO_DASHBOARD_WIDGETS)[number],
): boolean {
  const leftMaxX = left.layout.x + left.layout.w;
  const leftMaxY = left.layout.y + left.layout.h;
  const rightMaxX = right.layout.x + right.layout.w;
  const rightMaxY = right.layout.y + right.layout.h;

  return (
    left.layout.x < rightMaxX &&
    leftMaxX > right.layout.x &&
    left.layout.y < rightMaxY &&
    leftMaxY > right.layout.y
  );
}

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        {
          provide: GP_ANALYTICS_TRANSLATIONS,
          useValue: DEFAULT_GP_ANALYTICS_TRANSLATIONS,
        },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('GP Analytics — Demo');
  });

  it('should render sample designer folders', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Revenue Ops');
    expect(compiled.textContent).toContain('Growth Marketing');
  });

  it('should seed dashboard widgets without overlap', () => {
    DEMO_DASHBOARD_WIDGETS.forEach((widget, index) => {
      const overlapping = DEMO_DASHBOARD_WIDGETS.slice(index + 1).find((other) =>
        overlaps(widget, other),
      );

      expect(overlapping, `${widget.id} overlaps another seeded widget`).toBeUndefined();
    });
  });
});
