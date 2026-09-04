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
  ChangeDetectionStrategy,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { GpDateBase } from '../../../base/gp-date-base';
import { GpIcon } from '../../../icons/icon';
import { GpButton } from '../../button/button/button';
import { GpDateRange, GpDateRangePreset } from './date-range-picker.interface';
import { GpAppendToDirective } from '../../../overlay/append-to.directive';
import { UniqueId } from '../../../utils/unique-id';

@Component({
  selector: 'gp-date-range-picker',
  standalone: true,
  imports: [GpIcon, GpButton, GpAppendToDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GpDateRangePicker),
      multi: true
    }
  ],
  templateUrl: './date-range-picker.html',
  styleUrl: './date-range-picker.scss'
})
export class GpDateRangePicker extends GpDateBase<GpDateRange> implements ControlValueAccessor {
  public hostElRef = inject(ElementRef);
  public override placeholder = input<string>('Select date range (e.g. Jan 1 - Jan 15)');

  constructor() {
    super();
    this.defaultInputId.set(UniqueId.generate('gp_daterangepicker_'));
  }

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

  protected hoverDate = signal<Date | null>(null);

  get isOpen(): ReturnType<typeof signal<boolean>> {
    return this.overlayVisible;
  }

  get viewingDate(): ReturnType<typeof signal<Date>> {
    return this.viewDate;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.inline() && !this.hostElRef.nativeElement.contains(event.target)) {
      this.closeOverlay();
    }
  }

  public override writeValue(obj: GpDateRange | null): void {
    this.internalValue.set(obj ?? null);
    if (obj?.start) {
      this.viewDate.set(new Date(obj.start));
    }
  }

  public toggleOpen(): void {
    this.toggleOverlay();
  }

  public clear(event: MouseEvent): void {
    event.stopPropagation();
    const emptyRange: GpDateRange = { start: null as any, end: null as any };
    this.updateValue(emptyRange);
    this.handleControlBlur();
    this.onRangeChange.emit(emptyRange);
  }

  public selectPreset(preset: GpDateRangePreset): void {
    const range = preset.range();
    this.updateValue(range);
    this.handleControlBlur();
    this.onRangeChange.emit(range);
    this.closeOverlay();
  }

  public onDateClick(date: Date): void {
    const current = this.internalValue();
    if (!current || !current.start || (current.start && current.end)) {
      // Pick start date
      const nextRange: GpDateRange = { start: date, end: null as any };
      this.internalValue.set(nextRange);
    } else {
      // Pick end date
      let start = current.start;
      let end = date;
      if (end < start) {
        const tmp = start;
        start = end;
        end = tmp;
      }
      const completeRange: GpDateRange = { start, end };
      this.updateValue(completeRange);
      this.handleControlBlur();
      this.onRangeChange.emit(completeRange);
    }
  }

  public onDateHover(date: Date): void {
    this.hoverDate.set(date);
  }

  protected calendarCells = computed(() => {
    const view = this.viewDate();
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

  private toMidnight(d: Date | null | undefined): number {
    if (!d) {
      return 0;
    }
    const date = d instanceof Date ? d : new Date(d);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  }

  protected isStartDate(date: Date): boolean {
    const v = this.internalValue();
    return !!(v?.start && this.isSameDay(v.start, date));
  }

  protected isEndDate(date: Date): boolean {
    const v = this.internalValue();
    return !!(v?.end && this.isSameDay(v.end, date));
  }

  protected isInRange(date: Date): boolean {
    const v = this.internalValue();
    if (!v?.start || !v?.end) {
      return false;
    }
    const t = this.toMidnight(date);
    const startT = this.toMidnight(v.start);
    const endT = this.toMidnight(v.end);
    return t > startT && t < endT;
  }

  protected isHoverRange(date: Date): boolean {
    const v = this.internalValue();
    const h = this.hoverDate();
    if (!v?.start || v.end || !h) {
      return false;
    }
    const t = this.toMidnight(date);
    const startT = this.toMidnight(v.start);
    const hoverT = this.toMidnight(h);
    return (t > startT && t <= hoverT) || (t < startT && t >= hoverT);
  }

  public formatDate(d: Date | null): string {
    if (!d) {
      return '';
    }
    return new Date(d).toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  protected formattedRange = computed(() => {
    const v = this.internalValue();
    if (!v?.start) {
      return '';
    }
    if (!v.end) {
      return this.formatDate(v.start);
    }
    return `${this.formatDate(v.start)} - ${this.formatDate(v.end)}`;
  });
}
