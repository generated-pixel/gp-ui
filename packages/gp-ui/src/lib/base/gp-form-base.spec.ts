import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { GpInputText } from '../components/form/input-text/input-text';
import { GpSelect, GpSelectItem } from '../components/form/select/select';
import { GpCheckbox } from '../components/form/checkbox/checkbox';

@Component({
  standalone: true,
  imports: [GpInputText, GpSelect, GpCheckbox],
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

    <gp-checkbox #chkComp [label]="'Accept terms'" (onChange)="onCheckboxChange($event)" />
  `
})
class FormBaseTestHost {
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
  let fixture: ComponentFixture<FormBaseTestHost>;
  let host: FormBaseTestHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormBaseTestHost]
    }).compileComponents();

    fixture = TestBed.createComponent(FormBaseTestHost);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should propagate input, focus, blur, and clear events on GpInputBase', () => {
    const inputEl = fixture.nativeElement.querySelector('input.gp-inputtext');
    expect(inputEl).toBeTruthy();

    inputEl.value = 'John Doe';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(host.inputEventFired).toBe(true);

    inputEl.dispatchEvent(new FocusEvent('focus'));
    fixture.detectChanges();
    expect(host.focusEventFired).toBe(true);

    inputEl.dispatchEvent(new FocusEvent('blur'));
    fixture.detectChanges();
    expect(host.blurEventFired).toBe(true);
  });

  it('should handle options normalization, open, close, and change on GpSelectBase', () => {
    const select = fixture.debugElement.children[1].componentInstance as GpSelect;
    expect(select.normalizedOptions().length).toBe(2);

    select.showOverlay();
    fixture.detectChanges();
    expect(host.selectOpenFired).toBe(true);
    expect(select.overlayVisible()).toBe(true);

    select.selectItem(select.normalizedOptions()[0], new MouseEvent('click'));
    fixture.detectChanges();
    expect(host.selectChangeFired).toBe(true);
    expect(select.overlayVisible()).toBe(false);
  });

  it('should handle checked state toggle on GpCheckableBase', () => {
    const chk = fixture.debugElement.children[2].componentInstance as GpCheckbox;
    expect(chk.isChecked()).toBe(false);

    chk.onClick(new MouseEvent('click'));
    fixture.detectChanges();
    expect(chk.isChecked()).toBe(true);
    expect(host.checkboxChangeFired).toBe(true);
  });
});
