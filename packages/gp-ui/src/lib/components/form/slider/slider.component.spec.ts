import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpSliderComponent } from './slider.component';

describe('GpSliderComponent', () => {
  let component: GpSliderComponent;
  let fixture: ComponentFixture<GpSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpSliderComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GpSliderComponent);
    component = fixture.componentInstance;
  });

  it('should create the slider component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default min, max, and value', () => {
    fixture.componentRef.setInput('min', 0);
    fixture.componentRef.setInput('max', 100);
    fixture.componentRef.setInput('value', 45);
    fixture.detectChanges();

    expect(component.value()).toBe(45);
  });
});
