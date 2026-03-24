import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GpIcon } from './icon';

describe('GpIcon', () => {
  let component: GpIcon;
  let fixture: ComponentFixture<GpIcon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpIcon],
    }).compileComponents();

    fixture = TestBed.createComponent(GpIcon);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('name', 'artifact-tabular');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render an svg element', () => {
    fixture.detectChanges();
    const svg: SVGElement = fixture.nativeElement.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('should apply the correct viewBox', () => {
    fixture.detectChanges();
    const svg: SVGElement = fixture.nativeElement.querySelector('svg');
    expect(svg.getAttribute('viewBox')).toBe('0 0 24 24');
  });

  it('should default to size 24', () => {
    fixture.detectChanges();
    const svg: SVGElement = fixture.nativeElement.querySelector('svg');
    expect(svg.getAttribute('width')).toBe('24');
    expect(svg.getAttribute('height')).toBe('24');
  });

  it('should apply a custom size', () => {
    fixture.componentRef.setInput('size', 20);
    fixture.detectChanges();
    const svg: SVGElement = fixture.nativeElement.querySelector('svg');
    expect(svg.getAttribute('width')).toBe('20');
    expect(svg.getAttribute('height')).toBe('20');
  });

  it('should be aria-hidden when no label is provided', () => {
    fixture.detectChanges();
    const svg: SVGElement = fixture.nativeElement.querySelector('svg');
    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(svg.getAttribute('aria-label')).toBeNull();
    expect(svg.getAttribute('role')).toBeNull();
  });

  it('should expose aria-label and role="img" when a label is provided', () => {
    fixture.componentRef.setInput('label', 'Tabular data');
    fixture.detectChanges();
    const svg: SVGElement = fixture.nativeElement.querySelector('svg');
    expect(svg.getAttribute('aria-label')).toBe('Tabular data');
    expect(svg.getAttribute('role')).toBe('img');
    expect(svg.getAttribute('aria-hidden')).toBeNull();
  });

  it('should inject inner SVG paths for the requested icon name', () => {
    fixture.componentRef.setInput('name', 'graph-pie');
    fixture.detectChanges();
    const svg: SVGElement = fixture.nativeElement.querySelector('svg');
    expect(svg.innerHTML.trim().length).toBeGreaterThan(0);
  });

  it('should update the rendered SVG when the name input changes', async () => {
    fixture.componentRef.setInput('name', 'artifact-tabular');
    fixture.detectChanges();
    const before = fixture.nativeElement.querySelector('svg').innerHTML;

    fixture.componentRef.setInput('name', 'artifact-kpi');
    fixture.detectChanges();
    await fixture.whenStable();
    const after = fixture.nativeElement.querySelector('svg').innerHTML;

    expect(before).not.toBe(after);
  });

  it('should render different SVG content for different icon names', () => {
    fixture.componentRef.setInput('name', 'add');
    fixture.detectChanges();
    const addContent = fixture.nativeElement.querySelector('svg').innerHTML;

    fixture.componentRef.setInput('name', 'remove');
    fixture.detectChanges();
    const removeContent = fixture.nativeElement.querySelector('svg').innerHTML;

    expect(addContent).not.toBe(removeContent);
  });
});
