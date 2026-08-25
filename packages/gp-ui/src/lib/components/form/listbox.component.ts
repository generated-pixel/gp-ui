import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation, forwardRef, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { GpIconComponent } from '../../icons/icon.component';
import { GpSelectItem } from './select.component';
import { ObjectUtils } from '../../utils/object-utils';

@Component({
  selector: 'gp-listbox',
  standalone: true,
  imports: [CommonModule, FormsModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GpListboxComponent),
      multi: true
    }
  ],
  template: `
    <div class="gp-listbox" [class.gp-listbox-disabled]="disabled">
      @if (filter) {
        <div class="gp-listbox-header">
          <div class="gp-select-filter-container gp-w-full">
            <input
              type="text"
              class="gp-inputtext gp-select-filter-input"
              [placeholder]="filterPlaceholder"
              [value]="filterText()"
              (input)="onFilterInput($event)"
              aria-label="Filter options"
            />
            <gp-icon name="search" size="0.85em" class="gp-select-filter-icon" />
          </div>
        </div>
      }

      <ul class="gp-listbox-list" role="listbox" [attr.aria-multiselectable]="multiple">
        @for (opt of filteredOptions(); track $index) {
          <li
            class="gp-listbox-item"
            [class.gp-listbox-item-selected]="isSelected(opt)"
            [class.gp-listbox-item-disabled]="opt.disabled"
            role="option"
            [attr.aria-selected]="isSelected(opt)"
            (click)="onOptionClick(opt, $event)"
          >
            @if (opt.icon) {
              <gp-icon [name]="opt.icon" class="gp-listbox-icon" />
            }
            <span>{{ opt.label }}</span>
          </li>
        } @empty {
          <li class="gp-listbox-empty">{{ emptyFilterMessage }}</li>
        }
      </ul>
    </div>
  `,
  styles: [`
    .gp-listbox {
      background: var(--gp-surface-card);
      border: 1px solid var(--gp-surface-border);
      border-radius: var(--gp-border-radius);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      width: 100%;
    }
    .gp-listbox-header {
      padding: 0.5rem;
      border-bottom: 1px solid var(--gp-surface-divider);
    }
    .gp-listbox-header .gp-select-filter-container {
      position: relative;
    }
    .gp-listbox-list {
      list-style: none;
      margin: 0;
      padding: 0.35rem 0;
      max-height: 14rem;
      overflow-y: auto;
    }
    .gp-listbox-item {
      padding: 0.5rem 0.75rem;
      font-size: var(--gp-font-size-sm);
      color: var(--gp-text-color);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: background var(--gp-transition-duration);
    }
    .gp-listbox-item:hover:not(.gp-listbox-item-disabled) {
      background: var(--gp-surface-hover);
    }
    .gp-listbox-item-selected {
      background: var(--gp-primary-light);
      color: var(--gp-primary);
      font-weight: 600;
    }
    .gp-listbox-item-disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .gp-listbox-empty {
      padding: 0.75rem;
      font-size: var(--gp-font-size-sm);
      color: var(--gp-text-color-muted);
      text-align: center;
    }
    .gp-listbox-disabled {
      opacity: 0.6;
      pointer-events: none;
    }
  `]
})
export class GpListboxComponent implements ControlValueAccessor {
  @Input() options: (GpSelectItem | any)[] = [];
  @Input() multiple = false;
  @Input() filter = true;
  @Input() filterPlaceholder = 'Search...';
  @Input() emptyFilterMessage = 'No results found';
  @Input() disabled = false;

  @Output() onChange = new EventEmitter<{ value: any; originalEvent: Event }>();

  protected value = signal<any>(null);
  protected filterText = signal<string>('');

  private onChangeCallback: (value: any) => void = () => {};
  private onTouchedCallback: () => void = () => {};

  protected normalizedOptions = computed<GpSelectItem[]>(() => {
    return (this.options || []).map(opt => {
      if (typeof opt === 'object' && opt !== null) {
        if ('value' in opt && 'label' in opt) return opt as GpSelectItem;
        return { label: String(opt.label || opt.name || opt), value: opt.value ?? opt, icon: opt.icon, disabled: opt.disabled };
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

  public isSelected(opt: GpSelectItem): boolean {
    const current = this.value();
    if (this.multiple) {
      return Array.isArray(current) && current.some(v => ObjectUtils.equals(v, opt.value));
    }
    return ObjectUtils.equals(current, opt.value);
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

  public onOptionClick(opt: GpSelectItem, event: MouseEvent): void {
    if (this.disabled || opt.disabled) return;

    let next: any;
    if (this.multiple) {
      const current = Array.isArray(this.value()) ? this.value() : [];
      if (this.isSelected(opt)) {
        next = current.filter((v: any) => !ObjectUtils.equals(v, opt.value));
      } else {
        next = [...current, opt.value];
      }
    } else {
      next = opt.value;
    }

    this.value.set(next);
    this.onChangeCallback(next);
    this.onTouchedCallback();
    this.onChange.emit({ value: next, originalEvent: event });
  }

  protected onFilterInput(event: Event): void {
    this.filterText.set((event.target as HTMLInputElement).value);
  }
}
