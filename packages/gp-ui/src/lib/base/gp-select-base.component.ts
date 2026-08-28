import {
  Directive,
  input,
  output,
  signal,
  computed,
  ElementRef,
  HostListener,
  inject
} from '@angular/core';
import { GpEditableBaseComponent } from './gp-editable-base.component';

export interface GpSelectItem<T = any> {
  label?: string;
  value: T;
  disabled?: boolean;
  icon?: string;
  group?: string;
}

export type GpSelectSize = 'sm' | 'md' | 'lg';
export type GpSelectVariant = 'outlined' | 'filled';

/**
 * Base class for all select, dropdown, and listbox form components (Select, MultiSelect, Listbox, CascadeSelect, TreeSelect).
 * Provides option normalization, search/filtering, overlay management, outside-click dismissal, and keyboard accessibility.
 */
@Directive()
export abstract class GpSelectBaseComponent<T = any> extends GpEditableBaseComponent<T> {
  private selectHostEl = inject(ElementRef);

  /** Array of raw option objects or primitives */
  public options = input<(GpSelectItem | any)[]>([]);

  /** Property name used as the display label */
  public optionLabel = input<string>('label');

  /** Property name used as the value */
  public optionValue = input<string>('value');

  /** Property name used to determine if an option is disabled */
  public optionDisabled = input<string>('disabled');

  /** Whether filtering/search is enabled */
  public filter = input<boolean>(false);

  /** Placeholder text for filter input */
  public filterPlaceholder = input<string>('Search...');

  /** Message displayed when filter finds 0 results */
  public emptyFilterMessage = input<string>('No results found');

  /** Whether a clear icon is shown when a value is selected */
  public showClear = input<boolean>(false);

  /** Select component size scale */
  public size = input<GpSelectSize>('md');

  /** Visual variant (outlined or filled) */
  public variant = input<GpSelectVariant>('outlined');

  /** Fluid (100% width) layout */
  public fluid = input<boolean>(false);

  /** HTML autofocus attribute */
  public autofocus = input<boolean>(false);

  /** HTML tabindex attribute */
  public tabindex = input<number | undefined>(undefined);

  // ==========================================
  // Common Select Event Outputs
  // ==========================================

  /** Emitted when value selection changes */
  public onChange = output<{ value: any; originalEvent: Event }>();

  /** Emitted when filter search query changes */
  public onFilter = output<{ query: string }>();

  /** Emitted when dropdown overlay opens */
  public onOpen = output<void>();

  /** Emitted when dropdown overlay closes */
  public onClose = output<void>();

  /** Emitted when selection is cleared */
  public onClear = output<void>();

  /** Emitted when select trigger gains focus */
  public onFocusEvent = output<FocusEvent>();

  /** Emitted when select trigger loses focus */
  public onBlurEvent = output<FocusEvent>();

  // ==========================================
  // Internal Reactive Signals
  // ==========================================

  public overlayVisible = signal<boolean>(false);
  public filterText = signal<string>('');

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.overlayVisible() && this.selectHostEl?.nativeElement && !this.selectHostEl.nativeElement.contains(event.target)) {
      this.hideOverlay();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.overlayVisible()) {
      this.hideOverlay();
    }
  }

  /**
   * Transforms raw input options into normalized GpSelectItem objects.
   */
  public normalizedOptions = computed<GpSelectItem[]>(() => {
    const labelKey = this.optionLabel();
    const valueKey = this.optionValue();
    const disabledKey = this.optionDisabled();

    return (this.options() || []).map((opt) => {
      if (typeof opt === 'object' && opt !== null) {
        if ('value' in opt && 'label' in opt) {
          return opt as GpSelectItem;
        }
        return {
          label: opt[labelKey] ?? String(opt),
          value: valueKey ? opt[valueKey] : opt,
          icon: opt.icon,
          disabled: disabledKey ? !!opt[disabledKey] : opt.disabled
        };
      }
      return { label: String(opt), value: opt };
    });
  });

  /**
   * Filters normalized options by query string.
   */
  public filteredOptions = computed<GpSelectItem[]>(() => {
    const q = this.filterText().toLowerCase().trim();
    if (!q) {
      return this.normalizedOptions();
    }
    return this.normalizedOptions().filter((opt) =>
      (opt.label || '').toLowerCase().includes(q)
    );
  });

  public toggleOverlay(event?: MouseEvent): void {
    if (this.isEffectivelyDisabled() || this.readonly()) {
      return;
    }
    if (event) {
      event.stopPropagation();
    }
    if (this.overlayVisible()) {
      this.hideOverlay();
    } else {
      this.showOverlay();
    }
  }

  public showOverlay(): void {
    if (!this.overlayVisible() && !this.isEffectivelyDisabled()) {
      this.overlayVisible.set(true);
      this.onOpen.emit();
    }
  }

  public hideOverlay(): void {
    if (this.overlayVisible()) {
      this.overlayVisible.set(false);
      this.clearFilter();
      this.handleControlBlur();
      this.onClose.emit();
    }
  }

  public onFilterInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const q = target.value || '';
    this.filterText.set(q);
    this.onFilter.emit({ query: q });
  }

  public clearFilter(): void {
    this.filterText.set('');
  }

  public clearSelection(event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    this.updateValue(null as any);
    this.onChange.emit({ value: null, originalEvent: event || new CustomEvent('clear') });
    this.onClear.emit();
  }

  public getOptionLabel(option: GpSelectItem | any): string {
    if (!option) return '';
    return option.label ?? option[this.optionLabel()] ?? String(option);
  }

  public getOptionValue(option: GpSelectItem | any): any {
    if (!option) return null;
    return option.value !== undefined ? option.value : (option[this.optionValue()] ?? option);
  }
}
