import { Component, input, ChangeDetectionStrategy, ViewEncapsulation, forwardRef, effect } from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { GpIcon } from '../../../icons/icon';
import { UniqueId } from '../../../utils/unique-id';
import { GpRippleDirective } from '../../../directives/ripple.directive';
import { GpCheckableBase } from '../../../base/gp-checkable-base';

@Component({
  selector: 'gp-checkbox',
  standalone: true,
  imports: [GpIcon, GpRippleDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GpCheckbox),
      multi: true
    }
  ],
  templateUrl: './checkbox.html',
  styleUrl: './checkbox.scss'
})
export class GpCheckbox extends GpCheckableBase implements ControlValueAccessor {
  public label = input<string>('');
  public checkedInput = input<boolean | undefined>(undefined, { alias: 'checked' });

  constructor() {
    super();
    this.defaultInputId.set(UniqueId.generate('gp_checkbox_'));
    effect(() => {
      const isChecked = this.checkedInput();
      if (isChecked !== undefined) {
        this.internalValue.set(isChecked);
      }
    });
  }

  public isChecked(): boolean {
    const val = this.internalValue();
    const optVal = this.valueInput();
    if (this.binary()) {
      if (typeof val === 'boolean') {
        return val;
      }
      if (typeof optVal === 'boolean') {
        return optVal;
      }
      return !!val;
    }
    if (Array.isArray(val)) {
      return val.includes(optVal);
    }
    return val === optVal;
  }

  public onClick(event: Event): void {
    if (this.isEffectivelyDisabled() || this.readonly()) {
      return;
    }

    const optVal = this.valueInput();
    let nextValue: any;
    if (this.binary()) {
      nextValue = !this.isChecked();
    } else {
      const current = this.internalValue();
      if (Array.isArray(current)) {
        if (this.isChecked()) {
          nextValue = current.filter((item: any) => item !== optVal);
        } else {
          nextValue = [...current, optVal];
        }
      } else {
        nextValue = this.isChecked() ? null : optVal;
      }
    }

    this.updateValue(nextValue);
    this.checked.set(this.isChecked());
    this.onChange.emit({ checked: this.isChecked(), originalEvent: event });
    this.onClickEvent.emit(event);
  }
}
