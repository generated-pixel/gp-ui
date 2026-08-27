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
  @Input() set max(value: number) {
    if (value != null && value > 0) {
      this.stars = value;
    }
  }
  get max(): number {
    return this.stars;
  }
  @Input() allowHalfStars = false;
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
    this.internalValue.set(Number.isFinite(val) ? val : null);
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

  public isStarActive(index: number): boolean {
    const value = this.internalValue() ?? 0;
    return value >= index + 1;
  }

  public isStarHalf(index: number): boolean {
    if (!this.allowHalfStars) return false;
    const value = this.internalValue() ?? 0;
    return value > index && value < index + 1;
  }

  public getStarFillWidth(index: number): number {
    const value = this.internalValue() ?? 0;
    if (value >= index + 1) return 100;
    if (this.allowHalfStars && value > index && value < index + 1) return 50;
    return 0;
  }

  public rate(star: number, event?: MouseEvent | Event): void {
    if (this.readonly || this.disabled) return;

    const nextValue = this.allowHalfStars && event instanceof MouseEvent && event.currentTarget
      ? this.resolveHalfValue(star, event)
      : star;

    this.updateValue(nextValue);
    this.handleControlBlur();
    this.onRate.emit({ value: nextValue });
  }

  public clear(): void {
    if (this.readonly || this.disabled) return;
    this.updateValue(null);
    this.handleControlBlur();
    this.onCancel.emit();
  }

  private resolveHalfValue(star: number, event: MouseEvent): number {
    const target = event.currentTarget as HTMLElement | null;
    if (!target) return star;

    const rect = target.getBoundingClientRect();
    const relativeX = event.clientX - rect.left;
    const ratio = rect.width === 0 ? 0 : relativeX / rect.width;

    return ratio < 0.5 ? star - 0.5 : star;
  }
}
