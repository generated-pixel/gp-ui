import { GpEditableBaseComponent } from '../../../base/gp-editable-base.component';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation, forwardRef, signal } from '@angular/core';
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
  @Input() override value: any = null;
  @Input() override disabled = false;
  @Input() override readonly = false;
  @Input() override invalid = false;
  @Input() binary = true;

  @Output() onChange = new EventEmitter<{ checked: boolean; value: any; originalEvent: Event }>();

  protected model = signal<any>(false);

  // Inherited onChangeCallback
  // Inherited onTouchedCallback

  public isChecked(): boolean {
    const val = this.model();
    if (this.binary) {
      return !!val;
    }
    if (Array.isArray(val)) {
      return val.includes(this.value);
    }
    return val === this.value;
  }

  public override writeValue(value: any): void {
    this.model.set(value);
  }

  public override registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  public override registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  public override setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public onClick(event: Event): void {
    if (this.disabled || this.readonly) return;

    let nextValue: any;
    if (this.binary) {
      nextValue = !this.isChecked();
    } else {
      const current = this.model();
      if (Array.isArray(current)) {
        if (this.isChecked()) {
          nextValue = current.filter(item => item !== this.value);
        } else {
          nextValue = [...current, this.value];
        }
      } else {
        nextValue = this.isChecked() ? null : this.value;
      }
    }

    this.model.set(nextValue);
    this.onChangeCallback(nextValue);
    this.onTouchedCallback();
    this.onChange.emit({ checked: this.isChecked(), value: nextValue, originalEvent: event });
  }
}
