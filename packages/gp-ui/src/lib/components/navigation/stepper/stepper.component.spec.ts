import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpStepperComponent } from './stepper.component';

describe('GpStepperComponent', () => {
  let component: GpStepperComponent;
  let fixture: ComponentFixture<GpStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpStepperComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GpStepperComponent);
    component = fixture.componentInstance;
  });

  it('should create the stepper component', () => {
    expect(component).toBeTruthy();
  });
});
