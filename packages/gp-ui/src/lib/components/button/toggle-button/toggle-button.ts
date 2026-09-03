import { GpEditableBase } from '../../../base/gp-editable-base';
import {
  Component,
  input,
  output,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  forwardRef,
  signal,
  computed
} from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { GpIcon } from '../../../icons/icon';
import { GpRippleDirective } from '../../../directives/ripple.directive';
import { GpButtonSeverity, GpButtonSize, GpIconPosition } from '../../../base/gp-button-base';

@Component({
  selector: 'gp-toggle-button',
  standalone: true,
  imports: [GpIcon, GpRippleDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GpToggleButton),
      multi: true
    }
  ],
  templateUrl: './toggle-button.html',
  styleUrl: './toggle-button.scss'
})
export class GpToggleButton extends GpEditableBase implements ControlValueAccessor {
  public onLabel = input<string>('Yes');
  public offLabel = input<string>('No');
  public onIcon = input<string>('');
  public offIcon = input<string>('');
  public iconPos = input<GpIconPosition>('left');
  public size = input<GpButtonSize>('md');
  public severity = input<GpButtonSeverity>('primary');
  public autofocus = input<boolean>(false);
  public tabindex = input<number | undefined>(undefined);

  public onChange = output<{ checked: boolean; originalEvent: Event }>();
  public onClickEvent = output<MouseEvent>();
  public onFocusEvent = output<FocusEvent>();
  public onBlurEvent = output<FocusEvent>();
  public onKeyDownEvent = output<KeyboardEvent>();
  public onKeyUpEvent = output<KeyboardEvent>();

  public checked = signal<boolean>(false);

  protected toggleButtonClass = computed(() => {
    return [
      'gp-button',
      'gp-toggle-button',
      `gp-button-${this.size()}`,
      `gp-button-${this.severity()}`,
      this.checked() ? 'gp-toggle-button--checked gp-toggle-button-checked' : '',
      this.isEffectivelyDisabled() ? 'gp-button--disabled gp-button-disabled' : '',
      this.styleClass()
    ]
      .filter(Boolean)
      .join(' ');
  });

  public override writeValue(value: any): void {
    this.checked.set(!!value);
  }

  public override registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  public override registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  public toggle(event?: MouseEvent): void {
    if (this.isEffectivelyDisabled()) {
      return;
    }
    const next = !this.checked();
    this.checked.set(next);
    this.onChangeCallback(next);
    this.onTouchedCallback();
    this.onChange.emit({ checked: next, originalEvent: event || new CustomEvent('change') });
    if (event) {
      this.onClickEvent.emit(event);
    }
  }

  public onFocus(event: FocusEvent): void {
    if (!this.isEffectivelyDisabled()) {
      this.onFocusEvent.emit(event);
    }
  }

  public onBlur(event: FocusEvent): void {
    this.onTouchedCallback();
    if (!this.isEffectivelyDisabled()) {
      this.onBlurEvent.emit(event);
    }
  }

  public onKeyDown(event: KeyboardEvent): void {
    if (this.isEffectivelyDisabled()) {
      return;
    }
    this.onKeyDownEvent.emit(event);
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      this.toggle();
    }
  }

  public onKeyUp(event: KeyboardEvent): void {
    if (!this.isEffectivelyDisabled()) {
      this.onKeyUpEvent.emit(event);
    }
  }
}
