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
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { GpIconComponent } from '../../../icons/icon.component';
import { UniqueId } from '../../../utils/unique-id';

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
  public inputId = input<string>(UniqueId.generate('input_'));
  public type = input<string>('text');
  public clearable = input<boolean>(false);
  public iconLeft = input<string>('');
  public iconRight = input<string>('');
  public maxlength = input<number | undefined>(undefined);

  public onInputEvent = output<Event>();
  public onFocusEvent = output<FocusEvent>();
  public onBlurEvent = output<FocusEvent>();
  public onClearEvent = output<void>();

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
    const inputEl = event.target as HTMLInputElement;
    this.updateValue(inputEl.value);
    this.onInputEvent.emit(event);
  }

  protected onFocus(event: FocusEvent): void {
    this.onFocusEvent.emit(event);
  }

  protected onBlur(event: FocusEvent): void {
    this.handleControlBlur();
    this.onBlurEvent.emit(event);
  }

  protected clear(event: MouseEvent): void {
    event.stopPropagation();
    this.updateValue('');
    this.onClearEvent.emit();
  }
}
