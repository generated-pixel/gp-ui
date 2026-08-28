import { GpEditableBaseComponent } from '../../../base/gp-editable-base.component';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  forwardRef,
  signal,
  computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { GpIconComponent } from '../../../icons/icon.component';
import { UniqueId } from '../../../utils/unique-id';

@Component({
  selector: 'gp-input-number',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GpInputNumberComponent),
      multi: true
    }
  ],
  templateUrl: './input-number.component.html',
  styleUrl: './input-number.component.scss'
})
export class GpInputNumberComponent extends GpEditableBaseComponent implements ControlValueAccessor {
  @Input() inputId = UniqueId.generate('num_');
  @Input() min?: number;
  @Input() max?: number;
  @Input() step = 1;
  @Input() showButtons = true;
  @Input() buttonLayout: 'stacked' | 'horizontal' = 'stacked';
  @Input() incrementButtonIcon = 'chevron-up';
  @Input() decrementButtonIcon = 'chevron-down';
  @Input() prefix = '';
  @Input() suffix = '';
  @Input() override placeholder = '';
  @Input() override disabled = false;
  @Input() override readonly = false;
  @Input() override required = false;
  @Input() override invalid = false;
  @Input() override ariaLabel = '';

  @Output() onValueChange = new EventEmitter<number | null>();

  protected displayValue = computed(() => {
    const val = this.internalValue();
    if (val === null || val === undefined) {
      return '';
    }
    return String(val);
  });

  public override writeValue(value: any): void {
    const num = value !== null && value !== undefined && value !== '' ? Number(value) : null;
    this.value = num;
    this.internalValue.set(num);
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

  public spin(delta: number): void {
    if (this.disabled || this.readonly) {
      return;
    }
    let current = this.internalValue() ?? 0;
    let next = current + delta;
    if (this.min !== undefined && next < this.min) {
      next = this.min;
    }
    if (this.max !== undefined && next > this.max) {
      next = this.max;
    }

    this.updateValue(next);
    this.onValueChange.emit(next);
  }

  protected onInput(event: Event): void {
    const text = (event.target as HTMLInputElement).value;
    if (text === '') {
      this.updateValue(null);
      this.onValueChange.emit(null);
      return;
    }
    const num = parseFloat(text);
    if (!isNaN(num)) {
      this.updateValue(num);
      this.onValueChange.emit(num);
    }
  }

  protected onBlur(): void {
    this.handleControlBlur();
    let current = this.internalValue();
    if (current !== null) {
      if (this.min !== undefined && current < this.min) {
        current = this.min;
      }
      if (this.max !== undefined && current > this.max) {
        current = this.max;
      }
      this.updateValue(current);
    }
  }

  protected onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'ArrowUp') {
      this.spin(this.step);
      event.preventDefault();
    } else if (event.key === 'ArrowDown') {
      this.spin(-this.step);
      event.preventDefault();
    }
  }
}
