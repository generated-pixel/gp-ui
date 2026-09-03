import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpSlider } from './slider';

describe('GpSlider', () => {
  let component: GpSlider;
  let fixture: ComponentFixture<GpSlider>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpSlider]
    }).compileComponents();

    fixture = TestBed.createComponent(GpSlider);
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

    expect(component.value).toBe(45);
  });
});
