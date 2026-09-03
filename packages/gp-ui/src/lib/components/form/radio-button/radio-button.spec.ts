import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpRadioButton } from './radio-button';

describe('GpRadioButton', () => {
  let component: GpRadioButton;
  let fixture: ComponentFixture<GpRadioButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpRadioButton]
    }).compileComponents();

    fixture = TestBed.createComponent(GpRadioButton);
    component = fixture.componentInstance;
  });

  it('should create the radio button component', () => {
    expect(component).toBeTruthy();
  });

  it('should select radio when clicked', () => {
    let selectedVal: any = null;
    component.onChange.subscribe((event: { checked: boolean; originalEvent: Event }) => (selectedVal = event.checked));

    fixture.componentRef.setInput('value', 'optionA');
    fixture.componentRef.setInput('label', 'Option A');
    fixture.detectChanges();

    const box = fixture.nativeElement.querySelector('.gp-radio-box');
    box.click();
    fixture.detectChanges();

    expect(component.checked()).toBe(true);
    expect(selectedVal).toBe(true);
  });
});
