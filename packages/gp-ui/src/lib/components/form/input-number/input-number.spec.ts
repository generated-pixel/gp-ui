import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpInputNumber } from './input-number';

describe('GpInputNumber', () => {
  let component: GpInputNumber;
  let fixture: ComponentFixture<GpInputNumber>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpInputNumber]
    }).compileComponents();

    fixture = TestBed.createComponent(GpInputNumber);
    component = fixture.componentInstance;
  });

  it('should create the input-number component', () => {
    expect(component).toBeTruthy();
  });

  it('should increment and decrement with step buttons', () => {
    fixture.componentRef.setInput('value', 10);
    fixture.componentRef.setInput('step', 1);
    fixture.componentRef.setInput('showButtons', true);
    fixture.detectChanges();

    const upBtn: HTMLButtonElement = fixture.nativeElement.querySelector('.gp-inputnumber-button-up');
    const downBtn: HTMLButtonElement = fixture.nativeElement.querySelector('.gp-inputnumber-button-down');

    expect(upBtn).toBeTruthy();
    expect(downBtn).toBeTruthy();

    upBtn.click();
    fixture.detectChanges();
    expect(component.value()).toBe(11);

    downBtn.click();
    fixture.detectChanges();
    expect(component.value()).toBe(10);
  });
});
