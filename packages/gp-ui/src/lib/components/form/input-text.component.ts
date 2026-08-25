import { GpEditableBaseComponent } from '../../base/gp-editable-base.component';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation, forwardRef, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { GpIconComponent } from '../../icons/icon.component';
import { UniqueId } from '../../utils/unique-id';

@Component({
  selector: 'gp-input-text',
  standalone: true,
  imports: [CommonModule, FormsModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GpInputTextComponent),
      multi: true
    }
  ],
  templateUrl: './input-text.component.html',
  styleUrl: './input-text.component.scss'
})
export class GpInputTextComponent extends GpEditableBaseComponent implements ControlValueAccessor {
  @Input() inputId = UniqueId.generate('input_');
  @Input() type = 'text';
  @Input() override placeholder = '';
  @Input() override disabled = false;
  @Input() override readonly = false;
  @Input() override required = false;
  @Input() override invalid = false;
  @Input() clearable = false;
  @Input() iconLeft = '';
  @Input() iconRight = '';
  @Input() maxlength?: number;
  @Input() override ariaLabel = '';

  @Output() onInputEvent = new EventEmitter<Event>();
  @Output() onFocusEvent = new EventEmitter<FocusEvent>();
  @Output() onBlurEvent = new EventEmitter<FocusEvent>();
  @Output() onClearEvent = new EventEmitter<void>();

  public override value = signal<string>('');

  // Inherited onChangeCallback
  // Inherited onTouchedCallback

  public override writeValue(value: any): void {
    this.value.set(value != null ? String(value) : '');
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

  protected onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.value.set(input.value);
    this.onChangeCallback(input.value);
    this.onInputEvent.emit(event);
  }

  protected onFocus(event: FocusEvent): void {
    this.onFocusEvent.emit(event);
  }

  protected onBlur(event: FocusEvent): void {
    this.onTouchedCallback();
    this.onBlurEvent.emit(event);
  }

  protected clear(event: MouseEvent): void {
    event.stopPropagation();
    this.value.set('');
    this.onChangeCallback('');
    this.onClearEvent.emit();
  }
}
