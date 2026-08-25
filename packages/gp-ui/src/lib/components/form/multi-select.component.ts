import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation, forwardRef, signal, computed, ElementRef, HostListener, ContentChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { GpIconComponent } from '../../icons/icon.component';
import { GpCheckboxComponent } from './checkbox.component';
import { GpSelectItem } from './select.component';
import { ObjectUtils } from '../../utils/object-utils';

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
  template: `
    <div
      class="gp-multiselect"
      [class.gp-select-open]="overlayVisible()"
      [class.gp-select-disabled]="disabled"
      [class.gp-input-invalid]="invalid"
      (click)="toggleOverlay($event)"
      tabindex="0"
      role="combobox"
      [attr.aria-expanded]="overlayVisible()"
      [attr.aria-label]="ariaLabel || placeholder || 'Multi-Select'"
    >
      <div class="gp-multiselect-label-container">
        @if (selectedOptions().length > 0) {
          @if (display === 'chip') {
            <div class="gp-multiselect-chips">
              @for (item of selectedOptions(); track $index) {
                <span class="gp-multiselect-chip">
                  <span>{{ item.label }}</span>
                  <button
                    type="button"
                    class="gp-multiselect-chip-remove"
                    aria-label="Remove item"
                    (click)="removeItem(item, $event)"
                  >
                    <gp-icon name="times" size="0.65em" />
                  </button>
                </span>
              }
            </div>
          } @else {
            <span class="gp-select-label">
              @if (selectedOptions().length <= maxSelectedLabels) {
                {{ selectedLabelsText() }}
              } @else {
                {{ selectedOptions().length }} items selected
              }
            </span>
          }
        } @else {
          <span class="gp-select-label gp-select-placeholder">{{ placeholder }}</span>
        }
      </div>

      <div class="gp-select-triggers">
        @if (showClear && selectedOptions().length > 0 && !disabled) {
          <button
            type="button"
            class="gp-select-clear-btn"
            aria-label="Clear selection"
            (click)="clear($event)"
          >
            <gp-icon name="times" size="0.8em" />
          </button>
        }
        <gp-icon [name]="overlayVisible() ? 'chevron-up' : 'chevron-down'" size="0.85em" class="gp-select-arrow" />
      </div>

      @if (overlayVisible()) {
        <div class="gp-select-overlay" role="listbox" (click)="$event.stopPropagation()">
          <div class="gp-multiselect-header">
            @if (showSelectAll) {
              <gp-checkbox
                [binary]="true"
                [value]="isAllSelected()"
                (onChange)="toggleSelectAll()"
              />
            }
            @if (filter) {
              <div class="gp-select-filter-container gp-w-full">
                <input
                  type="text"
                  class="gp-inputtext gp-select-filter-input"
                  [placeholder]="filterPlaceholder"
                  [value]="filterText()"
                  (input)="onFilterInput($event)"
                  aria-label="Filter items"
                />
                <gp-icon name="search" size="0.85em" class="gp-select-filter-icon" />
              </div>
            }
          </div>

          <ul class="gp-select-items">
            @for (opt of filteredOptions(); track $index) {
              <li
                class="gp-select-item gp-multiselect-item"
                [class.gp-select-item-selected]="isSelected(opt)"
                [class.gp-select-item-disabled]="opt.disabled"
                role="option"
                [attr.aria-selected]="isSelected(opt)"
                (click)="toggleOption(opt, $event)"
              >
                <gp-checkbox [binary]="true" [value]="isSelected(opt)" />
                <span>{{ opt.label }}</span>
              </li>
            } @empty {
              <li class="gp-select-empty-message">{{ emptyFilterMessage }}</li>
            }
          </ul>
        </div>
      }
    </div>
  `,
  styles: [`
    .gp-multiselect {
      display: inline-flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      width: 100%;
      min-height: var(--gp-input-height);
      background: var(--gp-input-bg);
      border: 1px solid var(--gp-input-border);
      border-radius: var(--gp-border-radius);
      padding: 0.25rem var(--gp-input-padding-x);
      cursor: pointer;
      user-select: none;
      outline: none;
      transition: border-color var(--gp-transition-duration), box-shadow var(--gp-transition-duration);
    }
    .gp-multiselect:hover:not(.gp-select-disabled) {
      border-color: var(--gp-input-border-hover);
    }
    .gp-multiselect:focus-visible, .gp-select-open {
      border-color: var(--gp-input-border-focus);
      box-shadow: var(--gp-focus-ring);
    }
    .gp-multiselect-label-container {
      flex: 1;
      overflow: hidden;
    }
    .gp-multiselect-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 0.25rem;
    }
    .gp-multiselect-chip {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      background: var(--gp-surface-hover);
      color: var(--gp-text-color);
      font-size: var(--gp-font-size-xs);
      padding: 0.2rem 0.5rem;
      border-radius: var(--gp-border-radius-full);
    }
    .gp-multiselect-chip-remove {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--gp-text-color-muted);
      padding: 0;
      display: inline-flex;
      border-radius: 50%;
    }
    .gp-multiselect-chip-remove:hover {
      color: var(--gp-danger);
    }
    .gp-multiselect-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem;
      border-bottom: 1px solid var(--gp-surface-divider);
    }
    .gp-multiselect-header .gp-select-filter-container {
      padding: 0;
      border: none;
    }
    .gp-multiselect-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
  `]
})
export class GpMultiSelectComponent implements ControlValueAccessor {
  @Input() options: (GpSelectItem | any)[] = [];
  @Input() optionLabel = 'label';
  @Input() optionValue = 'value';
  @Input() placeholder = 'Select items';
  @Input() filterPlaceholder = 'Search...';
  @Input() emptyFilterMessage = 'No results found';
  @Input() display: GpMultiSelectDisplay = 'comma';
  @Input() maxSelectedLabels = 3;
  @Input() filter = true;
  @Input() showClear = false;
  @Input() showSelectAll = true;
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() invalid = false;
  @Input() ariaLabel = '';

