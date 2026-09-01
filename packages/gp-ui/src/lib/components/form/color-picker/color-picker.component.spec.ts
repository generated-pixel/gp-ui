import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpColorPickerComponent } from './color-picker.component';

describe('GpColorPickerComponent', () => {
  let component: GpColorPickerComponent;
  let fixture: ComponentFixture<GpColorPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpColorPickerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GpColorPickerComponent);
    component = fixture.componentInstance;
  });

  it('should create the color picker component', () => {
    expect(component).toBeTruthy();
  });
});
