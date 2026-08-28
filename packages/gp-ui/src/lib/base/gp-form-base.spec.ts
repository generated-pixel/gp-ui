import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { GpInputTextComponent } from '../components/form/input-text/input-text.component';
import { GpSelectComponent, GpSelectItem } from '../components/form/select/select.component';
import { GpCheckboxComponent } from '../components/form/checkbox/checkbox.component';

@Component({
  standalone: true,
  imports: [GpInputTextComponent, GpSelectComponent, GpCheckboxComponent],
  template: `
    <gp-input-text
      #inputText
      [placeholder]="'Enter name'"
      [clearable]="true"
      (onInputEvent)="onInput($event)"
      (onFocusEvent)="onFocus($event)"
      (onBlurEvent)="onBlur($event)"
      (onClearEvent)="onClear()"
    />

    <gp-select
      #selectComp
      [options]="selectOptions"
      (onChange)="onSelectChange($event)"
      (onOpen)="onSelectOpen()"
      (onClose)="onSelectClose()"
    />

    <gp-checkbox
      #chkComp
      [label]="'Accept terms'"
      (onChange)="onCheckboxChange($event)"
    />
  `
})
class FormBaseTestHostComponent {
  inputEventFired = false;
  focusEventFired = false;
  blurEventFired = false;
  clearEventFired = false;
  selectChangeFired = false;
  selectOpenFired = false;
  selectCloseFired = false;
  checkboxChangeFired = false;

  selectOptions: GpSelectItem[] = [
    { label: 'Option A', value: 'a' },
    { label: 'Option B', value: 'b' }
  ];

  onInput(e: Event) {
    this.inputEventFired = true;
  }
  onFocus(e: FocusEvent) {
    this.focusEventFired = true;
  }
  onBlur(e: FocusEvent) {
    this.blurEventFired = true;
  }
  onClear() {
    this.clearEventFired = true;
  }
  onSelectChange(e: any) {
    this.selectChangeFired = true;
  }
  onSelectOpen() {
    this.selectOpenFired = true;
  }
  onSelectClose() {
    this.selectCloseFired = true;
  }
  onCheckboxChange(e: any) {
    this.checkboxChangeFired = true;
  }
}

describe('Form Base Classes Architecture', () => {
  let fixture: ComponentFixture<FormBaseTestHostComponent>;
  let host: FormBaseTestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormBaseTestHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FormBaseTestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should propagate input, focus, blur, and clear events on GpInputBaseComponent', () => {
    const inputEl = fixture.nativeElement.querySelector('input.gp-inputtext');
    expect(inputEl).toBeTruthy();

    inputEl.value = 'John Doe';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(host.inputEventFired).toBeTrue();

    inputEl.dispatchEvent(new FocusEvent('focus'));
    fixture.detectChanges();
    expect(host.focusEventFired).toBeTrue();

    inputEl.dispatchEvent(new FocusEvent('blur'));
    fixture.detectChanges();
    expect(host.blurEventFired).toBeTrue();
  });

  it('should handle options normalization, open, close, and change on GpSelectBaseComponent', () => {
    const select = (fixture.debugElement.children[1].componentInstance) as GpSelectComponent;
    expect(select.normalizedOptions().length).toBe(2);

    select.showOverlay();
    fixture.detectChanges();
    expect(host.selectOpenFired).toBeTrue();
    expect(select.overlayVisible()).toBeTrue();

    select.selectItem(select.normalizedOptions()[0], new MouseEvent('click'));
    fixture.detectChanges();
    expect(host.selectChangeFired).toBeTrue();
    expect(select.overlayVisible()).toBe(false);
  });

  it('should handle checked state toggle on GpCheckableBaseComponent', () => {
    const chk = (fixture.debugElement.children[2].componentInstance) as GpCheckboxComponent;
    expect(chk.isChecked()).toBeFalse();

    chk.onClick(new MouseEvent('click'));
    fixture.detectChanges();
    expect(chk.isChecked()).toBeTrue();
    expect(host.checkboxChangeFired).toBeTrue();
  });
});
