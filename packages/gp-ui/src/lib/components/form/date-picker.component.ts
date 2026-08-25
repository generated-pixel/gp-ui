import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation, forwardRef, signal, computed, ElementRef, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { GpIconComponent } from '../../icons/icon.component';
import { GpTranslationService } from '../../config/gp-config.service';
import { UniqueId } from '../../utils/unique-id';

export interface CalendarDay {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
}

@Component({
  selector: 'gp-date-picker',
  standalone: true,
  imports: [CommonModule, FormsModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GpDatePickerComponent),
      multi: true
    }
  ],
  template: `
    <div
      class="gp-datepicker"
      [class.gp-select-open]="overlayVisible()"
      [class.gp-input-disabled]="disabled"
      [class.gp-input-invalid]="invalid"
    >
      <div class="gp-input-wrapper">
        <input
          [id]="inputId"
          type="text"
          [value]="formattedValue()"
          [placeholder]="placeholder || dateFormat"
          [disabled]="disabled"
          [readonly]="readonly || !inline"
          [attr.aria-label]="ariaLabel || placeholder || 'Date Picker'"
          (click)="inline ? null : toggleOverlay()"
          class="gp-inputtext gp-datepicker-input"
        />

        @if (!inline) {
          <button
            type="button"
            class="gp-datepicker-trigger"
            (click)="toggleOverlay()"
            aria-label="Open Calendar"
          >
            <gp-icon [name]="icon" size="0.9em" />
          </button>
        }
      </div>

      @if (inline || overlayVisible()) {
        <div
          class="gp-datepicker-panel"
          [class.gp-datepicker-inline]="inline"
          (click)="$event.stopPropagation()"
        >
          <div class="gp-datepicker-header">
            <button
              type="button"
              class="gp-datepicker-nav-btn"
              (click)="prevMonth()"
              aria-label="Previous Month"
            >
              <gp-icon name="chevron-left" size="0.85em" />
            </button>

            <div class="gp-datepicker-title">
              <span class="gp-datepicker-month">{{ currentMonthName() }}</span>
              <span class="gp-datepicker-year">{{ currentYear() }}</span>
            </div>

            <button
              type="button"
              class="gp-datepicker-nav-btn"
              (click)="nextMonth()"
              aria-label="Next Month"
            >
              <gp-icon name="chevron-right" size="0.85em" />
            </button>
          </div>

          <table class="gp-datepicker-calendar" role="grid">
            <thead>
              <tr>
                @for (dayName of weekDayNames(); track $index) {
                  <th scope="col" class="gp-datepicker-weekday">{{ dayName }}</th>
                }
              </tr>
            </thead>
            <tbody>
              @for (week of calendarWeeks(); track $index) {
                <tr>
                  @for (d of week; track d.date.getTime()) {
                    <td
                      class="gp-datepicker-day-cell"
                      [class.gp-datepicker-other-month]="!d.isCurrentMonth"
                      [class.gp-datepicker-today]="d.isToday"
                      [class.gp-datepicker-selected]="d.isSelected"
                      (click)="selectDate(d.date)"
                      tabindex="0"
                      role="gridcell"
                      [attr.aria-selected]="d.isSelected"
                    >
                      <span class="gp-datepicker-day-number">{{ d.dayNumber }}</span>
                    </td>
                  }
                </tr>
              }
            </tbody>
          </table>

          @if (showButtonBar) {
            <div class="gp-datepicker-buttonbar">
              <button type="button" class="gp-datepicker-bar-btn" (click)="selectToday()">
                {{ translationService.get('today') }}
              </button>
              <button type="button" class="gp-datepicker-bar-btn" (click)="clear()">
                {{ translationService.get('clear') }}
              </button>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .gp-datepicker {
      display: inline-block;
      position: relative;
      width: 100%;
    }
    .gp-datepicker-input {
      padding-right: 2.5rem;
      cursor: pointer;
    }
    .gp-datepicker-trigger {
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      width: 2.25rem;
      background: transparent;
      border: none;
      color: var(--gp-text-color-muted);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .gp-datepicker-panel {
      position: absolute;
      top: 100%;
      left: 0;
      margin-top: 4px;
      padding: 0.75rem;
      background: var(--gp-surface-overlay);
      border: 1px solid var(--gp-surface-border);
      border-radius: var(--gp-border-radius);
      box-shadow: var(--gp-shadow-lg);
      z-index: 1050;
      width: 18rem;
      animation: gp-slide-down 0.15s ease-out;
    }
    .gp-datepicker-inline {
      position: static;
      box-shadow: none;
      border: 1px solid var(--gp-surface-border);
      width: 100%;
    }
    .gp-datepicker-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.5rem;
    }
    .gp-datepicker-nav-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--gp-text-color-secondary);
      border-radius: 50%;
      width: 2rem;
      height: 2rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: background var(--gp-transition-duration);
    }
    .gp-datepicker-nav-btn:hover {
      background: var(--gp-surface-hover);
      color: var(--gp-text-color);
    }
    .gp-datepicker-title {
      font-weight: 600;
      font-size: var(--gp-font-size-sm);
      display: flex;
      gap: 0.35rem;
    }
    .gp-datepicker-calendar {
      width: 100%;
      border-collapse: collapse;
      text-align: center;
    }
    .gp-datepicker-weekday {
      font-size: var(--gp-font-size-xs);
      color: var(--gp-text-color-muted);
      font-weight: 600;
      padding: 0.35rem 0;
    }
    .gp-datepicker-day-cell {
      padding: 0.2rem;
      cursor: pointer;
      border-radius: var(--gp-border-radius);
      font-size: var(--gp-font-size-sm);
      transition: background var(--gp-transition-duration);
      outline: none;
    }
    .gp-datepicker-day-cell:hover {
      background: var(--gp-surface-hover);
    }
    .gp-datepicker-other-month {
      color: var(--gp-text-color-disabled);
    }
    .gp-datepicker-today {
      border: 1px solid var(--gp-primary);
    }
    .gp-datepicker-selected {
      background: var(--gp-primary) !important;
      color: var(--gp-primary-text) !important;
      font-weight: 600;
    }
    .gp-datepicker-day-number {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1.75rem;
      height: 1.75rem;
    }
    .gp-datepicker-buttonbar {
      display: flex;
      justify-content: space-between;
      margin-top: 0.5rem;
      padding-top: 0.5rem;
      border-top: 1px solid var(--gp-surface-divider);
    }
    .gp-datepicker-bar-btn {
      background: none;
      border: none;
      color: var(--gp-primary);
      font-size: var(--gp-font-size-sm);
      font-weight: 600;
      cursor: pointer;
      padding: 0.25rem 0.5rem;
      border-radius: var(--gp-border-radius-sm);
    }
    .gp-datepicker-bar-btn:hover {
      background: var(--gp-primary-light);
    }
  `]
})
export class GpDatePickerComponent implements ControlValueAccessor {
  protected translationService = inject(GpTranslationService);

