import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation, forwardRef, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { GpIconComponent } from '../../icons/icon.component';
import { UniqueId } from '../../utils/unique-id';

@Component({
  selector: 'gp-input-number',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GpInputNumberComponent),
      multi: true
    }
  ],
  template: `
    <div
      class="gp-input-number"
      [class.gp-input-disabled]="disabled"
      [class.gp-input-invalid]="invalid"
      [class.gp-input-number-buttons-stacked]="showButtons && buttonLayout === 'stacked'"
      [class.gp-input-number-buttons-horizontal]="showButtons && buttonLayout === 'horizontal'"
    >
      @if (showButtons && buttonLayout === 'horizontal') {
        <button
          type="button"
          class="gp-input-number-btn gp-input-number-btn-down"
          [disabled]="disabled || (min !== undefined && (value() || 0) <= min)"
          (click)="spin(-step)"
          aria-label="Decrease value"
        >
          <gp-icon [name]="decrementButtonIcon" size="0.85em" />
        </button>
      }

      <div class="gp-input-number-input-wrap">
        @if (prefix) {
          <span class="gp-input-number-prefix">{{ prefix }}</span>
        }
        <input
          [id]="inputId"
          type="text"
          [value]="displayValue()"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [readonly]="readonly"
          [attr.aria-label]="ariaLabel || placeholder || null"
          [attr.aria-invalid]="invalid"
          [attr.aria-required]="required"
          [attr.aria-valuenow]="value()"
          [attr.aria-valuemin]="min"
          [attr.aria-valuemax]="max"
          role="spinbutton"
          (input)="onInput($event)"
          (blur)="onBlur()"
          (keydown)="onKeyDown($event)"
          class="gp-inputtext gp-input-number-input"
        />
        @if (suffix) {
          <span class="gp-input-number-suffix">{{ suffix }}</span>
        }
      </div>

      @if (showButtons && buttonLayout === 'stacked') {
        <div class="gp-input-number-btn-stack">
          <button
            type="button"
            class="gp-input-number-btn gp-input-number-btn-up"
            [disabled]="disabled || (max !== undefined && (value() || 0) >= max)"
            (click)="spin(step)"
            aria-label="Increase value"
          >
            <gp-icon [name]="incrementButtonIcon" size="0.7em" />
          </button>
          <button
            type="button"
            class="gp-input-number-btn gp-input-number-btn-down"
            [disabled]="disabled || (min !== undefined && (value() || 0) <= min)"
            (click)="spin(-step)"
            aria-label="Decrease value"
          >
            <gp-icon [name]="decrementButtonIcon" size="0.7em" />
          </button>
        </div>
      }

      @if (showButtons && buttonLayout === 'horizontal') {
        <button
          type="button"
          class="gp-input-number-btn gp-input-number-btn-up"
          [disabled]="disabled || (max !== undefined && (value() || 0) >= max)"
          (click)="spin(step)"
          aria-label="Increase value"
        >
          <gp-icon [name]="incrementButtonIcon" size="0.85em" />
        </button>
      }
    </div>
  `,
  styles: [`
    .gp-input-number {
      display: inline-flex;
      position: relative;
      width: 100%;
    }
    .gp-input-number-input-wrap {
      display: flex;
      align-items: center;
      position: relative;
      width: 100%;
    }
    .gp-input-number-input {
      width: 100%;
    }
    .gp-input-number-prefix, .gp-input-number-suffix {
      position: absolute;
      color: var(--gp-text-color-secondary);
      font-size: var(--gp-font-size-sm);
      pointer-events: none;
    }
    .gp-input-number-prefix {
      left: 0.75rem;
    }
    .gp-input-number-suffix {
      right: 0.75rem;
    }
    .gp-input-number-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: var(--gp-surface-section);
      border: 1px solid var(--gp-input-border);
      color: var(--gp-text-color);
      cursor: pointer;
      transition: background var(--gp-transition-duration);
      padding: 0;
    }
    .gp-input-number-btn:hover:not(:disabled) {
      background: var(--gp-surface-hover);
    }
    .gp-input-number-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .gp-input-number-buttons-stacked .gp-input-number-input {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
    .gp-input-number-btn-stack {
      display: flex;
      flex-direction: column;
      width: 1.75rem;
    }
    .gp-input-number-btn-stack .gp-input-number-btn-up {
      height: 50%;
      border-left: none;
      border-top-right-radius: var(--gp-border-radius);
    }
    .gp-input-number-btn-stack .gp-input-number-btn-down {
      height: 50%;
      border-left: none;
      border-top: none;
      border-bottom-right-radius: var(--gp-border-radius);
    }
    .gp-input-number-buttons-horizontal .gp-input-number-input {
      border-radius: 0;
      text-align: center;
    }
    .gp-input-number-buttons-horizontal .gp-input-number-btn-down {
      border-right: none;
      border-top-left-radius: var(--gp-border-radius);
      border-bottom-left-radius: var(--gp-border-radius);
      width: 2.25rem;
    }
    .gp-input-number-buttons-horizontal .gp-input-number-btn-up {
      border-left: none;
      border-top-right-radius: var(--gp-border-radius);
      border-bottom-right-radius: var(--gp-border-radius);
      width: 2.25rem;
    }
  `]
})
export class GpInputNumberComponent implements ControlValueAccessor {
  @Input() inputId = UniqueId.generate('num_');
  @Input() min?: number;
  @Input() max?: number;
  @Input() step = 1;
  @Input() showButtons = true;
  @Input() buttonLayout: 'stacked' | 'horizontal' = 'stacked';
  @Input() incrementButtonIcon = 'chevron-up';
  @Input() decrementButtonIcon = 'chevron-down';
  @Input() prefix = '';
  @Input() suffix = '';
  @Input() placeholder = '';
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() required = false;
  @Input() invalid = false;
  @Input() ariaLabel = '';

  @Output() onValueChange = new EventEmitter<number | null>();

  protected value = signal<number | null>(null);

  protected displayValue = computed(() => {
    const val = this.value();
    if (val === null || val === undefined) return '';
    return String(val);
  });

  private onChangeCallback: (value: any) => void = () => {};
  private onTouchedCallback: () => void = () => {};

  public writeValue(value: any): void {
    const num = value !== null && value !== undefined && value !== '' ? Number(value) : null;
    this.value.set(num);
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

  public spin(delta: number): void {
    if (this.disabled || this.readonly) return;
    let current = this.value() ?? 0;
    let next = current + delta;
    if (this.min !== undefined && next < this.min) next = this.min;
    if (this.max !== undefined && next > this.max) next = this.max;

    this.value.set(next);
    this.onChangeCallback(next);
    this.onValueChange.emit(next);
  }

  protected onInput(event: Event): void {
    const text = (event.target as HTMLInputElement).value;
    if (text === '') {
      this.value.set(null);
      this.onChangeCallback(null);
      this.onValueChange.emit(null);
      return;
    }
    const num = parseFloat(text);
    if (!isNaN(num)) {
      this.value.set(num);
      this.onChangeCallback(num);
      this.onValueChange.emit(num);
    }
  }

  protected onBlur(): void {
    this.onTouchedCallback();
    let current = this.value();
    if (current !== null) {
      if (this.min !== undefined && current < this.min) current = this.min;
      if (this.max !== undefined && current > this.max) current = this.max;
      this.value.set(current);
      this.onChangeCallback(current);
    }
  }

  protected onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'ArrowUp') {
      this.spin(this.step);
      event.preventDefault();
    } else if (event.key === 'ArrowDown') {
      this.spin(-this.step);
      event.preventDefault();
    }
  }
}
