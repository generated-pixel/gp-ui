import {
  Component,
  input,
  output,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  forwardRef,
  computed
} from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { GpIconComponent } from '../../../icons/icon.component';
import { GpInputBaseComponent } from '../../../base/gp-input-base.component';

@Component({
  selector: 'gp-input-number',
  standalone: true,
  imports: [GpIconComponent],
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
export class GpInputNumberComponent extends GpInputBaseComponent<number> implements ControlValueAccessor {
  public min = input<number | undefined>(undefined);
  public max = input<number | undefined>(undefined);
  public step = input<number>(1);
  public showButtons = input<boolean>(true);
  public buttonLayout = input<'stacked' | 'horizontal'>('stacked');
  public incrementButtonIcon = input<string>('chevron-up');
  public decrementButtonIcon = input<string>('chevron-down');
  public prefix = input<string>('');
  public suffix = input<string>('');

  public onValueChange = output<number | null>();

  public displayValue = computed(() => {
    const val = this.internalValue();
    if (val === null || val === undefined) {
      return '';
    }
    return String(val);
  });

  public override writeValue(value: any): void {
    const num = value !== null && value !== undefined && value !== '' ? Number(value) : null;
    this.internalValue.set(num);
  }

  public spin(delta: number): void {
    if (this.isEffectivelyDisabled() || this.readonly()) {
      return;
    }
    const current = this.internalValue() ?? 0;
    let next = current + delta;
    const minVal = this.min();
    const maxVal = this.max();
    if (minVal !== undefined && next < minVal) {
      next = minVal;
    }
    if (maxVal !== undefined && next > maxVal) {
      next = maxVal;
    }

    this.updateValue(next);
    this.onValueChange.emit(next);
  }

  public override handleInput(event: Event): void {
    const text = (event.target as HTMLInputElement).value;
    if (text === '') {
      this.updateValue(null as any);
      this.onValueChange.emit(null);
      this.onInputEvent.emit(event);
      return;
    }
    const num = parseFloat(text);
    if (!isNaN(num)) {
      this.updateValue(num);
      this.onValueChange.emit(num);
    }
    this.onInputEvent.emit(event);
  }

  public override handleBlur(event: FocusEvent): void {
    super.handleBlur(event);
    let current = this.internalValue();
    if (current !== null) {
      const minVal = this.min();
      const maxVal = this.max();
      if (minVal !== undefined && current < minVal) {
        current = minVal;
      }
      if (maxVal !== undefined && current > maxVal) {
        current = maxVal;
      }
      this.updateValue(current);
    }
  }

  public override handleKeyDown(event: KeyboardEvent): void {
    super.handleKeyDown(event);
    if (event.key === 'ArrowUp') {
      this.spin(this.step());
      event.preventDefault();
    } else if (event.key === 'ArrowDown') {
      this.spin(-this.step());
      event.preventDefault();
    }
  }
}
