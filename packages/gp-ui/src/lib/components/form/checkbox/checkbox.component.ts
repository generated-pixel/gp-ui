import { GpEditableBaseComponent } from '../../../base/gp-editable-base.component';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  forwardRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { GpIconComponent } from '../../../icons/icon.component';
import { UniqueId } from '../../../utils/unique-id';
import { GpRippleDirective } from '../../../directives/ripple.directive';

@Component({
  selector: 'gp-checkbox',
  standalone: true,
  imports: [CommonModule, GpIconComponent, GpRippleDirective],
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
export class GpCheckboxComponent extends GpEditableBaseComponent implements ControlValueAccessor {
  @Input() inputId = UniqueId.generate('chk_');
  @Input() label = '';
  @Input() binary = true;

  @Input()
  set checked(val: boolean | undefined) {
    if (val !== undefined) {
      this.internalValue.set(val);
    }
  }

  @Output() onChange = new EventEmitter<{ checked: boolean; value: any; originalEvent: Event }>();

  public isChecked(): boolean {
    const val = this.internalValue();
    if (this.binary) {
      if (typeof val === 'boolean') {
        return val;
      }
      if (typeof this.value === 'boolean') {
        return this.value;
      }
      return !!val;
    }
    if (Array.isArray(val)) {
      return val.includes(this.value);
    }
    return val === this.value;
  }

  public onClick(event: Event): void {
    if (this.disabled || this.readonly) {
      return;
    }

    let nextValue: any;
    if (this.binary) {
      nextValue = !this.isChecked();
    } else {
      const current = this.internalValue();
      if (Array.isArray(current)) {
        if (this.isChecked()) {
          nextValue = current.filter((item) => item !== this.value);
        } else {
          nextValue = [...current, this.value];
        }
      } else {
        nextValue = this.isChecked() ? null : this.value;
      }
    }

    this.updateValue(nextValue);
    this.onChange.emit({ checked: this.isChecked(), value: nextValue, originalEvent: event });
  }
}
