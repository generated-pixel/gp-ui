import { Component, input, ChangeDetectionStrategy, ViewEncapsulation, forwardRef } from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { GpInputBase } from '../../../base/gp-input-base';
import { UniqueId } from '../../../utils/unique-id';

@Component({
  selector: 'gp-textarea',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GpTextarea),
      multi: true
    }
  ],
  templateUrl: './textarea.html',
  styleUrl: './textarea.scss'
})
export class GpTextarea extends GpInputBase<string> implements ControlValueAccessor {
  public rows = input<number>(3);
  public cols = input<number>(30);
  public autoResize = input<boolean>(false);
  public showCounter = input<boolean>(true);

  constructor() {
    super();
    this.defaultInputId.set(UniqueId.generate('gp_textarea_'));
  }

  public override writeValue(value: any): void {
    const str = value != null ? String(value) : '';
    this.internalValue.set(str);
  }

  public override handleInput(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    if (this.autoResize()) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
    this.updateValue(textarea.value);
    this.onInputEvent.emit(event);
  }
}
