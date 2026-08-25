import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation, forwardRef, signal, computed, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { UniqueId } from '../../utils/unique-id';

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
  template: `
    <div
      class="gp-slider"
      [class.gp-slider-disabled]="disabled"
      (mousedown)="onBarMouseDown($event)"
    >
      <div class="gp-slider-range" [style.width.%]="percentage()"></div>
      <span
        class="gp-slider-handle"
        [style.left.%]="percentage()"
        tabindex="0"
        role="slider"
        [attr.aria-valuenow]="value()"
        [attr.aria-valuemin]="min"
        [attr.aria-valuemax]="max"
        [attr.aria-disabled]="disabled"
        (keydown)="onKeyDown($event)"
      ></span>
    </div>
  `,
  styles: [`
    .gp-slider {
      position: relative;
      height: 0.375rem;
      background: var(--gp-surface-hover);
      border-radius: var(--gp-border-radius-full);
      cursor: pointer;
      user-select: none;
      touch-action: none;
      width: 100%;
      margin: 0.75rem 0;
    }
    .gp-slider-range {
      position: absolute;
      height: 100%;
      background: var(--gp-primary);
      border-radius: var(--gp-border-radius-full);
    }
    .gp-slider-handle {
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 1.125rem;
      height: 1.125rem;
      border-radius: 50%;
      background: #ffffff;
      border: 2px solid var(--gp-primary);
      box-shadow: var(--gp-shadow-sm);
      outline: none;
      transition: box-shadow var(--gp-transition-duration), transform var(--gp-transition-duration);
    }
    .gp-slider-handle:hover {
      transform: translate(-50%, -50%) scale(1.1);
    }
    .gp-slider-handle:focus-visible {
      box-shadow: var(--gp-focus-ring);
    }
    .gp-slider-disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `]
})
export class GpSliderComponent implements ControlValueAccessor {
  @Input() min = 0;
  @Input() max = 100;
  @Input() step = 1;
  @Input() disabled = false;

  @Output() onChange = new EventEmitter<{ value: number; originalEvent: Event }>();

  protected value = signal<number>(0);

  private dragging = false;
  private onChangeCallback: (value: any) => void = () => {};
  private onTouchedCallback: () => void = () => {};

  constructor(private el: ElementRef) {}

  protected percentage = computed(() => {
    const val = this.value();
    const range = this.max - this.min;
    if (range <= 0) return 0;
    return Math.min(100, Math.max(0, ((val - this.min) / range) * 100));
  });

  public writeValue(value: any): void {
    this.value.set(value != null ? Number(value) : this.min);
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
      this.onTouchedCallback();
    }
  }

  private updateValueFromPosition(clientX: number): void {
    const rect = this.el.nativeElement.querySelector('.gp-slider').getBoundingClientRect();
    const pos = (clientX - rect.left) / rect.width;
    const clampedPos = Math.min(1, Math.max(0, pos));
    let rawValue = this.min + clampedPos * (this.max - this.min);

    // Step rounding
    if (this.step) {
      rawValue = Math.round((rawValue - this.min) / this.step) * this.step + this.min;
    }

    const finalVal = Math.min(this.max, Math.max(this.min, rawValue));
    this.value.set(finalVal);
    this.onChangeCallback(finalVal);
    this.onChange.emit({ value: finalVal, originalEvent: new CustomEvent('change') });
  }

  protected onKeyDown(event: KeyboardEvent): void {
    if (this.disabled) return;
    let next = this.value();
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      next = Math.min(this.max, next + this.step);
      event.preventDefault();
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      next = Math.max(this.min, next - this.step);
      event.preventDefault();
    }
    if (next !== this.value()) {
      this.value.set(next);
      this.onChangeCallback(next);
      this.onChange.emit({ value: next, originalEvent: event });
    }
  }
}
