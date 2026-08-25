import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation, forwardRef, signal, computed, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { GpIconComponent } from '../../icons/icon.component';
import { UniqueId } from '../../utils/unique-id';
import { ObjectUtils } from '../../utils/object-utils';

export interface GpCascadeSelectItem {
  name: string;
  code?: string;
  items?: GpCascadeSelectItem[];
  [key: string]: any;
}

@Component({
  selector: 'gp-cascade-select',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GpCascadeSelectComponent),
      multi: true
    }
  ],
  template: `
    <div
      class="gp-select gp-cascade-select"
      [class.gp-select-open]="overlayVisible()"
      [class.gp-select-disabled]="disabled"
      (click)="toggleOverlay()"
      tabindex="0"
      role="combobox"
      [attr.aria-expanded]="overlayVisible()"
      [attr.aria-label]="ariaLabel || placeholder || 'Cascade Select'"
    >
      <div class="gp-select-label-container">
        <span class="gp-select-label" [class.gp-select-placeholder]="!selectedLabel()">
          {{ selectedLabel() || placeholder }}
        </span>
      </div>

      <div class="gp-select-triggers">
        <gp-icon [name]="overlayVisible() ? 'chevron-up' : 'chevron-down'" size="0.85em" class="gp-select-arrow" />
      </div>

      @if (overlayVisible()) {
        <div class="gp-select-overlay gp-cascade-select-overlay" (click)="$event.stopPropagation()">
          <div class="gp-cascade-select-panels">
            <ul class="gp-select-items gp-cascade-panel">
              @for (item of options; track $index) {
                <li
                  class="gp-select-item gp-cascade-item"
                  [class.gp-select-item-selected]="item === activeItemLevel1()"
                  (mouseenter)="onLevel1Hover(item)"
                  (click)="onItemClick(item, 1)"
                >
                  <span>{{ item[optionLabel] }}</span>
                  @if (item[optionGroupChildren] && item[optionGroupChildren].length > 0) {
                    <gp-icon name="chevron-right" size="0.75em" />
                  }
                </li>
              }
            </ul>

            @if (activeItemLevel1() && activeItemLevel1()?.[optionGroupChildren]?.length) {
              <ul class="gp-select-items gp-cascade-panel">
                @for (sub of activeItemLevel1()![optionGroupChildren]; track $index) {
                  <li
                    class="gp-select-item gp-cascade-item"
                    [class.gp-select-item-selected]="sub === activeItemLevel2()"
                    (mouseenter)="onLevel2Hover(sub)"
                    (click)="onItemClick(sub, 2)"
                  >
                    <span>{{ sub[optionLabel] }}</span>
                    @if (sub[optionGroupChildren] && sub[optionGroupChildren].length > 0) {
                      <gp-icon name="chevron-right" size="0.75em" />
                    }
                  </li>
                }
              </ul>
            }

            @if (activeItemLevel2() && activeItemLevel2()?.[optionGroupChildren]?.length) {
              <ul class="gp-select-items gp-cascade-panel">
                @for (sub2 of activeItemLevel2()![optionGroupChildren]; track $index) {
                  <li
                    class="gp-select-item gp-cascade-item"
                    (click)="onItemClick(sub2, 3)"
                  >
                    <span>{{ sub2[optionLabel] }}</span>
                  </li>
                }
              </ul>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .gp-cascade-select-overlay {
      width: auto !important;
      min-width: 14rem;
    }
    .gp-cascade-select-panels {
      display: flex;
    }
    .gp-cascade-panel {
      min-width: 12rem;
      border-right: 1px solid var(--gp-surface-divider);
    }
    .gp-cascade-panel:last-child {
      border-right: none;
    }
    .gp-cascade-item {
      justify-content: space-between;
    }
  `]
})
export class GpCascadeSelectComponent implements ControlValueAccessor {
  @Input() options: any[] = [];
  @Input() optionLabel = 'name';
  @Input() optionValue = 'code';
  @Input() optionGroupChildren = 'items';
  @Input() placeholder = 'Select item';
  @Input() disabled = false;
  @Input() ariaLabel = '';

  @Output() onChange = new EventEmitter<{ value: any }>();

  protected value = signal<any>(null);
  protected overlayVisible = signal<boolean>(false);
  protected activeItemLevel1 = signal<any>(null);
  protected activeItemLevel2 = signal<any>(null);

  private onChangeCallback: (value: any) => void = () => {};
  private onTouchedCallback: () => void = () => {};

  constructor(private el: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.overlayVisible.set(false);
    }
  }

  protected selectedLabel = computed(() => {
    const val = this.value();
    if (!val) return '';
    return typeof val === 'object' ? val[this.optionLabel] : String(val);
  });

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

  public toggleOverlay(): void {
    if (this.disabled) return;
    this.overlayVisible.update(v => !v);
  }

  public onLevel1Hover(item: any): void {
    this.activeItemLevel1.set(item);
    this.activeItemLevel2.set(null);
  }

  public onLevel2Hover(item: any): void {
    this.activeItemLevel2.set(item);
  }

  public onItemClick(item: any, level: number): void {
    const children = item[this.optionGroupChildren];
    if (!children || children.length === 0) {
      const val = this.optionValue ? item[this.optionValue] || item : item;
      this.value.set(val);
      this.onChangeCallback(val);
      this.onTouchedCallback();
      this.onChange.emit({ value: val });
      this.overlayVisible.set(false);
    }
  }
}
