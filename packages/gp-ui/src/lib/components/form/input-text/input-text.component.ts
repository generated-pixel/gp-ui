import {
  Component,
  input,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  forwardRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { GpIconComponent } from '../../../icons/icon.component';
import { GpInputBaseComponent } from '../../../base/gp-input-base.component';

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
export class GpInputTextComponent extends GpInputBaseComponent<string> implements ControlValueAccessor {
  public type = input<string>('text');

  public override writeValue(value: any): void {
    const str = value != null ? String(value) : '';
    this.internalValue.set(str);
  }
}
