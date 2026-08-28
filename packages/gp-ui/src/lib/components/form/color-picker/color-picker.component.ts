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
  ElementRef,
  HostListener
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'gp-color-picker',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GpColorPickerComponent),
      multi: true
    }
  ],
  templateUrl: './color-picker.component.html',
  styleUrl: './color-picker.component.scss'
})
export class GpColorPickerComponent extends GpEditableBaseComponent implements ControlValueAccessor {
  @Input() override disabled = false;
  @Input() presetColors = [
    '#6366f1',
    '#4f46e5',
    '#3b82f6',
    '#0ea5e9',
    '#06b6d4',
    '#14b8a6',
    '#10b981',
    '#84cc16',
    '#eab308',
    '#f97316',
    '#ef4444',
    '#ec4899',
    '#a855f7',
    '#64748b',
    '#1e293b',
    '#ffffff',
    '#000000',
    '#f1f5f9'
  ];

  @Output() onChange = new EventEmitter<{ value: string }>();

  protected overlayVisible = signal<boolean>(false);

  constructor(private hostElementRef: ElementRef) {
    super();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.hostElementRef.nativeElement.contains(event.target)) {
      this.overlayVisible.set(false);
    }
  }

  public override writeValue(value: any): void {
    const col = value || '#6366f1';
    this.value = col;
    this.internalValue.set(col);
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
    if (this.disabled) return;
    this.overlayVisible.update((v) => !v);
  }

  public selectColor(color: string): void {
    this.updateValue(color);
    this.handleControlBlur();
    this.onChange.emit({ value: color });
    this.overlayVisible.set(false);
  }

  protected onNativeColorInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.updateValue(val);
    this.onChange.emit({ value: val });
  }
}
