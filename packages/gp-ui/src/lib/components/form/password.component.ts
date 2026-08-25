import { Component, Input, ChangeDetectionStrategy, ViewEncapsulation, forwardRef, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { GpIconComponent } from '../../icons/icon.component';
import { UniqueId } from '../../utils/unique-id';

@Component({
  selector: 'gp-password',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GpPasswordComponent),
      multi: true
    }
  ],
  template: `
    <div class="gp-password-wrapper" [class.gp-input-invalid]="invalid" [class.gp-input-disabled]="disabled">
      <div class="gp-input-wrapper">
        <input
          [id]="inputId"
          [type]="showPassword() ? 'text' : 'password'"
          [value]="value()"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [readonly]="readonly"
          [attr.aria-label]="ariaLabel || placeholder || 'Password'"
          [attr.aria-invalid]="invalid"
          [attr.aria-required]="required"
          (input)="onInput($event)"
          (focus)="focused.set(true)"
          (blur)="onBlur()"
          class="gp-inputtext"
        />

        @if (toggleMask) {
          <button
            type="button"
            class="gp-password-toggle-btn"
            [attr.aria-label]="showPassword() ? 'Hide password' : 'Show password'"
            (click)="toggleShowPassword($event)"
          >
            <gp-icon [name]="showPassword() ? 'eye-slash' : 'eye'" size="1em" />
          </button>
        }
      </div>

      @if (feedback && focused() && value()) {
        <div class="gp-password-meter-panel">
          <div class="gp-password-strength-bar">
            <div
              class="gp-password-strength-fill"
              [style.width.%]="strengthScore() * 25"
              [class]="'gp-strength-' + strengthLevel()"
            ></div>
          </div>
          <div class="gp-password-strength-label">{{ strengthLabel() }}</div>
        </div>
      }
    </div>
  `,
  styles: [`
    .gp-password-wrapper {
      position: relative;
      width: 100%;
      display: inline-block;
    }
    .gp-password-toggle-btn {
      position: absolute;
      right: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      background: transparent;
      border: none;
      color: var(--gp-text-color-muted);
      cursor: pointer;
      padding: 0.2rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .gp-password-toggle-btn:hover {
      color: var(--gp-text-color);
    }
    .gp-password-meter-panel {
      position: absolute;
      top: 100%;
      left: 0;
      width: 100%;
      margin-top: 4px;
      padding: 0.5rem 0.75rem;
      background: var(--gp-surface-overlay);
      border: 1px solid var(--gp-surface-border);
      border-radius: var(--gp-border-radius);
      box-shadow: var(--gp-shadow-md);
      z-index: 1000;
      animation: gp-slide-down 0.15s ease-out;
    }
    .gp-password-strength-bar {
      height: 6px;
      background: var(--gp-surface-hover);
      border-radius: 3px;
      overflow: hidden;
    }
    .gp-password-strength-fill {
      height: 100%;
      transition: width 0.3s ease, background 0.3s ease;
    }
    .gp-strength-weak { background: var(--gp-danger); }
    .gp-strength-medium { background: var(--gp-warning); }
    .gp-strength-strong { background: var(--gp-info); }
    .gp-strength-very-strong { background: var(--gp-success); }
    .gp-password-strength-label {
      font-size: var(--gp-font-size-xs);
      color: var(--gp-text-color-secondary);
      margin-top: 0.25rem;
      text-align: right;
    }
  `]
})
export class GpPasswordComponent implements ControlValueAccessor {
  @Input() inputId = UniqueId.generate('password_');
  @Input() placeholder = '';
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() required = false;
  @Input() invalid = false;
  @Input() toggleMask = true;
  @Input() feedback = true;
  @Input() ariaLabel = '';

  protected value = signal<string>('');
  protected showPassword = signal<boolean>(false);
  protected focused = signal<boolean>(false);

  private onChangeCallback: (value: any) => void = () => {};
  private onTouchedCallback: () => void = () => {};

  protected strengthScore = computed(() => {
    const val = this.value();
    if (!val) return 0;
    let score = 0;
    if (val.length >= 8) score++;
    if (/[a-z]/.test(val) && /[A-Z]/.test(val)) score++;
    if (/\d/.test(val)) score++;
    if (/[^a-zA-Z\d]/.test(val)) score++;
    return score;
  });

  protected strengthLevel = computed(() => {
    const s = this.strengthScore();
    if (s <= 1) return 'weak';
    if (s === 2) return 'medium';
    if (s === 3) return 'strong';
    return 'very-strong';
  });

  protected strengthLabel = computed(() => {
    const s = this.strengthScore();
    if (s <= 1) return 'Weak password';
    if (s === 2) return 'Medium strength';
    if (s === 3) return 'Strong password';
    return 'Very strong password';
  });

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
  }

  protected onBlur(): void {
    this.focused.set(false);
    this.onTouchedCallback();
  }

  protected toggleShowPassword(event: MouseEvent): void {
    event.preventDefault();
    this.showPassword.update(v => !v);
  }
}
