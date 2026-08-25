import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation, forwardRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { GpIconComponent } from '../../icons/icon.component';
import { UniqueId } from '../../utils/unique-id';
import { GpRippleDirective } from '../../directives/ripple.directive';

@Component({
  selector: 'gp-checkbox',
  standalone: true,
  imports: [CommonModule, GpIconComponent, GpRippleDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GpCheckboxComponent),
      multi: true
    }
  ],
  template: `
    <div
      class="gp-checkbox"
      [class.gp-checkbox-checked]="isChecked()"
      [class.gp-checkbox-disabled]="disabled"
      [class.gp-input-invalid]="invalid"
      (click)="onClick($event)"
    >
      <div
        class="gp-checkbox-box"
        [attr.aria-checked]="isChecked()"
        [attr.aria-disabled]="disabled"
        role="checkbox"
        tabindex="0"
        (keydown.space)="$event.preventDefault(); onClick($event)"
        gpRipple
      >
        @if (isChecked()) {
          <gp-icon name="check" size="0.8em" class="gp-checkbox-icon" />
        }
      </div>

      @if (label) {
        <label [for]="inputId" class="gp-checkbox-label">{{ label }}</label>
      }
    </div>
  `,
  styles: [`
    .gp-checkbox {
      display: inline-flex;
      align-items: center;
      cursor: pointer;
      user-select: none;
      vertical-align: middle;
      gap: 0.5rem;
    }
    .gp-checkbox-box {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 1.25rem;
      height: 1.25rem;
      border: 2px solid var(--gp-input-border);
      border-radius: var(--gp-border-radius-sm);
      background: var(--gp-input-bg);
      transition: all var(--gp-transition-duration);
      outline: none;
    }
    .gp-checkbox:hover:not(.gp-checkbox-disabled) .gp-checkbox-box {
      border-color: var(--gp-input-border-hover);
    }
    .gp-checkbox-box:focus-visible {
      box-shadow: var(--gp-focus-ring);
      border-color: var(--gp-primary);
    }
    .gp-checkbox-checked .gp-checkbox-box {
      background: var(--gp-primary);
      border-color: var(--gp-primary);
      color: var(--gp-primary-text);
    }
    .gp-checkbox-disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .gp-checkbox-label {
      font-size: var(--gp-font-size-sm);
      color: var(--gp-text-color);
      cursor: inherit;
    }
    .gp-input-invalid .gp-checkbox-box {
      border-color: var(--gp-danger);
    }
  `]
})
export class GpCheckboxComponent implements ControlValueAccessor {
  @Input() inputId = UniqueId.generate('chk_');
  @Input() label = '';
  @Input() value: any = null;
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() invalid = false;
  @Input() binary = true;

  @Output() onChange = new EventEmitter<{ checked: boolean; value: any; originalEvent: Event }>();

  protected model = signal<any>(false);

  private onChangeCallback: (value: any) => void = () => {};
  private onTouchedCallback: () => void = () => {};

  public isChecked(): boolean {
    const val = this.model();
    if (this.binary) {
      return !!val;
    }
    if (Array.isArray(val)) {
      return val.includes(this.value);
    }
    return val === this.value;
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
    if (this.disabled || this.readonly) return;

    let nextValue: any;
    if (this.binary) {
      nextValue = !this.isChecked();
    } else {
      const current = this.model();
      if (Array.isArray(current)) {
        if (this.isChecked()) {
          nextValue = current.filter(item => item !== this.value);
        } else {
          nextValue = [...current, this.value];
        }
      } else {
        nextValue = this.isChecked() ? null : this.value;
      }
    }

    this.model.set(nextValue);
    this.onChangeCallback(nextValue);
    this.onTouchedCallback();
    this.onChange.emit({ checked: this.isChecked(), value: nextValue, originalEvent: event });
  }
}
