import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation, forwardRef, signal, computed, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { GpIconComponent } from '../../icons/icon.component';
import { UniqueId } from '../../utils/unique-id';

@Component({
  selector: 'gp-time-picker',
  standalone: true,
  imports: [CommonModule, FormsModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GpTimePickerComponent),
      multi: true
    }
  ],
  template: `
    <div class="gp-timepicker" [class.gp-select-open]="overlayVisible()" [class.gp-input-disabled]="disabled">
      <div class="gp-input-wrapper">
        <input
          [id]="inputId"
          type="text"
          [value]="displayTime()"
          [placeholder]="placeholder || (hourFormat === '24' ? 'HH:mm' : 'hh:mm AM/PM')"
          [disabled]="disabled"
          [readonly]="true"
          (click)="toggleOverlay()"
          class="gp-inputtext gp-timepicker-input"
          [attr.aria-label]="ariaLabel || 'Time Picker'"
        />
        <button
          type="button"
          class="gp-datepicker-trigger"
          (click)="toggleOverlay()"
          aria-label="Open Time Picker"
        >
          <gp-icon name="clock" size="0.9em" />
        </button>
      </div>

      @if (overlayVisible()) {
        <div class="gp-datepicker-panel gp-timepicker-panel" (click)="$event.stopPropagation()">
          <div class="gp-timepicker-controls">
            <!-- Hours -->
            <div class="gp-timepicker-column">
              <button type="button" class="gp-timepicker-btn" (click)="spinHour(1)" aria-label="Increase hour">
                <gp-icon name="chevron-up" size="0.75em" />
              </button>
              <span class="gp-timepicker-val">{{ formattedHour() }}</span>
              <button type="button" class="gp-timepicker-btn" (click)="spinHour(-1)" aria-label="Decrease hour">
                <gp-icon name="chevron-down" size="0.75em" />
              </button>
            </div>

            <span class="gp-timepicker-separator">:</span>

            <!-- Minutes -->
            <div class="gp-timepicker-column">
              <button type="button" class="gp-timepicker-btn" (click)="spinMinute(stepMinute)" aria-label="Increase minute">
                <gp-icon name="chevron-up" size="0.75em" />
              </button>
              <span class="gp-timepicker-val">{{ formattedMinute() }}</span>
              <button type="button" class="gp-timepicker-btn" (click)="spinMinute(-stepMinute)" aria-label="Decrease minute">
                <gp-icon name="chevron-down" size="0.75em" />
              </button>
            </div>

            @if (showSeconds) {
              <span class="gp-timepicker-separator">:</span>
              <div class="gp-timepicker-column">
                <button type="button" class="gp-timepicker-btn" (click)="spinSecond(stepSecond)" aria-label="Increase second">
                  <gp-icon name="chevron-up" size="0.75em" />
                </button>
                <span class="gp-timepicker-val">{{ formattedSecond() }}</span>
                <button type="button" class="gp-timepicker-btn" (click)="spinSecond(-stepSecond)" aria-label="Decrease second">
                  <gp-icon name="chevron-down" size="0.75em" />
                </button>
              </div>
            }

            @if (hourFormat === '12') {
              <div class="gp-timepicker-column gp-timepicker-ampm">
                <button type="button" class="gp-timepicker-ampm-btn" (click)="toggleAmPm()">
                  {{ isPm() ? 'PM' : 'AM' }}
                </button>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .gp-timepicker {
      display: inline-block;
      position: relative;
      width: 100%;
    }
    .gp-timepicker-input {
      padding-right: 2.5rem;
      cursor: pointer;
    }
    .gp-timepicker-panel {
      width: auto;
      min-width: 14rem;
    }
    .gp-timepicker-controls {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.5rem;
    }
    .gp-timepicker-column {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .gp-timepicker-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--gp-text-color-secondary);
      padding: 0.25rem;
      display: inline-flex;
    }
    .gp-timepicker-btn:hover {
      color: var(--gp-primary);
    }
    .gp-timepicker-val {
      font-size: 1.25rem;
      font-weight: 600;
      min-width: 2rem;
      text-align: center;
    }
    .gp-timepicker-separator {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--gp-text-color-muted);
    }
    .gp-timepicker-ampm-btn {
      background: var(--gp-surface-hover);
      border: 1px solid var(--gp-surface-border);
      border-radius: var(--gp-border-radius-sm);
      font-size: var(--gp-font-size-sm);
      font-weight: 600;
      padding: 0.35rem 0.65rem;
      cursor: pointer;
      color: var(--gp-text-color);
    }
    .gp-timepicker-ampm-btn:hover {
      background: var(--gp-primary-light);
      color: var(--gp-primary);
    }
  `]
})
export class GpTimePickerComponent implements ControlValueAccessor {
  @Input() inputId = UniqueId.generate('tp_');
  @Input() hourFormat: '12' | '24' = '12';
  @Input() showSeconds = false;
  @Input() stepMinute = 1;
  @Input() stepSecond = 1;
  @Input() placeholder = '';
  @Input() disabled = false;
  @Input() ariaLabel = '';

