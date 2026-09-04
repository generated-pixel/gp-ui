import { Component, input, ChangeDetectionStrategy, ViewEncapsulation, forwardRef } from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { GpIcon } from '../../../icons/icon';
import { GpInputBase } from '../../../base/gp-input-base';
import { UniqueId } from '../../../utils/unique-id';

@Component({
  selector: 'gp-input-text',
  standalone: true,
  imports: [FormsModule, GpIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GpInputText),
      multi: true
    }
  ],
  templateUrl: './input-text.html',
  styleUrl: './input-text.scss'
})
export class GpInputText extends GpInputBase<string> implements ControlValueAccessor {
  public type = input<string>('text');

  constructor() {
    super();
    this.defaultInputId.set(UniqueId.generate('gp_inputtext_'));
  }

  public override writeValue(value: any): void {
    const str = value != null ? String(value) : '';
    this.internalValue.set(str);
  }
}
