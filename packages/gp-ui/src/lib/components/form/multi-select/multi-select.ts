import { Component, input, ChangeDetectionStrategy, ViewEncapsulation, forwardRef, computed } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { GpIcon } from '../../../icons/icon';
import { GpCheckbox } from '../checkbox/checkbox';
import { GpSelectBase, GpSelectItem } from '../../../base/gp-select-base';
import { GpAppendToDirective } from '../../../overlay/append-to.directive';
import { ObjectUtils } from '../../../utils/object-utils';
import { UniqueId } from '../../../utils/unique-id';

export type GpMultiSelectDisplay = 'comma' | 'chip';

@Component({
  selector: 'gp-multi-select',
  standalone: true,
  imports: [FormsModule, GpIcon, GpCheckbox, GpAppendToDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GpMultiSelect),
      multi: true
    }
  ],
  templateUrl: './multi-select.html',
  styleUrl: './multi-select.scss'
})
export class GpMultiSelect extends GpSelectBase<any[]> implements ControlValueAccessor {
  public display = input<GpMultiSelectDisplay>('comma');
  public maxSelectedLabels = input<number>(3);
  public maxSelectedCharacters = input<number | undefined>(undefined);
  public maxCharacters = input<number | undefined>(undefined);
  public maxSelectedTextLength = input<number | undefined>(undefined);
  public selectedItemsTop = input<boolean>(true);
  public showSelectAll = input<boolean>(true);

  public override filter = input<boolean>(true);

  constructor() {
    super();
    this.defaultInputId.set(UniqueId.generate('gp_multiselect_'));
  }

  public get characterLimit(): number | undefined {
    return this.maxSelectedCharacters() ?? this.maxCharacters() ?? this.maxSelectedTextLength();
  }

  public override filteredOptions = computed<GpSelectItem[]>(() => {
    const q = this.filterText().toLowerCase().trim();
    const vals = (this.internalValue() as any[]) || [];
    let list = this.normalizedOptions();
    if (q) {
      list = list.filter((opt) => (opt.label || '').toLowerCase().includes(q));
    }
    if (this.selectedItemsTop()) {
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

  public selectedOptions = computed<GpSelectItem[]>(() => {
    const vals = (this.internalValue() as any[]) || [];
    return this.normalizedOptions().filter((opt) => vals.some((v) => ObjectUtils.equals(v, opt.value)));
  });

  public selectedLabelsText = computed(() => {
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
    this.internalValue.set(arr);
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
}
