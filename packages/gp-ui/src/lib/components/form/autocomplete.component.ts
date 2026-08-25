import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation, forwardRef, signal, computed, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { GpIconComponent } from '../../icons/icon.component';
import { UniqueId } from '../../utils/unique-id';
import { ObjectUtils } from '../../utils/object-utils';

export interface GpAutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

@Component({
  selector: 'gp-autocomplete',
  standalone: true,
  imports: [CommonModule, FormsModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GpAutoCompleteComponent),
      multi: true
    }
  ],
  template: `
    <div class="gp-autocomplete" [class.gp-input-disabled]="disabled" [class.gp-input-invalid]="invalid">
      <div class="gp-input-wrapper">
        <input
          [id]="inputId"
          type="text"
          [value]="inputDisplayValue()"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [readonly]="readonly"
          [attr.aria-label]="ariaLabel || placeholder || 'Auto Complete'"
          [attr.aria-autocomplete]="'list'"
          [attr.aria-expanded]="overlayVisible()"
          (input)="onInput($event)"
          (focus)="onFocus($event)"
          (blur)="onBlur()"
          (keydown)="onKeyDown($event)"
          class="gp-inputtext"
        />

        @if (dropdown) {
          <button
            type="button"
            class="gp-autocomplete-dropdown-btn"
            aria-label="Open suggestions"
            (click)="toggleDropdown($event)"
          >
            <gp-icon name="chevron-down" size="0.85em" />
          </button>
        }
      </div>

      @if (overlayVisible() && suggestions && suggestions.length > 0) {
        <div class="gp-select-overlay gp-autocomplete-overlay" role="listbox" (click)="$event.stopPropagation()">
          <ul class="gp-select-items">
            @for (item of suggestions; track $index) {
              <li
                class="gp-select-item"
                [class.gp-select-item-selected]="$index === activeIndex()"
                role="option"
                (click)="selectItem(item, $event)"
              >
                <span>{{ getItemLabel(item) }}</span>
              </li>
            }
          </ul>
        </div>
      }
    </div>
  `,
  styles: [`
    .gp-autocomplete {
      position: relative;
      display: inline-block;
      width: 100%;
    }
    .gp-autocomplete-dropdown-btn {
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      width: 2.25rem;
      background: var(--gp-surface-section);
      border: 1px solid var(--gp-input-border);
      border-left: none;
      border-top-right-radius: var(--gp-border-radius);
      border-bottom-right-radius: var(--gp-border-radius);
      color: var(--gp-text-color-secondary);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .gp-autocomplete-dropdown-btn:hover {
      background: var(--gp-surface-hover);
    }
  `]
})
export class GpAutoCompleteComponent implements ControlValueAccessor {
  @Input() inputId = UniqueId.generate('ac_');
  @Input() suggestions: any[] = [];
  @Input() field = '';
  @Input() placeholder = '';
  @Input() minLength = 1;
  @Input() dropdown = false;
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() invalid = false;
  @Input() ariaLabel = '';

  @Output() completeMethod = new EventEmitter<GpAutoCompleteCompleteEvent>();
  @Output() onSelect = new EventEmitter<{ value: any; originalEvent: Event }>();

  protected value = signal<any>(null);
  protected overlayVisible = signal<boolean>(false);
  protected activeIndex = signal<number>(-1);
  protected query = signal<string>('');

  private onChangeCallback: (value: any) => void = () => {};
  private onTouchedCallback: () => void = () => {};

  constructor(private el: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.overlayVisible.set(false);
    }
  }

  public getItemLabel(item: any): string {
    if (item == null) return '';
    if (typeof item === 'string') return item;
    if (this.field) return ObjectUtils.resolveFieldData(item, this.field);
    return item.label || item.name || String(item);
  }

  protected inputDisplayValue = computed(() => {
    const val = this.value();
    if (val == null) return this.query();
    return this.getItemLabel(val);
  });

  public writeValue(value: any): void {
    this.value.set(value);
    this.query.set(this.getItemLabel(value));
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

  protected onInput(event: Event): void {
    const q = (event.target as HTMLInputElement).value;
    this.query.set(q);
    this.value.set(q);
    this.onChangeCallback(q);

    if (q.length >= this.minLength) {
      this.completeMethod.emit({ originalEvent: event, query: q });
      this.overlayVisible.set(true);
    } else {
      this.overlayVisible.set(false);
    }
  }

  protected onFocus(event: FocusEvent): void {
    if (this.dropdown && !this.query()) {
      this.completeMethod.emit({ originalEvent: event, query: '' });
      this.overlayVisible.set(true);
    }
  }

  protected onBlur(): void {
    this.onTouchedCallback();
  }

  public toggleDropdown(event: MouseEvent): void {
    event.stopPropagation();
    if (this.disabled) return;
    if (!this.overlayVisible()) {
      this.completeMethod.emit({ originalEvent: event, query: this.query() });
      this.overlayVisible.set(true);
    } else {
      this.overlayVisible.set(false);
    }
  }

  public selectItem(item: any, event: MouseEvent): void {
    this.value.set(item);
    this.query.set(this.getItemLabel(item));
    this.onChangeCallback(item);
    this.onTouchedCallback();
    this.onSelect.emit({ value: item, originalEvent: event });
    this.overlayVisible.set(false);
  }

  protected onKeyDown(event: KeyboardEvent): void {
    if (!this.overlayVisible() || !this.suggestions.length) return;

    if (event.key === 'ArrowDown') {
      this.activeIndex.update(i => (i + 1) % this.suggestions.length);
      event.preventDefault();
    } else if (event.key === 'ArrowUp') {
      this.activeIndex.update(i => (i <= 0 ? this.suggestions.length - 1 : i - 1));
      event.preventDefault();
    } else if (event.key === 'Enter') {
      const idx = this.activeIndex();
      if (idx >= 0 && idx < this.suggestions.length) {
        this.selectItem(this.suggestions[idx], event as any);
        event.preventDefault();
      }
    } else if (event.key === 'Escape') {
      this.overlayVisible.set(false);
    }
  }
}
