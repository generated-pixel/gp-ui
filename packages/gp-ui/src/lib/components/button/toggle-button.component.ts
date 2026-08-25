import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation, forwardRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { GpIconComponent } from '../../icons/icon.component';
import { GpRippleDirective } from '../../directives/ripple.directive';

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
  template: `
    <button
      type="button"
      [disabled]="disabled"
      [class.gp-toggle-button-checked]="checked()"
      [attr.aria-pressed]="checked()"
      (click)="toggle()"
      class="gp-button gp-toggle-button"
      gpRipple
    >
      @if (checked() && onIcon) {
        <gp-icon [name]="onIcon" class="gp-button-icon" />
      } @else if (!checked() && offIcon) {
        <gp-icon [name]="offIcon" class="gp-button-icon" />
      }

      <span class="gp-button-label">{{ checked() ? onLabel : offLabel }}</span>
    </button>
  `,
  styles: [`
    .gp-toggle-button {
      background: var(--gp-surface-card);
      border: 1px solid var(--gp-surface-border);
      color: var(--gp-text-color);
      transition: all var(--gp-transition-duration);
    }
    .gp-toggle-button:hover:not(:disabled) {
      background: var(--gp-surface-hover);
    }
    .gp-toggle-button-checked {
      background: var(--gp-primary) !important;
      color: var(--gp-primary-text) !important;
      border-color: var(--gp-primary) !important;
    }
  `]
})
export class GpToggleButtonComponent implements ControlValueAccessor {
  @Input() onLabel = 'Yes';
  @Input() offLabel = 'No';
  @Input() onIcon = '';
  @Input() offIcon = '';
  @Input() disabled = false;

  @Output() onChange = new EventEmitter<{ checked: boolean; originalEvent: Event }>();

  protected checked = signal<boolean>(false);

  private onChangeCallback: (value: boolean) => void = () => {};
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

  public toggle(): void {
    if (this.disabled) return;
    const next = !this.checked();
    this.checked.set(next);
    this.onChangeCallback(next);
    this.onTouchedCallback();
    this.onChange.emit({ checked: next, originalEvent: new CustomEvent('change') });
  }
}
