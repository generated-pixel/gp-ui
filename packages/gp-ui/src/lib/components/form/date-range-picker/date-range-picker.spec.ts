import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpDateRangePicker } from './date-range-picker';

describe('GpDateRangePicker', () => {
  let component: GpDateRangePicker;
  let fixture: ComponentFixture<GpDateRangePicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpDateRangePicker]
    }).compileComponents();

    fixture = TestBed.createComponent(GpDateRangePicker);
    component = fixture.componentInstance;
  });

  it('should create the date range picker component', () => {
    expect(component).toBeTruthy();
  });
});
