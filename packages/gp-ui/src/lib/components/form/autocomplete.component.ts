import { GpEditableBaseComponent } from '../../base/gp-editable-base.component';
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
  templateUrl: './autocomplete.component.html',
  styleUrl: './autocomplete.component.scss'
})
export class GpAutoCompleteComponent extends GpEditableBaseComponent implements ControlValueAccessor {
  @Input() inputId = UniqueId.generate('ac_');
  @Input() suggestions: any[] = [];
  @Input() field = '';
  @Input() override placeholder = '';
  @Input() minLength = 1;
  @Input() dropdown = false;
  @Input() override disabled = false;
  @Input() override readonly = false;
  @Input() override invalid = false;
  @Input() override ariaLabel = '';

  @Output() completeMethod = new EventEmitter<GpAutoCompleteCompleteEvent>();
  @Output() onSelect = new EventEmitter<{ value: any; originalEvent: Event }>();

  protected overlayVisible = signal<boolean>(false);
  protected activeIndex = signal<number>(-1);
  protected query = signal<string>('');

  constructor(private hostElRef: ElementRef) {
    super();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.hostElRef.nativeElement.contains(event.target)) {
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
    const val = this.internalValue();
    if (val == null) return this.query();
    return this.getItemLabel(val);
  });

  public override writeValue(value: any): void {
    this.value = value;
    this.internalValue.set(value);
    this.query.set(this.getItemLabel(value));
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

  protected onInput(event: Event): void {
    const q = (event.target as HTMLInputElement).value;
    this.query.set(q);
    this.updateValue(q);

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
    this.handleControlBlur();
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
    this.updateValue(item);
    this.query.set(this.getItemLabel(item));
    this.handleControlBlur();
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
