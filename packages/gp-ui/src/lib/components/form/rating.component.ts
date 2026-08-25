import { GpEditableBaseComponent } from '../../base/gp-editable-base.component';
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
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.scss'
})
export class GpRatingComponent extends GpEditableBaseComponent implements ControlValueAccessor {
  @Input() stars = 5;
  @Input() override readonly = false;
  @Input() override disabled = false;
  @Input() cancel = true;
  @Input() onIcon = 'star-fill';
  @Input() offIcon = 'star';
  @Input() override ariaLabel = '';

  @Output() onRate = new EventEmitter<{ value: number }>();
  @Output() onCancel = new EventEmitter<void>();

  public override value = signal<number | null>(null);

  protected get starsArray(): number[] {
    return Array.from({ length: this.stars });
  }

  // Inherited onChangeCallback
  // Inherited onTouchedCallback

  public override writeValue(value: any): void {
    this.value.set(value != null ? Number(value) : null);
  }

  public override registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  public override registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  public override setDisabledState(isDisabled: boolean): void {
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