  @Output() onChange = new EventEmitter<{ value: string }>();

  protected hours = signal<number>(12);
  protected minutes = signal<number>(0);
  protected seconds = signal<number>(0);
  protected isPm = signal<boolean>(false);
  protected overlayVisible = signal<boolean>(false);

  private onChangeCallback: (value: any) => void = () => {};
  private onTouchedCallback: () => void = () => {};

  constructor(private el: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.overlayVisible.set(false);
    }
  }

  protected formattedHour = computed(() => {
    let h = this.hours();
    if (this.hourFormat === '12') {
      if (h === 0) h = 12;
      else if (h > 12) h -= 12;
    }
    return String(h).padStart(2, '0');
  });

  protected formattedMinute = computed(() => String(this.minutes()).padStart(2, '0'));
  protected formattedSecond = computed(() => String(this.seconds()).padStart(2, '0'));

  protected displayTime = computed(() => {
    const h = this.formattedHour();
    const m = this.formattedMinute();
    const s = this.showSeconds ? `:${this.formattedSecond()}` : '';
    const ampm = this.hourFormat === '12' ? ` ${this.isPm() ? 'PM' : 'AM'}` : '';
    return `${h}:${m}${s}${ampm}`;
  });

  public writeValue(value: any): void {
    if (!value) return;
    if (value instanceof Date) {
      this.hours.set(value.getHours());
      this.minutes.set(value.getMinutes());
      this.seconds.set(value.getSeconds());
      this.isPm.set(value.getHours() >= 12);
    } else if (typeof value === 'string') {
      const parts = value.split(':');
      if (parts.length >= 2) {
        let h = parseInt(parts[0], 10) || 0;
        let m = parseInt(parts[1], 10) || 0;
        this.hours.set(h);
        this.minutes.set(m);
        this.isPm.set(h >= 12);
      }
    }
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

  public toggleOverlay(): void {
    if (this.disabled) return;
    this.overlayVisible.update(v => !v);
  }

  public spinHour(delta: number): void {
    let max = this.hourFormat === '24' ? 24 : 12;
    let h = (this.hours() + delta) % max;
    if (h < 0) h += max;
    this.hours.set(h);
    this.emitChange();
  }

  public spinMinute(delta: number): void {
    let m = (this.minutes() + delta) % 60;
    if (m < 0) m += 60;
    this.minutes.set(m);
    this.emitChange();
  }

  public spinSecond(delta: number): void {
    let s = (this.seconds() + delta) % 60;
    if (s < 0) s += 60;
    this.seconds.set(s);
    this.emitChange();
  }

  public toggleAmPm(): void {
    this.isPm.update(v => !v);
    let h = this.hours();
    if (this.isPm() && h < 12) this.hours.set(h + 12);
    if (!this.isPm() && h >= 12) this.hours.set(h - 12);
    this.emitChange();
  }

  private emitChange(): void {
    const val = this.displayTime();
    this.onChangeCallback(val);
    this.onChange.emit({ value: val });
  }
}
