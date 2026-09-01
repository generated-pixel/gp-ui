import { Component, input, ChangeDetectionStrategy, ViewEncapsulation, forwardRef } from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { UniqueId } from '../../../utils/unique-id';
import { GpCheckableBaseComponent } from '../../../base/gp-checkable-base.component';

@Component({
  selector: 'gp-switch',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GpSwitchComponent),
      multi: true
    }
  ],
  templateUrl: './switch.component.html',
  styleUrl: './switch.component.scss'
})
export class GpSwitchComponent extends GpCheckableBaseComponent implements ControlValueAccessor {
  public inputId = input<string>(UniqueId.generate('switch_'));
  public label = input<string>('');

  public toggle(event: Event): void {
    this.handleToggle(event);
  }
}
