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
  computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { GpIconComponent } from '../../../icons/icon.component';
import { GpSelectItem } from '../select/select.component';
import { ObjectUtils } from '../../../utils/object-utils';

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
  templateUrl: './listbox.component.html',
  styleUrl: './listbox.component.scss'
})
export class GpListboxComponent extends GpEditableBaseComponent implements ControlValueAccessor {
  @Input() options: (GpSelectItem | any)[] = [];
  @Input() multiple = false;
  @Input() filter = true;
  @Input() filterPlaceholder = 'Search...';
  @Input() emptyFilterMessage = 'No results found';
  @Input() override disabled = false;

  @Output() onChange = new EventEmitter<{ value: any; originalEvent: Event }>();

  protected filterText = signal<string>('');

  protected normalizedOptions = computed<GpSelectItem[]>(() => {
    return (this.options || []).map((opt) => {
      if (typeof opt === 'object' && opt !== null) {
        if ('value' in opt && 'label' in opt) return opt as GpSelectItem;
        return {
          label: String(opt.label || opt.name || opt),
          value: opt.value ?? opt,
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
    return this.normalizedOptions().filter((opt) => (opt.label || '').toLowerCase().includes(q));
  });

  public isSelected(opt: GpSelectItem): boolean {
    const current = this.internalValue();
    if (this.multiple) {
      return Array.isArray(current) && current.some((v) => ObjectUtils.equals(v, opt.value));
    }
    return ObjectUtils.equals(current, opt.value);
  }

  public override writeValue(value: any): void {
    this.value = value;
    this.internalValue.set(value);
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

  public onOptionClick(opt: GpSelectItem, event: MouseEvent): void {
    if (this.disabled || opt.disabled) return;

    let next: any;
    if (this.multiple) {
      const current = Array.isArray(this.internalValue()) ? (this.internalValue() as any[]) : [];
      if (this.isSelected(opt)) {
        next = current.filter((v: any) => !ObjectUtils.equals(v, opt.value));
      } else {
        next = [...current, opt.value];
      }
    } else {
      next = opt.value;
    }

    this.updateValue(next);
    this.handleControlBlur();
    this.onChange.emit({ value: next, originalEvent: event });
  }

  protected onFilterInput(event: Event): void {
    this.filterText.set((event.target as HTMLInputElement).value);
  }
}
