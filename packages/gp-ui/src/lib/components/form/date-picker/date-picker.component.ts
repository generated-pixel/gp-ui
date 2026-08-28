import { GpEditableBaseComponent } from '../../../base/gp-editable-base.component';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  forwardRef,
  signal,
  computed,
  ElementRef,
  HostListener,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { GpIconComponent } from '../../../icons/icon.component';
import { GpTranslationService } from '../../../config/gp-config.service';
import { UniqueId } from '../../../utils/unique-id';

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
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss'
})
export class GpDatePickerComponent extends GpEditableBaseComponent implements ControlValueAccessor {
  protected translationService = inject(GpTranslationService);

  @Input() inputId = UniqueId.generate('dp_');
  @Input() override placeholder = '';
  @Input() dateFormat = 'mm/dd/yy';
  @Input() icon = 'calendar';
  @Input() inline = false;
  @Input() showButtonBar = true;
  @Input() override disabled = false;
  @Input() override readonly = false;
  @Input() override invalid = false;
  @Input() override ariaLabel = '';

  @Output() onSelect = new EventEmitter<Date>();
  @Output() onChange = new EventEmitter<{ value: Date | null }>();

  protected viewDate = signal<Date>(new Date());
  protected overlayVisible = signal<boolean>(false);

  constructor(private hostElRef: ElementRef) {
    super();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.inline && !this.hostElRef.nativeElement.contains(event.target)) {
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
    const d = this.internalValue() as Date;
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

  private isSameDay(d1: Date, d2: Date): boolean {
    return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
  }

  public override writeValue(value: any): void {
    const d = value instanceof Date ? value : value ? new Date(value) : null;
    this.value = d;
    this.internalValue.set(d);
    if (d) {
      this.viewDate.set(new Date(d.getTime()));
    }
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

  public toggleOverlay(): void {
    if (this.disabled || this.readonly) return;
    this.overlayVisible.update((v) => !v);
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
    this.updateValue(date);
    this.handleControlBlur();
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
    this.updateValue(null);
    this.handleControlBlur();
    this.onChange.emit({ value: null });
    if (!this.inline) {
      this.overlayVisible.set(false);
    }
  }
}
