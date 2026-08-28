import { GpEditableBaseComponent } from '../../../base/gp-editable-base.component';
import {
  Component,
  input,
  output,
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
  public inputId = input<string>(UniqueId.generate('textarea_'));
  public rows = input<number>(3);
  public cols = input<number>(30);
  public autoResize = input<boolean>(false);
  public maxlength = input<number | undefined>(undefined);
  public showCounter = input<boolean>(true);

  public onInputEvent = output<Event>();
  public onFocusEvent = output<FocusEvent>();
  public onBlurEvent = output<FocusEvent>();

  public override writeValue(value: any): void {
    const str = value != null ? String(value) : '';
    this.internalValue.set(str);
  }

  public override registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  public override registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  protected onInput(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    if (this.autoResize()) {
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
