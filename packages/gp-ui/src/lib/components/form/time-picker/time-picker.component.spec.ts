import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpTimePickerComponent } from './time-picker.component';

describe('GpTimePickerComponent', () => {
  let component: GpTimePickerComponent;
  let fixture: ComponentFixture<GpTimePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpTimePickerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GpTimePickerComponent);
    component = fixture.componentInstance;
  });

  it('should create the time picker component', () => {
    expect(component).toBeTruthy();
  });
});
