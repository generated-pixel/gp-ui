import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpFormFieldComponent } from './form-field.component';

describe('GpFormFieldComponent', () => {
  let component: GpFormFieldComponent;
  let fixture: ComponentFixture<GpFormFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpFormFieldComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GpFormFieldComponent);
    component = fixture.componentInstance;
  });

  it('should create the form field component', () => {
    expect(component).toBeTruthy();
  });
});
