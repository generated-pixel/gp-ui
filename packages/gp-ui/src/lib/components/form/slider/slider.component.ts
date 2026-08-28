import { GpEditableBaseComponent } from '../../../base/gp-editable-base.component';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation, forwardRef, computed, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { UniqueId } from '../../../utils/unique-id';

@Component({
  selector: 'gp-slider',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GpSliderComponent),
      multi: true
    }
  ],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.scss'
})
export class GpSliderComponent extends GpEditableBaseComponent implements ControlValueAccessor {
  @Input() min = 0;
  @Input() max = 100;
  @Input() step = 1;
  @Input() override disabled = false;

  @Output() onChange = new EventEmitter<{ value: number; originalEvent: Event }>();

  private dragging = false;

  constructor(private el: ElementRef) {
    super();
  }

  protected percentage = computed(() => {
    const val = Number(this.internalValue()) || 0;
    const range = this.max - this.min;
    if (range <= 0) return 0;
    return Math.min(100, Math.max(0, ((val - this.min) / range) * 100));
  });

  public override writeValue(value: any): void {
    const num = value != null ? Number(value) : this.min;
    this.value = num;
    this.internalValue.set(num);
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

  protected onBarMouseDown(event: MouseEvent): void {
    if (this.disabled) return;
    this.dragging = true;
    this.updateValueFromPosition(event.clientX);
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.dragging && !this.disabled) {
      this.updateValueFromPosition(event.clientX);
    }
  }

  @HostListener('document:mouseup')
  onMouseUp(): void {
    if (this.dragging) {
      this.dragging = false;
      this.handleControlBlur();
    }
  }

  private updateValueFromPosition(clientX: number): void {
    const sliderEl = this.el.nativeElement.querySelector('.gp-slider');
    if (!sliderEl) return;
    const rect = sliderEl.getBoundingClientRect();
    const pos = (clientX - rect.left) / rect.width;
    const clampedPos = Math.min(1, Math.max(0, pos));
    let rawValue = this.min + clampedPos * (this.max - this.min);

    // Step rounding
    if (this.step) {
      rawValue = Math.round((rawValue - this.min) / this.step) * this.step + this.min;
    }

    const finalVal = Math.min(this.max, Math.max(this.min, rawValue));
    this.updateValue(finalVal);
    this.onChange.emit({ value: finalVal, originalEvent: new CustomEvent('change') });
  }

  protected onKeyDown(event: KeyboardEvent): void {
    if (this.disabled) return;
    const current = Number(this.internalValue()) || 0;
    let next = current;
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      next = Math.min(this.max, next + this.step);
      event.preventDefault();
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      next = Math.max(this.min, next - this.step);
      event.preventDefault();
    }
    if (next !== current) {
      this.updateValue(next);
      this.onChange.emit({ value: next, originalEvent: event });
    }
  }
}
