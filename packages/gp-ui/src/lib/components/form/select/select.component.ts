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
  contentChild,
  TemplateRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { GpIconComponent } from '../../../icons/icon.component';
import { ObjectUtils } from '../../../utils/object-utils';

export interface GpSelectItem<T = any> {
  label?: string;
  value: T;
  disabled?: boolean;
  icon?: string;
  group?: string;
}

@Component({
  selector: 'gp-select',
  standalone: true,
  imports: [CommonModule, FormsModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GpSelectComponent),
      multi: true
    }
  ],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss'
})
export class GpSelectComponent extends GpEditableBaseComponent implements ControlValueAccessor {
  public options = input<(GpSelectItem | any)[]>([]);
  public optionLabel = input<string>('label');
  public optionValue = input<string>('value');
  public filterPlaceholder = input<string>('Search...');
  public emptyFilterMessage = input<string>('No results found');
  public filter = input<boolean>(false);
  public showClear = input<boolean>(false);

  public itemTemplate = contentChild<TemplateRef<any>>('item');

  public onChange = output<{ value: any; originalEvent: Event }>();
  public onFilter = output<{ query: string }>();

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

  protected normalizedOptions = computed<GpSelectItem[]>(() => {
    const labelKey = this.optionLabel();
    const valueKey = this.optionValue();
    return (this.options() || []).map((opt) => {
      if (typeof opt === 'object' && opt !== null) {
        if ('value' in opt && 'label' in opt) {
          return opt as GpSelectItem;
        }
        return {
          label: opt[labelKey] ?? String(opt),
          value: valueKey ? opt[valueKey] : opt,
          icon: opt.icon,
          disabled: opt.disabled
        };
      }
      return { label: String(opt), value: opt };
    });
  });

  protected filteredOptions = computed<GpSelectItem[]>(() => {
    const q = this.filterText().toLowerCase().trim();
    if (!q) {
      return this.normalizedOptions();
    }
    return this.normalizedOptions().filter((opt) => (opt.label || '').toLowerCase().includes(q));
  });

  protected selectedItem = computed<GpSelectItem | undefined>(() => {
    const val = this.internalValue();
    if (val === null || val === undefined) {
      return undefined;
    }
    return this.normalizedOptions().find((opt) => ObjectUtils.equals(opt.value, val));
  });

  public isSelected(opt: GpSelectItem): boolean {
    return ObjectUtils.equals(this.internalValue(), opt.value);
  }

  public override writeValue(value: any): void {
    this.internalValue.set(value);
  }

  public override registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  public override registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  public toggleOverlay(event: MouseEvent): void {
    if (this.isEffectivelyDisabled() || this.readonly()) {
      return;
    }
    this.overlayVisible.update((v) => !v);
  }

  public selectItem(opt: GpSelectItem, event: MouseEvent): void {
    if (opt.disabled) {
      return;
    }
    this.updateValue(opt.value);
    this.handleControlBlur();
    this.onChange.emit({ value: opt.value, originalEvent: event });
    this.overlayVisible.set(false);
    this.filterText.set('');
  }

  public clear(event: MouseEvent): void {
    event.stopPropagation();
    this.updateValue(null);
    this.handleControlBlur();
    this.onChange.emit({ value: null, originalEvent: event });
  }

  protected onFilterInput(event: Event): void {
    const q = (event.target as HTMLInputElement).value;
    this.filterText.set(q);
    this.onFilter.emit({ query: q });
  }

  protected onKeyDown(event: KeyboardEvent): void {
    if (this.isEffectivelyDisabled()) {
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.overlayVisible.update((v) => !v);
    } else if (event.key === 'Escape') {
      this.overlayVisible.set(false);
    }
  }
}
