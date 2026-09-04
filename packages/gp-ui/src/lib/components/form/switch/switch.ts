import { Component, input, ChangeDetectionStrategy, ViewEncapsulation, forwardRef } from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { UniqueId } from '../../../utils/unique-id';
import { GpCheckableBase } from '../../../base/gp-checkable-base';

@Component({
  selector: 'gp-switch',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GpSwitch),
      multi: true
    }
  ],
  templateUrl: './switch.html',
  styleUrl: './switch.scss'
})
export class GpSwitch extends GpCheckableBase implements ControlValueAccessor {
  public label = input<string>('');

  constructor() {
    super();
    this.defaultInputId.set(UniqueId.generate('gp_switch_'));
  }

  public toggle(event: Event): void {
    this.handleToggle(event);
  }
}
