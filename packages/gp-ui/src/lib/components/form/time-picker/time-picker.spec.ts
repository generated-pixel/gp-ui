import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpTimePicker } from './time-picker';

describe('GpTimePicker', () => {
  let component: GpTimePicker;
  let fixture: ComponentFixture<GpTimePicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpTimePicker]
    }).compileComponents();

    fixture = TestBed.createComponent(GpTimePicker);
    component = fixture.componentInstance;
  });

  it('should create the time picker component', () => {
    expect(component).toBeTruthy();
  });
});
