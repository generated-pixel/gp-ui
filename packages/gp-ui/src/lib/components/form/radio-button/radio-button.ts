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
  public inputId = input<string>(UniqueId.generate('rb_'));
  public label = input<string>('');

  public isChecked(): boolean {
    return this.internalValue() === this.valueInput();
  }

  public onClick(event: Event): void {
    if (this.isEffectivelyDisabled() || this.readonly() || this.isChecked()) {
      return;
    }

    const val = this.valueInput();
    this.updateValue(val);
    this.onChange.emit({ checked: true, originalEvent: event });
    this.onClickEvent.emit(event);
  }
}
