import {
  Component,
  input,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  forwardRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { UniqueId } from '../../../utils/unique-id';
import { GpRippleDirective } from '../../../directives/ripple.directive';
import { GpCheckableBaseComponent } from '../../../base/gp-checkable-base.component';

@Component({
  selector: 'gp-radio-button',
  standalone: true,
  imports: [CommonModule, GpRippleDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GpRadioButtonComponent),
      multi: true
    }
  ],
  templateUrl: './radio-button.component.html',
  styleUrl: './radio-button.component.scss'
})
export class GpRadioButtonComponent extends GpCheckableBaseComponent implements ControlValueAccessor {
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
    this.onClickEvent.emit(event as MouseEvent);
  }
}