  @Output() onChange = new EventEmitter<{ value: any[]; originalEvent: Event }>();

  protected value = signal<any[]>([]);
  protected overlayVisible = signal<boolean>(false);
  protected filterText = signal<string>('');

  private onChangeCallback: (value: any[]) => void = () => {};
  private onTouchedCallback: () => void = () => {};

  constructor(private el: ElementRef) {}

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

  protected selectedOptions = computed<GpSelectItem[]>(() => {
    const vals = this.value() || [];
    return this.normalizedOptions().filter(opt =>
      vals.some(v => ObjectUtils.equals(v, opt.value))
    );
  });

  protected selectedLabelsText = computed(() => {
    return this.selectedOptions().map(o => o.label).join(', ');
  });

  public isSelected(opt: GpSelectItem): boolean {
    const vals = this.value() || [];
    return vals.some(v => ObjectUtils.equals(v, opt.value));
  }

  public isAllSelected(): boolean {
    const opts = this.normalizedOptions();
    if (opts.length === 0) return false;
    return opts.every(opt => this.isSelected(opt));
  }

  public writeValue(value: any): void {
    this.value.set(Array.isArray(value) ? value : []);
  }

  public registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public toggleOverlay(event: MouseEvent): void {
    if (this.disabled || this.readonly) return;
    this.overlayVisible.update(v => !v);
  }

  public toggleOption(opt: GpSelectItem, event: MouseEvent): void {
    if (opt.disabled) return;
    const current = this.value() || [];
    let next: any[];
    if (this.isSelected(opt)) {
      next = current.filter(v => !ObjectUtils.equals(v, opt.value));
    } else {
      next = [...current, opt.value];
    }
    this.value.set(next);
    this.onChangeCallback(next);
    this.onTouchedCallback();
    this.onChange.emit({ value: next, originalEvent: event });
  }

  public removeItem(opt: GpSelectItem, event: MouseEvent): void {
    event.stopPropagation();
    this.toggleOption(opt, event);
  }

  public toggleSelectAll(): void {
    const allSelected = this.isAllSelected();
    const next = allSelected ? [] : this.normalizedOptions().filter(o => !o.disabled).map(o => o.value);
    this.value.set(next);
    this.onChangeCallback(next);
    this.onTouchedCallback();
    this.onChange.emit({ value: next, originalEvent: new CustomEvent('change') });
  }

  public clear(event: MouseEvent): void {
    event.stopPropagation();
    this.value.set([]);
    this.onChangeCallback([]);
    this.onTouchedCallback();
    this.onChange.emit({ value: [], originalEvent: event });
  }

  protected onFilterInput(event: Event): void {
    const q = (event.target as HTMLInputElement).value;
    this.filterText.set(q);
  }
}
