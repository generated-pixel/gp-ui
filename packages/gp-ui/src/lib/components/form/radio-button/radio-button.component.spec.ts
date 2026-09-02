import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpRadioButtonComponent } from './radio-button.component';

describe('GpRadioButtonComponent', () => {
  let component: GpRadioButtonComponent;
  let fixture: ComponentFixture<GpRadioButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpRadioButtonComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GpRadioButtonComponent);
    component = fixture.componentInstance;
  });

  it('should create the radio button component', () => {
    expect(component).toBeTruthy();
  });

  it('should select radio when clicked', () => {
    let selectedVal: any = null;
    component.onChangeEvent.subscribe((val) => (selectedVal = val));

    fixture.componentRef.setInput('value', 'optionA');
    fixture.componentRef.setInput('label', 'Option A');
    fixture.detectChanges();

    const box = fixture.nativeElement.querySelector('.gp-radio-box');
    box.click();
    fixture.detectChanges();

    expect(component.checked()).toBeTrue();
    expect(selectedVal).toBe('optionA');
  });
});
