import { GpEditableBaseComponent } from '../../base/gp-editable-base.component';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation, forwardRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { UniqueId } from '../../utils/unique-id';

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
  @Input() inputId = UniqueId.generate('mask_');
  @Input() mask = ''; // e.g. "(999) 999-9999" or "99/99/9999"
  @Input() slotChar = '_';
  @Input() override placeholder = '';
  @Input() override disabled = false;
  @Input() override readonly = false;
  @Input() override invalid = false;
  @Input() override ariaLabel = '';

  @Output() onComplete = new EventEmitter<string>();

  public override value = signal<string>('');

  // Inherited onChangeCallback
  // Inherited onTouchedCallback

  public override writeValue(value: any): void {
    this.value.set(value ? this.format(value) : '');
  }

  public override registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  public override registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  public override setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  protected onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const formatted = this.format(input.value);
    input.value = formatted;
    this.value.set(formatted);
    this.onChangeCallback(formatted);

    if (this.mask && formatted.length === this.mask.length && !formatted.includes(this.slotChar)) {
      this.onComplete.emit(formatted);
    }
  }

  private format(val: string): string {
    if (!this.mask || !val) return val || '';
    const digits = val.replace(/\D/g, '');
    let digitIdx = 0;
    let result = '';

    for (let i = 0; i < this.mask.length; i++) {
      const maskChar = this.mask[i];
      if (maskChar === '9') {
        if (digitIdx < digits.length) {
          result += digits[digitIdx++];
        } else {
          break;
        }
      } else if (maskChar === 'a') {
        // letter slot
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
