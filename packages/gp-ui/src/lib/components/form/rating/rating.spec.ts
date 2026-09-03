import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpRating } from './rating';

describe('GpRating', () => {
  let component: GpRating;
  let fixture: ComponentFixture<GpRating>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpRating]
    }).compileComponents();

    fixture = TestBed.createComponent(GpRating);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should allow half-star values when enabled', () => {
    fixture.componentRef.setInput('allowHalfStars', true);
    const fakeTarget = {
      getBoundingClientRect: () => ({ left: 0, width: 20 })
    } as unknown as HTMLElement;

    const fakeEvent = new MouseEvent('click', { clientX: 5 });
    Object.defineProperty(fakeEvent, 'currentTarget', { value: fakeTarget });

    component.rate(1, fakeEvent);
    fixture.detectChanges();

    expect(component.internalValue()).toBe(0.5);
  });
});
