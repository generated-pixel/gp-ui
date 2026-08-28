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
  HostListener
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { GpIconComponent } from '../../../icons/icon.component';
import { GpCheckboxComponent } from '../checkbox/checkbox.component';
import { GpSelectItem } from '../select/select.component';
import { ObjectUtils } from '../../../utils/object-utils';

export type GpMultiSelectDisplay = 'comma' | 'chip';

@Component({
  selector: 'gp-multi-select',
  standalone: true,
  imports: [CommonModule, FormsModule, GpIconComponent, GpCheckboxComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GpMultiSelectComponent),
      multi: true
    }
  ],
  templateUrl: './multi-select.component.html',
  styleUrl: './multi-select.component.scss'
})
export class GpMultiSelectComponent extends GpEditableBaseComponent implements ControlValueAccessor {
  @Input() options: (GpSelectItem | any)[] = [];
  @Input() optionLabel = 'label';
  @Input() optionValue = 'value';
  @Input() override placeholder = 'Select items';
  @Input() filterPlaceholder = 'Search...';
  @Input() emptyFilterMessage = 'No results found';
  @Input() display: GpMultiSelectDisplay = 'comma';
  @Input() maxSelectedLabels = 3;
  @Input() maxSelectedCharacters?: number;
  @Input() maxCharacters?: number;
  @Input() maxSelectedTextLength?: number;
  @Input() selectedItemsTop = true;
  @Input() filter = true;
  @Input() showClear = false;
  @Input() showSelectAll = true;
  @Input() override disabled = false;
  @Input() override readonly = false;
  @Input() override invalid = false;
  @Input() override ariaLabel = '';

  @Output() onChange = new EventEmitter<{ value: any[]; originalEvent: Event }>();

  protected overlayVisible = signal<boolean>(false);
  protected filterText = signal<string>('');

  constructor(private hostElRef: ElementRef) {
    super();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.hostElRef.nativeElement.contains(event.target)) {
      this.overlayVisible.set(false);
    }
  }

  protected get characterLimit(): number | undefined {
    return this.maxSelectedCharacters ?? this.maxCharacters ?? this.maxSelectedTextLength;
  }

  protected normalizedOptions = computed<GpSelectItem[]>(() => {
    return (this.options || []).map((opt) => {
      if (typeof opt === 'object' && opt !== null) {
        if ('value' in opt && 'label' in opt) {
          return opt as GpSelectItem;
        }
        return {
          label: opt[this.optionLabel] ?? String(opt),
          value: this.optionValue ? opt[this.optionValue] : opt,
          icon: opt.icon,
          disabled: opt.disabled
        };
      }
      return { label: String(opt), value: opt };
    });
  });

  protected filteredOptions = computed<GpSelectItem[]>(() => {
    const q = this.filterText().toLowerCase().trim();
    const vals = (this.internalValue() as any[]) || [];
    let list = this.normalizedOptions();
    if (q) {
      list = list.filter((opt) => (opt.label || '').toLowerCase().includes(q));
    }
    if (this.selectedItemsTop) {
      const selected: GpSelectItem[] = [];
      const unselected: GpSelectItem[] = [];
      for (const opt of list) {
        if (vals.some((v) => ObjectUtils.equals(v, opt.value))) {
          selected.push(opt);
        } else {
          unselected.push(opt);
        }
      }
      return [...selected, ...unselected];
    }
    return list;
  });

  protected selectedOptions = computed<GpSelectItem[]>(() => {
    const vals = (this.internalValue() as any[]) || [];
    return this.normalizedOptions().filter((opt) => vals.some((v) => ObjectUtils.equals(v, opt.value)));
  });

  protected selectedLabelsText = computed(() => {
    const fullText = this.selectedOptions()
      .map((o) => o.label)
      .join(', ');
    const limit = this.characterLimit;
    if (limit && limit > 0 && fullText.length > limit) {
      return fullText.slice(0, limit).trim() + '...';
    }
    return fullText;
  });

  public formatChipLabel(label?: string): string {
    if (!label) {
      return '';
    }
    const limit = this.characterLimit;
    if (limit && limit > 0 && label.length > limit) {
      return label.slice(0, limit).trim() + '...';
    }
    return label;
  }

  public isSelected(opt: GpSelectItem): boolean {
    const vals = (this.internalValue() as any[]) || [];
    return vals.some((v) => ObjectUtils.equals(v, opt.value));
  }

  public isAllSelected(): boolean {
    const opts = this.normalizedOptions();
    if (opts.length === 0) {
      return false;
    }
    return opts.every((opt) => this.isSelected(opt));
  }

  public override writeValue(value: any): void {
    const arr = Array.isArray(value) ? value : [];
    this.value = arr;
    this.internalValue.set(arr);
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

  public toggleOverlay(event: MouseEvent): void {
    if (this.disabled || this.readonly) {
      return;
    }
    this.overlayVisible.update((v) => !v);
  }

  public toggleOption(opt: GpSelectItem, event: MouseEvent): void {
    if (opt.disabled) {
      return;
    }
    const current = (this.internalValue() as any[]) || [];
    let next: any[];
    if (this.isSelected(opt)) {
      next = current.filter((v) => !ObjectUtils.equals(v, opt.value));
    } else {
      next = [...current, opt.value];
    }
    this.updateValue(next);
    this.handleControlBlur();
    this.onChange.emit({ value: next, originalEvent: event });
  }

  public removeItem(opt: GpSelectItem, event: MouseEvent): void {
    event.stopPropagation();
    this.toggleOption(opt, event);
  }

  public toggleSelectAll(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    const allSelected = this.isAllSelected();
    const next = allSelected
      ? []
      : this.normalizedOptions()
          .filter((o) => !o.disabled)
          .map((o) => o.value);
    this.updateValue(next);
    this.handleControlBlur();
    this.onChange.emit({ value: next, originalEvent: event || new CustomEvent('change') });
  }

  public clear(event: MouseEvent): void {
    event.stopPropagation();
    this.updateValue([]);
    this.handleControlBlur();
    this.onChange.emit({ value: [], originalEvent: event });
  }

  protected onFilterInput(event: Event): void {
    const q = (event.target as HTMLInputElement).value;
    this.filterText.set(q);
  }
}
