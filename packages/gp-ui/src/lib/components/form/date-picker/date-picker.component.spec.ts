import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpDatePickerComponent } from './date-picker.component';

describe('GpDatePickerComponent', () => {
  let component: GpDatePickerComponent;
  let fixture: ComponentFixture<GpDatePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpDatePickerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GpDatePickerComponent);
    component = fixture.componentInstance;
  });

  it('should create the date picker component', () => {
    expect(component).toBeTruthy();
  });
});
