import { GpEditableBase } from '../../../base/gp-editable-base';
import {
  Component,
  input,
  output,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  forwardRef,
  computed,
  ElementRef,
  HostListener,
  signal
} from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'gp-slider',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GpSlider),
      multi: true
    }
  ],
  templateUrl: './slider.html',
  styleUrl: './slider.scss'
})
export class GpSlider extends GpEditableBase implements ControlValueAccessor {
  public min = input<number>(0);
  public max = input<number>(100);
  public step = input<number>(1);
  public orientation = input<'horizontal' | 'vertical'>('horizontal');

  public onChange = output<{ value: number; originalEvent: Event }>();
  public onSlideEnd = output<{ value: number; originalEvent: Event }>();

  public isDragging = signal<boolean>(false);
  private activePointerId: number | null = null;

  constructor(private el: ElementRef) {
    super();
  }

  public override onInit(): void {
    super.onInit();
    if (this.internalValue() === null || this.internalValue() === undefined) {
      this.internalValue.set(this.min());
    }
  }

  protected percentage = computed(() => {
    const raw = this.internalValue();
    const val = raw !== null && raw !== undefined ? Number(raw) : this.min();
    const minVal = this.min();
    const maxVal = this.max();
    const range = maxVal - minVal;
    if (range <= 0) {
      return 0;
    }
    return Math.min(100, Math.max(0, ((val - minVal) / range) * 100));
  });

  protected displayValue = computed(() => {
    const raw = this.internalValue();
    return raw !== null && raw !== undefined ? Number(raw) : this.min();
  });

  public override writeValue(value: any): void {
    const num = value != null && value !== '' ? Number(value) : this.min();
    this.internalValue.set(num);
  }

  protected onPointerDown(event: PointerEvent): void {
    if (this.isEffectivelyDisabled() || this.readonly() || event.button !== 0) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();

    this.isDragging.set(true);
    this.activePointerId = event.pointerId;

    const targetEl = event.currentTarget as HTMLElement;
    if (targetEl && targetEl.setPointerCapture) {
      targetEl.setPointerCapture(event.pointerId);
    }

    this.updateValueFromPosition(event.clientX, event.clientY, event);
  }

  protected onPointerMove(event: PointerEvent): void {
    if (this.isDragging() && !this.isEffectivelyDisabled() && !this.readonly()) {
      event.preventDefault();
      this.updateValueFromPosition(event.clientX, event.clientY, event);
    }
  }

  protected onPointerUp(event: PointerEvent): void {
    if (this.isDragging()) {
      this.isDragging.set(false);
      const targetEl = event.currentTarget as HTMLElement;
      if (targetEl && targetEl.releasePointerCapture && this.activePointerId !== null) {
        try {
          targetEl.releasePointerCapture(this.activePointerId);
        } catch (_) {}
      }
      this.activePointerId = null;
      this.handleControlBlur();

      const finalVal = this.displayValue();
      this.onSlideEnd.emit({ value: finalVal, originalEvent: event });
    }
  }

  @HostListener('document:pointerup')
  onDocumentPointerUp(): void {
    if (this.isDragging()) {
      this.isDragging.set(false);
      this.activePointerId = null;
      this.handleControlBlur();
    }
  }

  private updateValueFromPosition(clientX: number, clientY: number, originalEvent: Event): void {
    const trackEl =
      this.el.nativeElement.querySelector('.gp-slider-track') || this.el.nativeElement.querySelector('.gp-slider');
    if (!trackEl) {
      return;
    }
    const minVal = this.min();
    const maxVal = this.max();
    const stepVal = this.step() || 1;
    const rect = trackEl.getBoundingClientRect();

    let pos = 0;
    if (this.orientation() === 'vertical') {
      if (rect.height <= 0) {
        return;
      }
      pos = (rect.bottom - clientY) / rect.height;
    } else {
      if (rect.width <= 0) {
        return;
      }
      pos = (clientX - rect.left) / rect.width;
    }

    const clampedPos = Math.min(1, Math.max(0, pos));
    let rawValue = minVal + clampedPos * (maxVal - minVal);

    if (stepVal > 0) {
      const stepsCount = Math.round((rawValue - minVal) / stepVal);
      const decimals = (String(stepVal).split('.')[1] || '').length;
      rawValue = Number((minVal + stepsCount * stepVal).toFixed(decimals));
    }

    const finalVal = Math.min(maxVal, Math.max(minVal, rawValue));
    if (finalVal !== this.internalValue()) {
      this.updateValue(finalVal);
      this.onChange.emit({ value: finalVal, originalEvent });
    }
  }

  protected onKeyDown(event: KeyboardEvent): void {
    if (this.isEffectivelyDisabled() || this.readonly()) {
      return;
    }
    const minVal = this.min();
    const maxVal = this.max();
    const stepVal = this.step() || 1;
    const current = this.displayValue();
    let next = current;

    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      next = Math.min(maxVal, next + stepVal);
      event.preventDefault();
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      next = Math.max(minVal, next - stepVal);
      event.preventDefault();
    } else if (event.key === 'Home') {
      next = minVal;
      event.preventDefault();
    } else if (event.key === 'End') {
      next = maxVal;
      event.preventDefault();
    } else if (event.key === 'PageUp') {
      next = Math.min(maxVal, next + stepVal * 10);
      event.preventDefault();
    } else if (event.key === 'PageDown') {
      next = Math.max(minVal, next - stepVal * 10);
      event.preventDefault();
    }

    if (next !== current) {
      this.updateValue(next);
      this.onChange.emit({ value: next, originalEvent: event });
      this.onSlideEnd.emit({ value: next, originalEvent: event });
    }
  }
}
