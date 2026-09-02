import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpCheckbox } from './checkbox';

describe('GpCheckbox', () => {
  let component: GpCheckbox;
  let fixture: ComponentFixture<GpCheckbox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpCheckbox]
    }).compileComponents();

    fixture = TestBed.createComponent(GpCheckbox);
    component = fixture.componentInstance;
  });

  it('should create the checkbox component', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle checked state on click and emit change', () => {
    let changedValue: any = null;
    component.onChangeEvent.subscribe((val) => (changedValue = val));

    fixture.componentRef.setInput('label', 'Accept Terms');
    fixture.detectChanges();

    const box = fixture.nativeElement.querySelector('.gp-checkbox-box');
    box.click();
    fixture.detectChanges();

    expect(component.checked()).toBeTrue();
    expect(changedValue).toBeTrue();
  });

  it('should not toggle when disabled', () => {
    let changed = false;
    component.onChangeEvent.subscribe(() => (changed = true));

    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const box = fixture.nativeElement.querySelector('.gp-checkbox-box');
    box.click();
    fixture.detectChanges();

    expect(component.checked()).toBeFalse();
    expect(changed).toBeFalse();
  });
});
