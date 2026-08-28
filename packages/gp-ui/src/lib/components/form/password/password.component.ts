import { GpEditableBaseComponent } from '../../../base/gp-editable-base.component';
import {
  Component,
  input,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  forwardRef,
  signal,
  computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { GpIconComponent } from '../../../icons/icon.component';
import { UniqueId } from '../../../utils/unique-id';

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
  templateUrl: './password.component.html',
  styleUrl: './password.component.scss'
})
export class GpPasswordComponent extends GpEditableBaseComponent implements ControlValueAccessor {
  public inputId = input<string>(UniqueId.generate('password_'));
  public toggleMask = input<boolean>(true);
  public feedback = input<boolean>(true);

  protected showPassword = signal<boolean>(false);
  protected focused = signal<boolean>(false);

  protected strengthScore = computed(() => {
    const val = this.internalValue() as string;
    if (!val) {
      return 0;
    }
    let score = 0;
    if (val.length >= 8) {
      score++;
    }
    if (/[a-z]/.test(val) && /[A-Z]/.test(val)) {
      score++;
    }
    if (/\d/.test(val)) {
      score++;
    }
    if (/[^a-zA-Z\d]/.test(val)) {
      score++;
    }
    return score;
  });

  protected strengthLevel = computed(() => {
    const s = this.strengthScore();
    if (s <= 1) {
      return 'weak';
    }
    if (s === 2) {
      return 'medium';
    }
    if (s === 3) {
      return 'strong';
    }
    return 'very-strong';
  });

  protected strengthLabel = computed(() => {
    const s = this.strengthScore();
    if (s <= 1) {
      return 'Weak password';
    }
    if (s === 2) {
      return 'Medium strength';
    }
    if (s === 3) {
      return 'Strong password';
    }
    return 'Very strong password';
  });

  public override writeValue(value: any): void {
    const str = value != null ? String(value) : '';
    this.internalValue.set(str);
  }

  public override registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  public override registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  protected onInput(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    this.updateValue(inputEl.value);
  }

  protected onBlur(): void {
    this.focused.set(false);
    this.handleControlBlur();
  }

  protected toggleShowPassword(event: MouseEvent): void {
    event.preventDefault();
    this.showPassword.update((v) => !v);
  }
}
