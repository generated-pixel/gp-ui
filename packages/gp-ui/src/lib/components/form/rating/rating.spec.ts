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
    component.allowHalfStars = true;
    const fakeTarget = {
      getBoundingClientRect: () => ({ left: 0, width: 20 })
    } as HTMLElement;

    component.rate(1, { clientX: 5, currentTarget: fakeTarget } as MouseEvent);
    fixture.detectChanges();

    expect(component.internalValue()).toBe(0.5);
    expect(component.value).toBe(0.5);
  });
});
