import { Component, input, ChangeDetectionStrategy, ViewEncapsulation, forwardRef } from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { UniqueId } from '../../../utils/unique-id';
import { GpRippleDirective } from '../../../directives/ripple.directive';
import { GpCheckableBase } from '../../../base/gp-checkable-base';

@Component({
  selector: 'gp-radio-button',
  standalone: true,
  imports: [GpRippleDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GpRadioButton),
      multi: true
    }
  ],
  templateUrl: './radio-button.html',
  styleUrl: './radio-button.scss'
})
export class GpRadioButton extends GpCheckableBase implements ControlValueAccessor {
  public label = input<string>('');

  public override onInit(): void {
    // For radio button, valueInput is the radio's own option value, not the selected group value.
    const optVal = this.valueInput();
    const curVal = this.internalValue();
    if (curVal !== null && curVal !== undefined && curVal === optVal) {
      this.checked.set(true);
    }
  }

  public override writeValue(value: any): void {
    super.writeValue(value);
    const optVal = this.valueInput();
    this.checked.set(value !== null && value !== undefined && value === optVal);
  }

  public isChecked(): boolean {
    return this.checked();
  }

  public onClick(event: Event): void {
    if (this.isEffectivelyDisabled() || this.readonly() || this.checked()) {
      return;
    }

    const val = this.valueInput();
    this.internalValue.set(val);
    this.updateValue(val);
    this.checked.set(true);
    this.onChange.emit({ checked: true, originalEvent: event });
    this.onClickEvent.emit(event);
  }
}
