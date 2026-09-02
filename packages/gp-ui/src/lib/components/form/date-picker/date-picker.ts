import { GpDateBase } from '../../../base/gp-date-base';
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
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { GpIcon } from '../../../icons/icon';
import { UniqueId } from '../../../utils/unique-id';
import { GpAppendToDirective } from '../../../overlay/append-to.directive';

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
  imports: [CommonModule, FormsModule, GpIcon, GpAppendToDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GpDatePicker),
      multi: true
    }
  ],
  templateUrl: './date-picker.html',
  styleUrl: './date-picker.scss'
})
export class GpDatePicker extends GpDateBase implements ControlValueAccessor {
  public inputId = input<string>(UniqueId.generate('dp_'));
  public showButtonBar = input<boolean>(true);

  public onSelect = output<Date>();
  public onChange = output<{ value: Date | null }>();

  constructor(public hostElRef: ElementRef) {
    super();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.inline() && !this.hostElRef.nativeElement.contains(event.target)) {
      this.closeOverlay();
    }
  }

  protected formattedValue = computed(() => {
    const d = this.internalValue() as Date;
    if (!d) {
      return '';
    }
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

    const selected = this.internalValue() as Date;
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

  public override writeValue(value: any): void {
    const d = value instanceof Date ? value : value ? new Date(value) : null;
    this.internalValue.set(d);
    if (d) {
      this.viewDate.set(new Date(d.getTime()));
    }
  }

  public selectDate(date: Date): void {
    this.updateValue(date);
    this.handleControlBlur();
    this.onSelect.emit(date);
    this.onChange.emit({ value: date });
    this.closeOverlay();
  }

  public selectToday(): void {
    this.selectDate(new Date());
  }

  public clear(): void {
    this.updateValue(null);
    this.handleControlBlur();
    this.onChange.emit({ value: null });
    this.closeOverlay();
  }
}
