import { GpEditableBaseComponent } from '../../../base/gp-editable-base.component';
import {
  Component,
  input,
  output,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  forwardRef,
  computed,
  ElementRef,
  HostListener
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

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
  public min = input<number>(0);
  public max = input<number>(100);
  public step = input<number>(1);

  public onChange = output<{ value: number; originalEvent: Event }>();

  private dragging = false;

  constructor(private el: ElementRef) {
    super();
  }

  protected percentage = computed(() => {
    const val = Number(this.internalValue()) || 0;
    const minVal = this.min();
    const maxVal = this.max();
    const range = maxVal - minVal;
    if (range <= 0) {
      return 0;
    }
    return Math.min(100, Math.max(0, ((val - minVal) / range) * 100));
  });

  public override writeValue(value: any): void {
    const num = value != null ? Number(value) : this.min();
    this.internalValue.set(num);
  }

  public override registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  public override registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  protected onBarMouseDown(event: MouseEvent): void {
    if (this.isEffectivelyDisabled() || this.readonly()) {
      return;
    }
    this.dragging = true;
    this.updateValueFromPosition(event.clientX);
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.dragging && !this.isEffectivelyDisabled() && !this.readonly()) {
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
    if (!sliderEl) {
      return;
    }
    const minVal = this.min();
    const maxVal = this.max();
    const stepVal = this.step();
    const rect = sliderEl.getBoundingClientRect();
    const pos = (clientX - rect.left) / rect.width;
    const clampedPos = Math.min(1, Math.max(0, pos));
    let rawValue = minVal + clampedPos * (maxVal - minVal);

    if (stepVal) {
      rawValue = Math.round((rawValue - minVal) / stepVal) * stepVal + minVal;
    }

    const finalVal = Math.min(maxVal, Math.max(minVal, rawValue));
    this.updateValue(finalVal);
    this.onChange.emit({ value: finalVal, originalEvent: new CustomEvent('change') });
  }

  protected onKeyDown(event: KeyboardEvent): void {
    if (this.isEffectivelyDisabled() || this.readonly()) {
      return;
    }
    const minVal = this.min();
    const maxVal = this.max();
    const stepVal = this.step();
    const current = Number(this.internalValue()) || 0;
    let next = current;
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      next = Math.min(maxVal, next + stepVal);
      event.preventDefault();
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      next = Math.max(minVal, next - stepVal);
      event.preventDefault();
    }
    if (next !== current) {
      this.updateValue(next);
      this.onChange.emit({ value: next, originalEvent: event });
    }
  }
}
