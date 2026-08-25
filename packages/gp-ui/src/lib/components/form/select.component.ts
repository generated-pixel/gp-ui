import { GpEditableBaseComponent } from '../../base/gp-editable-base.component';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation, forwardRef, signal, computed, ElementRef, HostListener, ContentChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { GpIconComponent } from '../../icons/icon.component';
import { UniqueId } from '../../utils/unique-id';
import { ObjectUtils } from '../../utils/object-utils';

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
  @Input() options: (GpSelectItem | any)[] = [];
  @Input() optionLabel = 'label';
  @Input() optionValue = 'value';
  @Input() override placeholder = 'Select an item';
  @Input() filterPlaceholder = 'Search...';
  @Input() emptyFilterMessage = 'No results found';
  @Input() filter = false;
  @Input() showClear = false;
  @Input() override disabled = false;
  @Input() override readonly = false;
  @Input() override invalid = false;
  @Input() override ariaLabel = '';

  @ContentChild('item') itemTemplate?: TemplateRef<any>;

  @Output() onChange = new EventEmitter<{ value: any; originalEvent: Event }>();
  @Output() onFilter = new EventEmitter<{ query: string }>();

  public override value = signal<any>(null);
  protected overlayVisible = signal<boolean>(false);
  protected filterText = signal<string>('');

  // Inherited onChangeCallback
  // Inherited onTouchedCallback

  constructor(private el: ElementRef) {
    super();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.overlayVisible.set(false);
    }
  }

  protected normalizedOptions = computed<GpSelectItem[]>(() => {
    return (this.options || []).map(opt => {
      if (typeof opt === 'object' && opt !== null) {
        if ('value' in opt && 'label' in opt) return opt as GpSelectItem;
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
    if (!q) return this.normalizedOptions();
    return this.normalizedOptions().filter(opt =>
      (opt.label || '').toLowerCase().includes(q)
    );
  });

  protected selectedItem = computed<GpSelectItem | undefined>(() => {
    const val = this.value();
    if (val === null || val === undefined) return undefined;
    return this.normalizedOptions().find(opt => ObjectUtils.equals(opt.value, val));
  });

  public isSelected(opt: GpSelectItem): boolean {
    return ObjectUtils.equals(this.value(), opt.value);
  }

  public override writeValue(value: any): void {
    this.value.set(value);
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
    if (this.disabled || this.readonly) return;
    this.overlayVisible.update(v => !v);
  }

  public selectItem(opt: GpSelectItem, event: MouseEvent): void {
    if (opt.disabled) return;
    this.value.set(opt.value);
    this.onChangeCallback(opt.value);
    this.onTouchedCallback();
    this.onChange.emit({ value: opt.value, originalEvent: event });
    this.overlayVisible.set(false);
    this.filterText.set('');
  }

  public clear(event: MouseEvent): void {
    event.stopPropagation();
    this.value.set(null);
    this.onChangeCallback(null);
    this.onTouchedCallback();
    this.onChange.emit({ value: null, originalEvent: event });
  }

  protected onFilterInput(event: Event): void {
    const q = (event.target as HTMLInputElement).value;
    this.filterText.set(q);
    this.onFilter.emit({ query: q });
  }

  protected onKeyDown(event: KeyboardEvent): void {
    if (this.disabled) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.overlayVisible.update(v => !v);
    } else if (event.key === 'Escape') {
      this.overlayVisible.set(false);
    }
  }
}
