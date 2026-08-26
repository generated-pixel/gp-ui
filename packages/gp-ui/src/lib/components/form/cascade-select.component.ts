import { GpEditableBaseComponent } from '../../base/gp-editable-base.component';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation, forwardRef, signal, computed, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { GpIconComponent } from '../../icons/icon.component';

export interface GpCascadeSelectItem {
  name: string;
  code?: string;
  items?: GpCascadeSelectItem[];
  [key: string]: any;
}

@Component({
  selector: 'gp-cascade-select',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GpCascadeSelectComponent),
      multi: true
    }
  ],
  templateUrl: './cascade-select.component.html',
  styleUrl: './cascade-select.component.scss'
})
export class GpCascadeSelectComponent extends GpEditableBaseComponent implements ControlValueAccessor {
  @Input() options: any[] = [];
  @Input() optionLabel = 'name';
  @Input() optionValue = 'code';
  @Input() optionGroupChildren = 'items';
  @Input() override placeholder = 'Select item';
  @Input() override disabled = false;
  @Input() override ariaLabel = '';

  @Output() onChange = new EventEmitter<{ value: any }>();

  protected overlayVisible = signal<boolean>(false);
  protected activeItemLevel1 = signal<any>(null);
  protected activeItemLevel2 = signal<any>(null);

  constructor(private hostElRef: ElementRef) {
    super();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.hostElRef.nativeElement.contains(event.target)) {
      this.overlayVisible.set(false);
    }
  }

  protected selectedLabel = computed(() => {
    const val = this.internalValue();
    if (!val) return '';
    return typeof val === 'object' ? val[this.optionLabel] : String(val);
  });

  public override writeValue(value: any): void {
    this.value = value;
    this.internalValue.set(value);
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
    this.overlayVisible.update(v => !v);
  }

  public onLevel1Hover(item: any): void {
    this.activeItemLevel1.set(item);
    this.activeItemLevel2.set(null);
  }

  public onLevel2Hover(item: any): void {
    this.activeItemLevel2.set(item);
  }

  public onItemClick(item: any, level: number): void {
    const children = item[this.optionGroupChildren];
    if (!children || children.length === 0) {
      const val = this.optionValue ? item[this.optionValue] || item : item;
      this.updateValue(val);
      this.handleControlBlur();
      this.onChange.emit({ value: val });
      this.overlayVisible.set(false);
    }
  }
}
