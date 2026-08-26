import { GpEditableBaseComponent } from '../../base/gp-editable-base.component';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation, forwardRef } from '@angular/core';
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

  protected get starsArray(): number[] {
    return Array.from({ length: this.stars });
  }

  public override writeValue(value: any): void {
    const val = value != null ? Number(value) : null;
    this.value = val;
    this.internalValue.set(val);
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
    this.updateValue(star);
    this.handleControlBlur();
    this.onRate.emit({ value: star });
  }

  public clear(): void {
    if (this.readonly || this.disabled) return;
    this.updateValue(null);
    this.handleControlBlur();
    this.onCancel.emit();
  }
}
