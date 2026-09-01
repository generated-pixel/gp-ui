import { Component, input, ChangeDetectionStrategy, ViewEncapsulation, forwardRef, effect } from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { GpIconComponent } from '../../../icons/icon.component';
import { UniqueId } from '../../../utils/unique-id';
import { GpRippleDirective } from '../../../directives/ripple.directive';
import { GpCheckableBaseComponent } from '../../../base/gp-checkable-base.component';

@Component({
  selector: 'gp-checkbox',
  standalone: true,
  imports: [GpIconComponent, GpRippleDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GpCheckboxComponent),
      multi: true
    }
  ],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss'
})
export class GpCheckboxComponent extends GpCheckableBaseComponent implements ControlValueAccessor {
  public inputId = input<string>(UniqueId.generate('chk_'));
  public label = input<string>('');
  public checkedInput = input<boolean | undefined>(undefined, { alias: 'checked' });

  constructor() {
    super();
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
    this.onChange.emit({ checked: this.isChecked(), originalEvent: event });
    this.onClickEvent.emit(event);
  }
}
