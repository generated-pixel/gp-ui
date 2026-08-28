import { GpEditableBaseComponent } from '../../../base/gp-editable-base.component';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  forwardRef,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { UniqueId } from '../../../utils/unique-id';
import { GpRippleDirective } from '../../../directives/ripple.directive';

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
export class GpRadioButtonComponent extends GpEditableBaseComponent implements ControlValueAccessor {
  @Input() inputId = UniqueId.generate('rb_');
  @Input() override name = '';
  @Input() override value: any = null;
  @Input() label = '';
  @Input() override disabled = false;
  @Input() override readonly = false;
  @Input() override invalid = false;

  @Output() onClickEvent = new EventEmitter<{ value: any; originalEvent: Event }>();

  protected model = signal<any>(null);

  // Inherited onChangeCallback
  // Inherited onTouchedCallback

  public isChecked(): boolean {
    return this.model() === this.value;
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
    if (this.disabled || this.readonly || this.isChecked()) return;

    this.model.set(this.value);
    this.onChangeCallback(this.value);
    this.onTouchedCallback();
    this.onClickEvent.emit({ value: this.value, originalEvent: event });
  }
}
