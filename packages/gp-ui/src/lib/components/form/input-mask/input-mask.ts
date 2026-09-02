import { Component, input, output, ChangeDetectionStrategy, ViewEncapsulation, forwardRef } from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { GpInputBase } from '../../../base/gp-input-base';

@Component({
  selector: 'gp-input-mask',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GpInputMask),
      multi: true
    }
  ],
  templateUrl: './input-mask.html',
  styleUrl: './input-mask.scss'
})
export class GpInputMask extends GpInputBase<string> implements ControlValueAccessor {
  public mask = input<string>('');
  public slotChar = input<string>('_');

  public onComplete = output<string>();

  public override writeValue(value: any): void {
    const formatted = value ? this.format(value) : '';
    this.internalValue.set(formatted);
  }

  public override handleInput(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    const formatted = this.format(inputEl.value);
    inputEl.value = formatted;
    this.updateValue(formatted);
    this.onInputEvent.emit(event);

    const maskPattern = this.mask();
    if (maskPattern && formatted.length === maskPattern.length && !formatted.includes(this.slotChar())) {
      this.onComplete.emit(formatted);
    }
  }

  private format(val: string): string {
    const maskPattern = this.mask();
    if (!maskPattern || !val) {
      return val || '';
    }
    const digits = val.replace(/\D/g, '');
    let digitIdx = 0;
    let result = '';

    for (let i = 0; i < maskPattern.length; i++) {
      const maskChar = maskPattern[i];
      if (maskChar === '9') {
        if (digitIdx < digits.length) {
          result += digits[digitIdx++];
        } else {
          break;
        }
      } else if (maskChar === 'a') {
        if (digitIdx < val.length && /[a-zA-Z]/.test(val[digitIdx])) {
          result += val[digitIdx++];
        } else {
          break;
        }
      } else {
        if (digitIdx <= digits.length && digitIdx > 0) {
          result += maskChar;
        }
      }
    }
    return result;
  }
}
