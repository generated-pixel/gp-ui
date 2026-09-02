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
  HostListener
} from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { GpIconComponent } from '../../../icons/icon.component';
import { GpAppendToDirective } from '../../../overlay/append-to.directive';
import { GpAppendToTarget } from '../../../overlay/append-to.interface';

export interface GpCascadeSelectItem {
  name: string;
  code?: string;
  items?: GpCascadeSelectItem[];
  [key: string]: any;
}

@Component({
  selector: 'gp-cascade-select',
  standalone: true,
  imports: [GpIconComponent, GpAppendToDirective],
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
  public appendTo = input<GpAppendToTarget>('body');
  public options = input<any[]>([]);
  public optionLabel = input<string>('name');
  public optionValue = input<string>('code');
  public optionGroupChildren = input<string>('items');

  public onChange = output<{ value: any }>();

  protected overlayVisible = signal<boolean>(false);
  protected activeItemLevel1 = signal<any>(null);
  protected activeItemLevel2 = signal<any>(null);

  constructor(public hostElRef: ElementRef) {
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
    if (!val) {
      return '';
    }
    const labelKey = this.optionLabel();
    return typeof val === 'object' ? val[labelKey] : String(val);
  });

  public override writeValue(value: any): void {
    this.internalValue.set(value);
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

  public onLevel1Hover(item: any): void {
    this.activeItemLevel1.set(item);
    this.activeItemLevel2.set(null);
  }

  public onLevel2Hover(item: any): void {
    this.activeItemLevel2.set(item);
  }

  public onItemClick(item: any, level: number): void {
    const childrenKey = this.optionGroupChildren();
    const children = item[childrenKey];
    if (!children || children.length === 0) {
      const valKey = this.optionValue();
      const val = valKey ? item[valKey] || item : item;
      this.updateValue(val);
      this.handleControlBlur();
      this.onChange.emit({ value: val });
      this.overlayVisible.set(false);
    }
  }
}
