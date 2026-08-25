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
  template: `
    <div
      class="gp-select"
      [class.gp-select-open]="overlayVisible()"
      [class.gp-select-disabled]="disabled"
      [class.gp-input-invalid]="invalid"
      [class.gp-select-clearable]="showClear && value() !== null"
      (click)="toggleOverlay($event)"
      tabindex="0"
      role="combobox"
      [attr.aria-expanded]="overlayVisible()"
      [attr.aria-haspopup]="'listbox'"
      [attr.aria-label]="ariaLabel || placeholder || 'Select Option'"
      (keydown)="onKeyDown($event)"
    >
      <div class="gp-select-label-container">
        @if (selectedItem(); as item) {
          @if (itemTemplate) {
            <ng-container *ngTemplateOutlet="itemTemplate; context: { $implicit: item }" />
          } @else {
            <span class="gp-select-label">
              @if (item.icon) {
                <gp-icon [name]="item.icon" class="gp-select-item-icon" />
              }
              {{ item.label }}
            </span>
          }
        } @else {
          <span class="gp-select-label gp-select-placeholder">{{ placeholder }}</span>
        }
      </div>

      <div class="gp-select-triggers">
        @if (showClear && value() !== null && !disabled) {
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
          @if (filter) {
            <div class="gp-select-filter-container">
              <input
                type="text"
                class="gp-inputtext gp-select-filter-input"
                [placeholder]="filterPlaceholder"
                [value]="filterText()"
                (input)="onFilterInput($event)"
                (keydown.enter)="$event.preventDefault()"
                aria-label="Filter items"
              />
              <gp-icon name="search" size="0.85em" class="gp-select-filter-icon" />
            </div>
          }

          <ul class="gp-select-items">
            @for (opt of filteredOptions(); track $index) {
              <li
                class="gp-select-item"
                [class.gp-select-item-selected]="isSelected(opt)"
                [class.gp-select-item-disabled]="opt.disabled"
                role="option"
                [attr.aria-selected]="isSelected(opt)"
                (click)="selectItem(opt, $event)"
              >
                @if (itemTemplate) {
                  <ng-container *ngTemplateOutlet="itemTemplate; context: { $implicit: opt }" />
                } @else {
                  @if (opt.icon) {
                    <gp-icon [name]="opt.icon" class="gp-select-item-icon" />
                  }
                  <span>{{ opt.label }}</span>
                }
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
    .gp-select {
      display: inline-flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      width: 100%;
      height: var(--gp-input-height);
      background: var(--gp-input-bg);
      border: 1px solid var(--gp-input-border);
      border-radius: var(--gp-border-radius);
      padding: 0 var(--gp-input-padding-x);
      cursor: pointer;
      user-select: none;
      outline: none;
      transition: border-color var(--gp-transition-duration), box-shadow var(--gp-transition-duration);
    }
    .gp-select:hover:not(.gp-select-disabled) {
      border-color: var(--gp-input-border-hover);
    }
    .gp-select:focus-visible, .gp-select-open {
      border-color: var(--gp-input-border-focus);
      box-shadow: var(--gp-focus-ring);
    }
    .gp-select-disabled {
      opacity: 0.6;
      cursor: not-allowed;
      background: var(--gp-surface-ground);
    }
    .gp-select-label-container {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .gp-select-label {
      font-size: var(--gp-font-size-sm);
      color: var(--gp-text-color);
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }
    .gp-select-placeholder {
      color: var(--gp-text-color-muted);
    }
    .gp-select-triggers {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
    }
    .gp-select-clear-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--gp-text-color-muted);
      padding: 0.15rem;
      display: inline-flex;
    }
    .gp-select-arrow {
      color: var(--gp-text-color-muted);
    }
    .gp-select-overlay {
      position: absolute;
      top: 100%;
      left: 0;
      width: 100%;
      margin-top: 4px;
      background: var(--gp-surface-overlay);
      border: 1px solid var(--gp-surface-border);
      border-radius: var(--gp-border-radius);
      box-shadow: var(--gp-shadow-lg);
      z-index: 1050;
      max-height: 18rem;
      display: flex;
      flex-direction: column;
      animation: gp-slide-down 0.15s ease-out;
    }
    .gp-select-filter-container {
      position: relative;
      padding: 0.5rem;
      border-bottom: 1px solid var(--gp-surface-divider);
    }
    .gp-select-filter-input {
      padding-right: 2rem;
      height: 2rem;
    }
    .gp-select-filter-icon {
      position: absolute;
      right: 1.25rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--gp-text-color-muted);
    }
    .gp-select-items {
      list-style: none;
      margin: 0;
      padding: 0.35rem 0;
      overflow-y: auto;
    }
    .gp-select-item {
      padding: 0.5rem 0.75rem;
      font-size: var(--gp-font-size-sm);
      color: var(--gp-text-color);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: background var(--gp-transition-duration);
    }
    .gp-select-item:hover:not(.gp-select-item-disabled) {
      background: var(--gp-surface-hover);
    }
    .gp-select-item-selected {
      background: var(--gp-primary-light);
      color: var(--gp-primary);
      font-weight: 600;
    }
    .gp-select-item-disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .gp-select-empty-message {
      padding: 0.75rem;
      font-size: var(--gp-font-size-sm);
      color: var(--gp-text-color-muted);
      text-align: center;
    }
  `]
})
export class GpSelectComponent implements ControlValueAccessor {
  @Input() options: (GpSelectItem | any)[] = [];
  @Input() optionLabel = 'label';
  @Input() optionValue = 'value';
  @Input() placeholder = 'Select an item';
  @Input() filterPlaceholder = 'Search...';
  @Input() emptyFilterMessage = 'No results found';
  @Input() filter = false;
  @Input() showClear = false;
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() invalid = false;
  @Input() ariaLabel = '';

  @ContentChild('item') itemTemplate?: TemplateRef<any>;

  @Output() onChange = new EventEmitter<{ value: any; originalEvent: Event }>();
  @Output() onFilter = new EventEmitter<{ query: string }>();

  protected value = signal<any>(null);
  protected overlayVisible = signal<boolean>(false);
  protected filterText = signal<string>('');

  private onChangeCallback: (value: any) => void = () => {};
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

  protected selectedItem = computed<GpSelectItem | undefined>(() => {
    const val = this.value();
    if (val === null || val === undefined) return undefined;
    return this.normalizedOptions().find(opt => ObjectUtils.equals(opt.value, val));
  });

  public isSelected(opt: GpSelectItem): boolean {
    return ObjectUtils.equals(this.value(), opt.value);
  }

  public writeValue(value: any): void {
    this.value.set(value);
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
