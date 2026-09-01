import {
  Component,
  forwardRef,
  signal,
  computed,
  ElementRef,
  HostListener,
  inject,
  input,
  output,
  effect,
  ChangeDetectionStrategy,
  ViewEncapsulation
} from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { GpIconComponent } from '../../../icons/icon.component';
import { GpButtonComponent } from '../../button/button/button.component';
import { GpDateRange, GpDateRangePreset } from './date-range-picker.interface';

@Component({
  selector: 'gp-date-range-picker',
  standalone: true,
  imports: [GpIconComponent, GpButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GpDateRangePickerComponent),
      multi: true
    }
  ],
  templateUrl: './date-range-picker.component.html',
  styleUrl: './date-range-picker.component.scss'
})
export class GpDateRangePickerComponent implements ControlValueAccessor {
  public placeholder = input<string>('Select date range (e.g. Jan 1 - Jan 15)');
  public disabledInput = input<boolean>(false, { alias: 'disabled' });
  public presets = input<GpDateRangePreset[]>([
    {
      label: 'Today',
      range: () => {
        const d = new Date();
        return { start: new Date(d.setHours(0, 0, 0, 0)), end: new Date(d.setHours(23, 59, 59, 999)) };
      }
    },
    {
      label: 'Last 7 Days',
      range: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 7);
        return { start, end };
      }
    },
    {
      label: 'Last 30 Days',
      range: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 30);
        return { start, end };
      }
    },
    {
      label: 'This Month',
      range: () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        return { start, end };
      }
    },
    {
      label: 'Year to Date',
      range: () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 1);
        return { start, end: now };
      }
    }
  ]);

  public onRangeChange = output<GpDateRange>();

  public disabled = signal<boolean>(false);
  protected isOpen = signal<boolean>(false);
  protected value = signal<GpDateRange | null>(null);
  protected hoverDate = signal<Date | null>(null);
  protected viewingDate = signal<Date>(new Date());

  private el = inject(ElementRef);
  private onChange: (val: GpDateRange | null) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    effect(() => {
      this.disabled.set(this.disabledInput());
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }

  // ControlValueAccessor
  writeValue(obj: GpDateRange | null): void {
    this.value.set(obj);
    if (obj?.start) {
      this.viewingDate.set(new Date(obj.start));
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  public toggleOpen(): void {
    if (!this.disabled()) {
      this.isOpen.update((v) => !v);
    }
  }

  public clear(event: MouseEvent): void {
    event.stopPropagation();
    this.value.set(null);
    this.onChange(null);
    this.onRangeChange.emit({ start: null, end: null });
  }

  public selectPreset(preset: GpDateRangePreset): void {
    const range = preset.range();
    this.value.set(range);
    this.onChange(range);
    this.onRangeChange.emit(range);
    this.isOpen.set(false);
  }

  public onDateClick(date: Date): void {
    const current = this.value();
    if (!current || !current.start || (current.start && current.end)) {
      // Pick start date
      const nextRange = { start: date, end: null };
      this.value.set(nextRange);
    } else {
      // Pick end date
      let start = current.start;
      let end = date;
      if (end < start) {
        const tmp = start;
        start = end;
        end = tmp;
      }
      const completeRange = { start, end };
      this.value.set(completeRange);
      this.onChange(completeRange);
      this.onRangeChange.emit(completeRange);
    }
  }

  public onDateHover(date: Date): void {
    this.hoverDate.set(date);
  }

  public prevMonth(): void {
    const d = new Date(this.viewingDate());
    d.setMonth(d.getMonth() - 1);
    this.viewingDate.set(d);
  }

  public nextMonth(): void {
    const d = new Date(this.viewingDate());
    d.setMonth(d.getMonth() + 1);
    this.viewingDate.set(d);
  }

  get currentMonthName(): string {
    return this.viewingDate().toLocaleString('default', { month: 'long' });
  }

  get currentYear(): number {
    return this.viewingDate().getFullYear();
  }

  protected calendarCells = computed(() => {
    const view = this.viewingDate();
    const year = view.getFullYear();
    const month = view.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const cells: Array<{ date: Date; dayNumber: number; currentMonth: boolean }> = [];

    // Previous month filler days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      cells.push({
        date: new Date(year, month - 1, daysInPrevMonth - i),
        dayNumber: daysInPrevMonth - i,
        currentMonth: false
      });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({
        date: new Date(year, month, d),
        dayNumber: d,
        currentMonth: true
      });
    }

    // Next month filler days to complete grid
    const remaining = (7 - (cells.length % 7)) % 7;
    for (let n = 1; n <= remaining; n++) {
      cells.push({
        date: new Date(year, month + 1, n),
        dayNumber: n,
        currentMonth: false
      });
    }

    return cells;
  });

  protected isStartDate(date: Date): boolean {
    const v = this.value();
    return !!(v?.start && this.isSameDay(v.start, date));
  }

  protected isEndDate(date: Date): boolean {
    const v = this.value();
    return !!(v?.end && this.isSameDay(v.end, date));
  }

  protected isInRange(date: Date): boolean {
    const v = this.value();
    if (!v?.start || !v?.end) {
      return false;
    }
    return date > v.start && date < v.end;
  }

  protected isHoverRange(date: Date): boolean {
    const v = this.value();
    const h = this.hoverDate();
    if (!v?.start || v.end || !h) {
      return false;
    }
    const start = v.start;
    return (date > start && date <= h) || (date < start && date >= h);
  }

  private isSameDay(d1: Date, d2: Date): boolean {
    return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
  }

  public formatDate(d: Date | null): string {
    if (!d) {
      return '';
    }
    return new Date(d).toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  protected formattedRange = computed(() => {
    const v = this.value();
    if (!v?.start) {
      return '';
    }
    if (!v.end) {
      return this.formatDate(v.start);
    }
    return `${this.formatDate(v.start)} - ${this.formatDate(v.end)}`;
  });
}
