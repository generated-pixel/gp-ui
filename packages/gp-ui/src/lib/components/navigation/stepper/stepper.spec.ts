import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpStepper } from './stepper';

describe('GpStepper', () => {
  let component: GpStepper;
  let fixture: ComponentFixture<GpStepper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpStepper]
    }).compileComponents();

    fixture = TestBed.createComponent(GpStepper);
    component = fixture.componentInstance;
  });

  it('should create the stepper component', () => {
    expect(component).toBeTruthy();
  });
});
