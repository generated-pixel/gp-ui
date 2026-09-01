import { GpEditableBaseComponent } from '../../../base/gp-editable-base.component';
import {
  Component,
  input,
  output,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  forwardRef,
  signal,
  computed,
  ElementRef,
  HostListener,
  OnInit
} from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { GpIconComponent } from '../../../icons/icon.component';
import { UniqueId } from '../../../utils/unique-id';

@Component({
  selector: 'gp-time-picker',
  standalone: true,
  imports: [FormsModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GpTimePickerComponent),
      multi: true
    }
  ],
  templateUrl: './time-picker.component.html',
  styleUrl: './time-picker.component.scss'
})
export class GpTimePickerComponent extends GpEditableBaseComponent implements ControlValueAccessor, OnInit {
  public inputId = input<string>(UniqueId.generate('tp_'));
  public icon = input<string>('clock');
  public hourFormat = input<'12' | '24'>('12');
  public showSeconds = input<boolean>(false);
  public stepHour = input<number>(1);
  public stepMinute = input<number>(1);
  public stepSecond = input<number>(1);
  public minuteSteps = input<number[] | null>([1, 5, 10, 15, 30]);
  public showStepPicker = input<boolean>(true);

  public onChange = output<{ value: string }>();

  protected hours = signal<number>(12);
  protected minutes = signal<number>(0);
  protected seconds = signal<number>(0);
  protected isPm = signal<boolean>(false);
  protected overlayVisible = signal<boolean>(false);
  public activeStepMinute = signal<number>(1);

  constructor(private el: ElementRef) {
    super();
  }

  public override ngOnInit(): void {
    super.ngOnInit();
    const initStep = this.sanitizeStep(this.stepMinute());
    this.activeStepMinute.set(initStep);
  }

  private sanitizeStep(val: number): number {
    if (!val || isNaN(val) || val <= 0) return 1;
    return Math.max(1, Math.min(59, Math.round(val)));
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.overlayVisible.set(false);
    }
  }

  protected formattedHour = computed(() => {
    let h = this.hours();
    if (this.hourFormat() === '12') {
      if (h === 0) {
        h = 12;
      } else if (h > 12) h -= 12;
    }
    return String(h).padStart(2, '0');
  });

  protected formattedMinute = computed(() => String(this.minutes()).padStart(2, '0'));
  protected formattedSecond = computed(() => String(this.seconds()).padStart(2, '0'));

  protected displayTime = computed(() => {
    const h = this.formattedHour();
    const m = this.formattedMinute();
    const s = this.showSeconds() ? `:${this.formattedSecond()}` : '';
    const ampm = this.hourFormat() === '12' ? ` ${this.isPm() ? 'PM' : 'AM'}` : '';
    return `${h}:${m}${s}${ampm}`;
  });

  public override writeValue(value: any): void {
    if (!value) {
      return;
    }
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

  public override registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  public override registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  public toggleOverlay(): void {
    if (this.isEffectivelyDisabled() || this.readonly()) {
      return;
    }
    this.overlayVisible.update((v) => !v);
  }

  public setMinuteStep(step: number): void {
    const valid = this.sanitizeStep(step);
    this.activeStepMinute.set(valid);
  }

  public spinHour(delta: number): void {
    const step = this.stepHour() || 1;
    let max = this.hourFormat() === '24' ? 24 : 12;
    let h = (this.hours() + delta * step) % max;
    if (h < 0) {
      h += max;
    }
    this.hours.set(h);
    this.emitChange();
  }

  public spinMinute(direction: number): void {
    const step = this.activeStepMinute();
    let m = (this.minutes() + direction * step) % 60;
    if (m < 0) {
      m += 60;
    }
    this.minutes.set(m);
    this.emitChange();
  }

  public spinSecond(direction: number): void {
    const step = this.stepSecond() || 1;
    let s = (this.seconds() + direction * step) % 60;
    if (s < 0) {
      s += 60;
    }
    this.seconds.set(s);
    this.emitChange();
  }

  public toggleAmPm(): void {
    this.isPm.update((v) => !v);
    let h = this.hours();
    if (this.isPm() && h < 12) {
      this.hours.set(h + 12);
    }
    if (!this.isPm() && h >= 12) {
      this.hours.set(h - 12);
    }
    this.emitChange();
  }

  private emitChange(): void {
    const val = this.displayTime();
    this.onChangeCallback(val);
    this.onChange.emit({ value: val });
  }
}
