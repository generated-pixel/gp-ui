import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpDatePicker } from './date-picker';

describe('GpDatePicker', () => {
  let component: GpDatePicker;
  let fixture: ComponentFixture<GpDatePicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpDatePicker]
    }).compileComponents();

    fixture = TestBed.createComponent(GpDatePicker);
    component = fixture.componentInstance;
  });

  it('should create the date picker component', () => {
    expect(component).toBeTruthy();
  });
});
