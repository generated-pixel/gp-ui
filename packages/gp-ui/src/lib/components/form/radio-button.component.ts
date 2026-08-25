import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation, forwardRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { UniqueId } from '../../utils/unique-id';
import { GpRippleDirective } from '../../directives/ripple.directive';

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
  template: `
    <div
      class="gp-radiobutton"
      [class.gp-radiobutton-checked]="isChecked()"
      [class.gp-radiobutton-disabled]="disabled"
      [class.gp-input-invalid]="invalid"
      (click)="onClick($event)"
    >
      <div
        class="gp-radiobutton-box"
        [attr.aria-checked]="isChecked()"
        [attr.aria-disabled]="disabled"
        role="radio"
        tabindex="0"
        (keydown.space)="$event.preventDefault(); onClick($event)"
        gpRipple
      >
        <div class="gp-radiobutton-icon"></div>
      </div>

      @if (label) {
        <label [for]="inputId" class="gp-radiobutton-label">{{ label }}</label>
      }
    </div>
  `,
  styles: [`
    .gp-radiobutton {
      display: inline-flex;
      align-items: center;
      cursor: pointer;
      user-select: none;
      vertical-align: middle;
      gap: 0.5rem;
    }
    .gp-radiobutton-box {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 1.25rem;
      height: 1.25rem;
      border: 2px solid var(--gp-input-border);
      border-radius: 50%;
      background: var(--gp-input-bg);
      transition: all var(--gp-transition-duration);
      outline: none;
    }
    .gp-radiobutton:hover:not(.gp-radiobutton-disabled) .gp-radiobutton-box {
      border-color: var(--gp-input-border-hover);
    }
    .gp-radiobutton-box:focus-visible {
      box-shadow: var(--gp-focus-ring);
      border-color: var(--gp-primary);
    }
    .gp-radiobutton-checked .gp-radiobutton-box {
      border-color: var(--gp-primary);
    }
    .gp-radiobutton-icon {
      width: 0.625rem;
      height: 0.625rem;
      border-radius: 50%;
      background: var(--gp-primary);
      transform: scale(0);
      transition: transform var(--gp-transition-duration) ease-in-out;
    }
    .gp-radiobutton-checked .gp-radiobutton-icon {
      transform: scale(1);
    }
    .gp-radiobutton-disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .gp-radiobutton-label {
      font-size: var(--gp-font-size-sm);
      color: var(--gp-text-color);
      cursor: inherit;
    }
    .gp-input-invalid .gp-radiobutton-box {
      border-color: var(--gp-danger);
    }
  `]
})
export class GpRadioButtonComponent implements ControlValueAccessor {
  @Input() inputId = UniqueId.generate('rb_');
  @Input() name = '';
  @Input() value: any = null;
  @Input() label = '';
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() invalid = false;

  @Output() onClickEvent = new EventEmitter<{ value: any; originalEvent: Event }>();

  protected model = signal<any>(null);

  private onChangeCallback: (value: any) => void = () => {};
  private onTouchedCallback: () => void = () => {};

  public isChecked(): boolean {
    return this.model() === this.value;
  }

  public writeValue(value: any): void {
    this.model.set(value);
  }

  public registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
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
