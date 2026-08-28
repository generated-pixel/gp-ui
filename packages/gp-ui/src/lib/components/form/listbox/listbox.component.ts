import {
  Component,
  input,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  forwardRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { GpIconComponent } from '../../../icons/icon.component';
import { GpSelectBaseComponent, GpSelectItem } from '../../../base/gp-select-base.component';
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
export class GpListboxComponent extends GpSelectBaseComponent<any> implements ControlValueAccessor {
  public multiple = input<boolean>(false);
  public override filter = input<boolean>(true);

  public isSelected(opt: GpSelectItem): boolean {
    const current = this.internalValue();
    if (this.multiple()) {
      return Array.isArray(current) && current.some((v) => ObjectUtils.equals(v, opt.value));
    }
    return ObjectUtils.equals(current, opt.value);
  }

  public override writeValue(value: any): void {
    this.internalValue.set(value);
  }

  public onOptionClick(opt: GpSelectItem, event: MouseEvent): void {
    if (this.isEffectivelyDisabled() || this.readonly() || opt.disabled) {
      return;
    }

    let next: any;
    if (this.multiple()) {
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
}
