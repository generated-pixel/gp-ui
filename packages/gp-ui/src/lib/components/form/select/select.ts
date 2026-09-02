import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  forwardRef,
  computed,
  contentChild,
  TemplateRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { GpIcon } from '../../../icons/icon';
import { ObjectUtils } from '../../../utils/object-utils';
import { GpSelectBase, GpSelectItem } from '../../../base/gp-select-base';
import { GpAppendToDirective } from '../../../overlay/append-to.directive';

export { GpSelectItem };

@Component({
  selector: 'gp-select',
  standalone: true,
  imports: [CommonModule, FormsModule, GpIcon, GpAppendToDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GpSelect),
      multi: true
    }
  ],
  templateUrl: './select.html',
  styleUrl: './select.scss'
})
export class GpSelect extends GpSelectBase<any> implements ControlValueAccessor {
  public itemTemplate = contentChild<TemplateRef<any>>('item');

  public selectedItem = computed<GpSelectItem | undefined>(() => {
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

  public selectItem(opt: GpSelectItem, event: MouseEvent): void {
    if (opt.disabled) {
      return;
    }
    this.updateValue(opt.value);
    this.handleControlBlur();
    this.onChange.emit({ value: opt.value, originalEvent: event });
    this.hideOverlay();
  }

  public clear(event: MouseEvent): void {
    this.clearSelection(event);
  }

  public onKeyDown(event: KeyboardEvent): void {
    if (this.isEffectivelyDisabled()) {
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggleOverlay();
    } else if (event.key === 'Escape') {
      this.hideOverlay();
    }
  }
}
