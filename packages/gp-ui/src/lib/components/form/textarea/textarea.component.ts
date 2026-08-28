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
import { UniqueId } from '../../../utils/unique-id';

@Component({
  selector: 'gp-textarea',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GpTextareaComponent),
      multi: true
    }
  ],
  templateUrl: './textarea.component.html',
  styleUrl: './textarea.component.scss'
})
export class GpTextareaComponent extends GpEditableBaseComponent implements ControlValueAccessor {
  @Input() inputId = UniqueId.generate('textarea_');
  @Input() rows = 3;
  @Input() cols = 30;
  @Input() override placeholder = '';
  @Input() override disabled = false;
  @Input() override readonly = false;
  @Input() override required = false;
  @Input() override invalid = false;
  @Input() autoResize = false;
  @Input() maxlength?: number;
  @Input() showCounter = true;
  @Input() override ariaLabel = '';

  @Output() onInputEvent = new EventEmitter<Event>();
  @Output() onFocusEvent = new EventEmitter<FocusEvent>();
  @Output() onBlurEvent = new EventEmitter<FocusEvent>();

  public override writeValue(value: any): void {
    const str = value != null ? String(value) : '';
    this.value = str;
    this.internalValue.set(str);
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
    const textarea = event.target as HTMLTextAreaElement;
    if (this.autoResize) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
    this.updateValue(textarea.value);
    this.onInputEvent.emit(event);
  }

  protected onFocus(event: FocusEvent): void {
    this.onFocusEvent.emit(event);
  }

  protected onBlur(event: FocusEvent): void {
    this.handleControlBlur();
    this.onBlurEvent.emit(event);
  }
}
