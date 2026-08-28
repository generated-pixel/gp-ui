import {
  Component,
  input,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  forwardRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { GpInputBaseComponent } from '../../../base/gp-input-base.component';

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
export class GpTextareaComponent extends GpInputBaseComponent<string> implements ControlValueAccessor {
  public rows = input<number>(3);
  public cols = input<number>(30);
  public autoResize = input<boolean>(false);
  public showCounter = input<boolean>(true);

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
