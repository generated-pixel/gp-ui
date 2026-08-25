import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation, forwardRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { UniqueId } from '../../utils/unique-id';

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
  template: `
    <div
      class="gp-switch"
      [class.gp-switch-checked]="checked()"
      [class.gp-switch-disabled]="disabled"
      [class.gp-input-invalid]="invalid"
      (click)="toggle($event)"
    >
      <div
        class="gp-switch-slider"
        role="switch"
        [attr.aria-checked]="checked()"
        [attr.aria-disabled]="disabled"
        [attr.aria-label]="ariaLabel || null"
        tabindex="0"
        (keydown.space)="$event.preventDefault(); toggle($event)"
      >
        <span class="gp-switch-handle"></span>
      </div>

      @if (label) {
        <span class="gp-switch-label">{{ label }}</span>
      }
    </div>
  `,
  styles: [`
    .gp-switch {
      display: inline-flex;
      align-items: center;
      cursor: pointer;
      user-select: none;
      vertical-align: middle;
      gap: 0.5rem;
    }
    .gp-switch-slider {
      position: relative;
      width: 2.75rem;
      height: 1.5rem;
      background: var(--gp-input-border);
      border-radius: var(--gp-border-radius-full);
      transition: background var(--gp-transition-duration);
      outline: none;
    }
    .gp-switch-slider:focus-visible {
      box-shadow: var(--gp-focus-ring);
    }
    .gp-switch-handle {
      position: absolute;
      top: 2px;
      left: 2px;
      width: calc(1.5rem - 4px);
      height: calc(1.5rem - 4px);
      background: #ffffff;
      border-radius: 50%;
      box-shadow: var(--gp-shadow-sm);
      transition: transform var(--gp-transition-duration) cubic-bezier(0.4, 0, 0.2, 1);
    }
    .gp-switch-checked .gp-switch-slider {
      background: var(--gp-primary);
    }
    .gp-switch-checked .gp-switch-handle {
      transform: translateX(1.25rem);
    }
    .gp-switch-disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .gp-switch-label {
      font-size: var(--gp-font-size-sm);
      color: var(--gp-text-color);
    }
  `]
})
export class GpSwitchComponent implements ControlValueAccessor {
  @Input() inputId = UniqueId.generate('switch_');
  @Input() label = '';
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() invalid = false;
  @Input() ariaLabel = '';

  @Output() onChange = new EventEmitter<{ checked: boolean; originalEvent: Event }>();

  protected checked = signal<boolean>(false);

  private onChangeCallback: (value: any) => void = () => {};
  private onTouchedCallback: () => void = () => {};

  public writeValue(value: any): void {
    this.checked.set(!!value);
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

  public toggle(event: Event): void {
    if (this.disabled || this.readonly) return;
    const next = !this.checked();
    this.checked.set(next);
    this.onChangeCallback(next);
    this.onTouchedCallback();
    this.onChange.emit({ checked: next, originalEvent: event });
  }
}