  @Input() inputId = UniqueId.generate('dp_');
  @Input() placeholder = '';
  @Input() dateFormat = 'mm/dd/yy';
  @Input() icon = 'calendar';
  @Input() inline = false;
  @Input() showButtonBar = true;
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() invalid = false;
  @Input() ariaLabel = '';

  @Output() onSelect = new EventEmitter<Date>();
  @Output() onChange = new EventEmitter<{ value: Date | null }>();

  protected value = signal<Date | null>(null);
  protected viewDate = signal<Date>(new Date());
  protected overlayVisible = signal<boolean>(false);

  private onChangeCallback: (value: any) => void = () => {};
  private onTouchedCallback: () => void = () => {};

  constructor(private el: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.inline && !this.el.nativeElement.contains(event.target)) {
      this.overlayVisible.set(false);
    }
  }

  protected currentYear = computed(() => this.viewDate().getFullYear());
  protected currentMonth = computed(() => this.viewDate().getMonth());

  protected currentMonthName = computed(() => {
    const months = this.translationService.translation().monthNames || [];
    return months[this.currentMonth()] || '';
  });

  protected weekDayNames = computed(() => {
    return this.translationService.translation().dayNamesMin || ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  });

  protected formattedValue = computed(() => {
    const d = this.value();
    if (!d) return '';
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  });

  protected calendarWeeks = computed<CalendarDay[][]>(() => {
    const year = this.currentYear();
    const month = this.currentMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const selected = this.value();
    const today = new Date();

    const days: CalendarDay[] = [];

    // Prev month padding
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, daysInPrevMonth - i);
      days.push({
        date: d,
        dayNumber: d.getDate(),
        isCurrentMonth: false,
        isToday: this.isSameDay(d, today),
        isSelected: selected ? this.isSameDay(d, selected) : false
      });
    }

    // Current month
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(year, month, i);
      days.push({
        date: d,
        dayNumber: i,
        isCurrentMonth: true,
        isToday: this.isSameDay(d, today),
        isSelected: selected ? this.isSameDay(d, selected) : false
      });
    }

    // Next month padding to fill full grid (multiple of 7)
    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i);
      days.push({
        date: d,
        dayNumber: i,
        isCurrentMonth: false,
        isToday: this.isSameDay(d, today),
        isSelected: selected ? this.isSameDay(d, selected) : false
      });
    }

    // Chunk into weeks
    const weeks: CalendarDay[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }
    return weeks;
  });

  private isSameDay(d1: Date, d2: Date): boolean {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  }

  public writeValue(value: any): void {
    const d = value instanceof Date ? value : (value ? new Date(value) : null);
    this.value.set(d);
    if (d) {
      this.viewDate.set(new Date(d.getTime()));
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
    if (this.disabled || this.readonly) return;
    this.overlayVisible.update(v => !v);
  }

  public prevMonth(): void {
    const v = this.viewDate();
    this.viewDate.set(new Date(v.getFullYear(), v.getMonth() - 1, 1));
  }

  public nextMonth(): void {
    const v = this.viewDate();
    this.viewDate.set(new Date(v.getFullYear(), v.getMonth() + 1, 1));
  }

  public selectDate(date: Date): void {
    this.value.set(date);
    this.onChangeCallback(date);
    this.onTouchedCallback();
    this.onSelect.emit(date);
    this.onChange.emit({ value: date });
    if (!this.inline) {
      this.overlayVisible.set(false);
    }
  }

  public selectToday(): void {
    this.selectDate(new Date());
  }

  public clear(): void {
    this.value.set(null);
    this.onChangeCallback(null);
    this.onTouchedCallback();
    this.onChange.emit({ value: null });
    if (!this.inline) {
      this.overlayVisible.set(false);
    }
  }
}
