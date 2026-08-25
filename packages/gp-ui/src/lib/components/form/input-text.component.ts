import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation, forwardRef, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { GpIconComponent } from '../../icons/icon.component';
import { UniqueId } from '../../utils/unique-id';

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
  template: `
    <div
      class="gp-input-wrapper"
      [class.gp-input-disabled]="disabled"
      [class.gp-input-filled]="!!value()"
      [class.gp-input-invalid]="invalid"
      [class.gp-input-with-prefix]="!!iconLeft"
      [class.gp-input-with-suffix]="!!iconRight || (clearable && !!value())"
    >
      @if (iconLeft) {
        <gp-icon [name]="iconLeft" class="gp-input-icon gp-input-icon-left" />
      }

      <input
        [id]="inputId"
        [type]="type"
        [value]="value()"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [readonly]="readonly"
        [attr.maxlength]="maxlength || null"
        [attr.aria-label]="ariaLabel || placeholder || null"
        [attr.aria-invalid]="invalid"
        [attr.aria-required]="required"
        (input)="onInput($event)"
        (focus)="onFocus($event)"
        (blur)="onBlur($event)"
        class="gp-inputtext"
      />

      @if (clearable && !!value() && !disabled && !readonly) {
        <button
          type="button"
          class="gp-input-clear-btn"
          aria-label="Clear input"
          (click)="clear($event)"
        >
          <gp-icon name="times" size="0.9em" />
        </button>
      } @else if (iconRight) {
        <gp-icon [name]="iconRight" class="gp-input-icon gp-input-icon-right" />
      }
    </div>
  `,
  styles: [`
    .gp-input-wrapper {
      display: inline-flex;
      align-items: center;
      position: relative;
      width: 100%;
    }
    .gp-inputtext {
      width: 100%;
      font-family: inherit;
      font-size: var(--gp-font-size-sm);
      color: var(--gp-text-color);
      background: var(--gp-input-bg);
      border: 1px solid var(--gp-input-border);
      border-radius: var(--gp-border-radius);
      padding: var(--gp-input-padding-y) var(--gp-input-padding-x);
      height: var(--gp-input-height);
      transition: border-color var(--gp-transition-duration), box-shadow var(--gp-transition-duration);
      outline: none;
    }
    .gp-inputtext:hover:not(:disabled):not([readonly]) {
      border-color: var(--gp-input-border-hover);
    }
    .gp-inputtext:focus-visible {
      border-color: var(--gp-input-border-focus);
      box-shadow: var(--gp-focus-ring);
    }
    .gp-input-disabled .gp-inputtext {
      opacity: 0.6;
      cursor: not-allowed;
      background: var(--gp-surface-ground);
    }
    .gp-input-invalid .gp-inputtext {
      border-color: var(--gp-danger);
    }
    .gp-input-invalid .gp-inputtext:focus-visible {
      box-shadow: var(--gp-focus-ring-danger);
    }
    .gp-input-icon {
      position: absolute;
      color: var(--gp-text-color-muted);
      pointer-events: none;
      z-index: 1;
    }
    .gp-input-icon-left {
      left: 0.75rem;
    }
    .gp-input-icon-right {
      right: 0.75rem;
    }
    .gp-input-with-prefix .gp-inputtext {
      padding-left: 2.25rem;
    }
    .gp-input-with-suffix .gp-inputtext {
      padding-right: 2.25rem;
    }
    .gp-input-clear-btn {
      position: absolute;
      right: 0.75rem;
      background: transparent;
      border: none;
      color: var(--gp-text-color-muted);
      cursor: pointer;
      padding: 0.2rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
    }
    .gp-input-clear-btn:hover {
      color: var(--gp-text-color);
    }
  `]
})
export class GpInputTextComponent implements ControlValueAccessor {
  @Input() inputId = UniqueId.generate('input_');
  @Input() type = 'text';
  @Input() placeholder = '';
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() required = false;
  @Input() invalid = false;
  @Input() clearable = false;
  @Input() iconLeft = '';
  @Input() iconRight = '';
  @Input() maxlength?: number;
  @Input() ariaLabel = '';

  @Output() onInputEvent = new EventEmitter<Event>();
  @Output() onFocusEvent = new EventEmitter<FocusEvent>();
  @Output() onBlurEvent = new EventEmitter<FocusEvent>();
  @Output() onClearEvent = new EventEmitter<void>();

  protected value = signal<string>('');

  private onChangeCallback: (value: any) => void = () => {};
  private onTouchedCallback: () => void = () => {};

  public writeValue(value: any): void {
    this.value.set(value != null ? String(value) : '');
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

  protected onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.value.set(input.value);
    this.onChangeCallback(input.value);
    this.onInputEvent.emit(event);
  }

  protected onFocus(event: FocusEvent): void {
    this.onFocusEvent.emit(event);
  }

  protected onBlur(event: FocusEvent): void {
    this.onTouchedCallback();
    this.onBlurEvent.emit(event);
  }

  protected clear(event: MouseEvent): void {
    event.stopPropagation();
    this.value.set('');
    this.onChangeCallback('');
    this.onClearEvent.emit();
  }
}
