import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation, forwardRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { GpIconComponent } from '../../icons/icon.component';

@Component({
  selector: 'gp-rating',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GpRatingComponent),
      multi: true
    }
  ],
  template: `
    <div
      class="gp-rating"
      [class.gp-rating-readonly]="readonly"
      [class.gp-rating-disabled]="disabled"
      role="radiogroup"
      [attr.aria-label]="ariaLabel || 'Rating'"
    >
      @if (cancel && !readonly && !disabled) {
        <button
          type="button"
          class="gp-rating-cancel"
          (click)="clear()"
          aria-label="Clear rating"
        >
          <gp-icon name="times-circle" size="1.1em" />
        </button>
      }

      @for (star of starsArray; track $index) {
        <span
          class="gp-rating-item"
          [class.gp-rating-item-active]="$index < (value() || 0)"
          (click)="rate($index + 1)"
          (keydown.space)="$event.preventDefault(); rate($index + 1)"
          tabindex="0"
          role="radio"
          [attr.aria-checked]="$index + 1 === value()"
          [attr.aria-label]="($index + 1) + ' stars'"
        >
          <gp-icon [name]="$index < (value() || 0) ? onIcon : offIcon" size="1.25em" />
        </span>
      }
    </div>
  `,
  styles: [`
    .gp-rating {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      user-select: none;
    }
    .gp-rating-item {
      cursor: pointer;
      color: var(--gp-text-color-muted);
      transition: transform 0.15s, color 0.15s;
      outline: none;
      display: inline-flex;
    }
    .gp-rating-item:hover:not(.gp-rating-readonly):not(.gp-rating-disabled) {
      transform: scale(1.15);
      color: var(--gp-warning);
    }
    .gp-rating-item:focus-visible {
      box-shadow: var(--gp-focus-ring);
      border-radius: var(--gp-border-radius-sm);
    }
    .gp-rating-item-active {
      color: var(--gp-warning);
    }
    .gp-rating-cancel {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--gp-danger);
      padding: 0;
      display: inline-flex;
    }
    .gp-rating-readonly .gp-rating-item,
    .gp-rating-disabled .gp-rating-item {
      cursor: default;
    }
    .gp-rating-disabled {
      opacity: 0.6;
    }
  `]
})
export class GpRatingComponent implements ControlValueAccessor {
  @Input() stars = 5;
  @Input() readonly = false;
  @Input() disabled = false;
  @Input() cancel = true;
  @Input() onIcon = 'star-fill';
  @Input() offIcon = 'star';
  @Input() ariaLabel = '';

  @Output() onRate = new EventEmitter<{ value: number }>();
  @Output() onCancel = new EventEmitter<void>();

  protected value = signal<number | null>(null);

  protected get starsArray(): number[] {
    return Array.from({ length: this.stars });
  }

  private onChangeCallback: (value: any) => void = () => {};
  private onTouchedCallback: () => void = () => {};

  public writeValue(value: any): void {
    this.value.set(value != null ? Number(value) : null);
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

  public rate(star: number): void {
    if (this.readonly || this.disabled) return;
    this.value.set(star);
    this.onChangeCallback(star);
    this.onTouchedCallback();
    this.onRate.emit({ value: star });
  }

  public clear(): void {
    if (this.readonly || this.disabled) return;
    this.value.set(null);
    this.onChangeCallback(null);
    this.onTouchedCallback();
    this.onCancel.emit();
  }
}
