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
import { GpIconComponent } from '../../../icons/icon.component';
import { GpRippleDirective } from '../../../directives/ripple.directive';

@Component({
  selector: 'gp-toggle-button',
  standalone: true,
  imports: [CommonModule, GpIconComponent, GpRippleDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GpToggleButtonComponent),
      multi: true
    }
  ],
  templateUrl: './toggle-button.component.html',
  styleUrl: './toggle-button.component.scss'
})
export class GpToggleButtonComponent extends GpEditableBaseComponent implements ControlValueAccessor {
  @Input() onLabel = 'Yes';
  @Input() offLabel = 'No';
  @Input() onIcon = '';
  @Input() offIcon = '';
  @Input() override disabled = false;

  @Output() onChange = new EventEmitter<{ checked: boolean; originalEvent: Event }>();

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

  public override setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public toggle(): void {
    if (this.disabled) return;
    const next = !this.checked();
    this.checked.set(next);
    this.onChangeCallback(next);
    this.onTouchedCallback();
    this.onChange.emit({ checked: next, originalEvent: new CustomEvent('change') });
  }
}
