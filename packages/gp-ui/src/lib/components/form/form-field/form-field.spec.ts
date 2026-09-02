import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpFormField } from './form-field';

describe('GpFormField', () => {
  let component: GpFormField;
  let fixture: ComponentFixture<GpFormField>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpFormField]
    }).compileComponents();

    fixture = TestBed.createComponent(GpFormField);
    component = fixture.componentInstance;
  });

  it('should create the form field component', () => {
    expect(component).toBeTruthy();
  });
});
