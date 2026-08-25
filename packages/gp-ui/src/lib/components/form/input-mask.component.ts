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
  template: `
    <div class="gp-input-wrapper" [class.gp-input-disabled]="disabled" [class.gp-input-invalid]="invalid">
      <input
        [id]="inputId"
        type="text"
        [value]="value()"
        [placeholder]="placeholder || mask"
        [disabled]="disabled"
        [readonly]="readonly"
        [attr.aria-label]="ariaLabel || placeholder || 'Masked Input'"
        [attr.aria-invalid]="invalid"
        (input)="onInput($event)"
        (blur)="onTouchedCallback()"
        class="gp-inputtext"
      />
    </div>
  `,
  styles: [`
    gp-input-mask {
      display: inline-block;
      width: 100%;
    }
  `]
})
export class GpInputMaskComponent implements ControlValueAccessor {
  @Input() inputId = UniqueId.generate('mask_');
  @Input() mask = ''; // e.g. "(999) 999-9999" or "99/99/9999"
  @Input() slotChar = '_';
  @Input() placeholder = '';
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() invalid = false;
  @Input() ariaLabel = '';

  @Output() onComplete = new EventEmitter<string>();

  protected value = signal<string>('');

  private onChangeCallback: (value: any) => void = () => {};
  public onTouchedCallback: () => void = () => {};

  public writeValue(value: any): void {
    this.value.set(value ? this.format(value) : '');
  }

  public registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
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
