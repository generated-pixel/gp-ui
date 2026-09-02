import {
  Component,
  input,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  forwardRef,
  signal,
  computed
} from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { GpIconComponent } from '../../../icons/icon.component';
import { GpInputBaseComponent } from '../../../base/gp-input-base.component';

@Component({
  selector: 'gp-password',
  standalone: true,
  imports: [GpIconComponent],
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
export class GpPasswordComponent extends GpInputBaseComponent<string> implements ControlValueAccessor {
  public toggleMask = input<boolean>(true);
  public feedback = input<boolean>(true);

  public showPassword = signal<boolean>(false);
  public focused = signal<boolean>(false);

  public strengthScore = computed(() => {
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

  public strengthLevel = computed(() => {
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

  public strengthLabel = computed(() => {
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

  public override handleFocus(event: FocusEvent): void {
    this.focused.set(true);
    super.handleFocus(event);
  }

  public override handleBlur(event: FocusEvent): void {
    this.focused.set(false);
    super.handleBlur(event);
  }

  public toggleShowPassword(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.showPassword.update((v) => !v);
  }
}
