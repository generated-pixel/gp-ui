import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpDateRangePickerComponent } from './date-range-picker.component';

describe('GpDateRangePickerComponent', () => {
  let component: GpDateRangePickerComponent;
  let fixture: ComponentFixture<GpDateRangePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpDateRangePickerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GpDateRangePickerComponent);
    component = fixture.componentInstance;
  });

  it('should create the date range picker component', () => {
    expect(component).toBeTruthy();
  });
});
