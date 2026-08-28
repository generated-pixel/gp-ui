import { GpEditableBaseComponent } from '../../../base/gp-editable-base.component';
import {
  Component,
  input,
  output,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  forwardRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { UniqueId } from '../../../utils/unique-id';

@Component({
  selector: 'gp-input-mask',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GpInputMaskComponent),
      multi: true
    }
  ],
  templateUrl: './input-mask.component.html',
  styleUrl: './input-mask.component.scss'
})
export class GpInputMaskComponent extends GpEditableBaseComponent implements ControlValueAccessor {
  public inputId = input<string>(UniqueId.generate('mask_'));
  public mask = input<string>('');
  public slotChar = input<string>('_');

  public onComplete = output<string>();

  public override writeValue(value: any): void {
    const formatted = value ? this.format(value) : '';
    this.internalValue.set(formatted);
  }

  public override registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  public override registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  protected onInput(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    const formatted = this.format(inputEl.value);
    inputEl.value = formatted;
    this.updateValue(formatted);

    const maskPattern = this.mask();
    if (maskPattern && formatted.length === maskPattern.length && !formatted.includes(this.slotChar())) {
      this.onComplete.emit(formatted);
    }
  }

  protected onBlur(): void {
    this.handleControlBlur();
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
