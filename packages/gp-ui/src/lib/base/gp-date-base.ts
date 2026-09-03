import { Directive, input, signal, computed, inject, ElementRef } from '@angular/core';
import { GpEditableBase } from './gp-editable-base';
import { GpTranslationService } from '../config/gp-config.service';
import { GpAppendToTarget } from '../overlay/append-to.interface';

/**
 * Base class for Date and DateRange picking components.
 * Provides shared internationalization, month/year navigation, calendar date arithmetic, and overlay management.
 */
@Directive()
export abstract class GpDateBase<T = any> extends GpEditableBase<T> {
  /** Target DOM element where picker overlay is appended */
  public appendTo = input<GpAppendToTarget>('body');

  /** Date display format */
  public dateFormat = input<string>('mm/dd/yy');

  /** Prepend / trigger icon */
  public icon = input<string>('calendar');

  /** Whether the calendar is rendered inline instead of as a popup */
  public inline = input<boolean>(false);

  /** Active viewing date for month/year calendar navigation */
  public viewDate = signal<Date>(new Date());

  /** Whether the dropdown calendar overlay is visible */
  public overlayVisible = signal<boolean>(false);

  /** Computed calendar metadata */
  public currentYear = computed(() => this.viewDate().getFullYear());
  public currentMonth = computed(() => this.viewDate().getMonth());

  public currentMonthName = computed(() => {
    const months = this.translationService.translation().monthNames || [];
    return months[this.currentMonth()] || this.viewDate().toLocaleString('default', { month: 'long' });
  });

  public weekDayNames = computed(() => {
    return this.translationService.translation().dayNamesMin || ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  });

  /**
   * Helper to determine if two Date objects represent the exact same calendar day.
   */
  public isSameDay(d1: Date | null | undefined, d2: Date | null | undefined): boolean {
    if (!d1 || !d2) {
      return false;
    }
    const date1 = d1 instanceof Date ? d1 : new Date(d1);
    const date2 = d2 instanceof Date ? d2 : new Date(d2);
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  /**
   * Navigates to the previous month in the calendar view.
   */
  public prevMonth(): void {
    const v = this.viewDate();
    this.viewDate.set(new Date(v.getFullYear(), v.getMonth() - 1, 1));
  }

  /**
   * Navigates to the next month in the calendar view.
   */
  public nextMonth(): void {
    const v = this.viewDate();
    this.viewDate.set(new Date(v.getFullYear(), v.getMonth() + 1, 1));
  }

  /**
   * Toggles visibility of the calendar popup overlay.
   */
  public toggleOverlay(): void {
    if (this.isEffectivelyDisabled() || this.readonly()) {
      return;
    }
    this.overlayVisible.update((v) => !v);
  }

  /**
   * Closes the calendar popup overlay.
   */
  public closeOverlay(): void {
    if (!this.inline()) {
      this.overlayVisible.set(false);
    }
  }
}
