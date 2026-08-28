import { GpEditableBaseComponent } from '../../../base/gp-editable-base.component';
import {
  Component,
  input,
  output,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  forwardRef,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { UniqueId } from '../../../utils/unique-id';

@Component({
  selector: 'gp-switch',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GpSwitchComponent),
      multi: true
    }
  ],
  templateUrl: './switch.component.html',
  styleUrl: './switch.component.scss'
})
export class GpSwitchComponent extends GpEditableBaseComponent implements ControlValueAccessor {
  public inputId = input<string>(UniqueId.generate('switch_'));
  public label = input<string>('');

  public onChange = output<{ checked: boolean; originalEvent: Event }>();

  protected checked = signal<boolean>(false);

  public override writeValue(value: any): void {
    this.checked.set(!!value);
  }

  public override registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  public override registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  public toggle(event: Event): void {
    if (this.isEffectivelyDisabled() || this.readonly()) {
      return;
    }
    const next = !this.checked();
    this.checked.set(next);
    this.onChangeCallback(next);
    this.onTouchedCallback();
    this.onChange.emit({ checked: next, originalEvent: event });
  }
}
