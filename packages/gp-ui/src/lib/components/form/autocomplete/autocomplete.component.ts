import { GpEditableBaseComponent } from '../../../base/gp-editable-base.component';
import {
  Component,
  input,
  output,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  forwardRef,
  signal,
  computed,
  ElementRef,
  HostListener,
  OnDestroy,
  WritableSignal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { GpIconComponent } from '../../../icons/icon.component';
import { UniqueId } from '../../../utils/unique-id';
import { ObjectUtils } from '../../../utils/object-utils';

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
export class GpAutoCompleteComponent extends GpEditableBaseComponent implements ControlValueAccessor, OnDestroy {
  public inputId = input<string>(UniqueId.generate('ac_'));
  public suggestions = input<any[]>([]);
  public field = input<string>('');
  public minLength = input<number>(3);
  public minCharacters = input<number | undefined>(undefined);
  public debounce = input<number>(250);
  public delay = input<number | undefined>(undefined);
  public minLengthSignal = input<WritableSignal<boolean> | undefined>(undefined);
  public minLengthHitSignal = input<WritableSignal<boolean> | undefined>(undefined);
  public dropdown = input<boolean>(false);

  public completeMethod = output<GpAutoCompleteCompleteEvent>();
  public onSelect = output<{ value: any; originalEvent: Event }>();
  public onMinLengthHit = output<boolean>();
  public minLengthChange = output<boolean>();

  protected overlayVisible = signal<boolean>(false);
  protected activeIndex = signal<number>(-1);
  protected query = signal<string>('');

  private debounceTimer: any = null;

  public get effectiveMinLength(): number {
    return this.minCharacters() ?? this.minLength();
  }

  public get effectiveDebounce(): number {
    return this.delay() ?? this.debounce();
  }

  public isMinLengthMet = computed(() => (this.query() || '').length >= this.effectiveMinLength);
  public minLengthHit = computed(() => (this.query() || '').length >= this.effectiveMinLength);

  constructor(private hostElRef: ElementRef) {
    super();
  }

  public override ngOnDestroy(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    super.ngOnDestroy();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.hostElRef.nativeElement.contains(event.target)) {
      this.overlayVisible.set(false);
    }
  }

  public getItemLabel(item: any): string {
    if (item == null) {
      return '';
    }
    if (typeof item === 'string') {
      return item;
    }
    const fieldKey = this.field();
    if (fieldKey) {
      return ObjectUtils.resolveFieldData(item, fieldKey);
    }
    return item.label || item.name || String(item);
  }

  protected inputDisplayValue = computed(() => {
    const val = this.internalValue();
    if (val == null) {
      return this.query();
    }
    return this.getItemLabel(val);
  });

  public override writeValue(value: any): void {
    this.internalValue.set(value);
    const label = this.getItemLabel(value);
    this.query.set(label);
    this.updateMinLengthState(label.length >= this.effectiveMinLength);
  }

  public override registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  public override registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  private updateMinLengthState(isHit: boolean): void {
    const sig1 = this.minLengthSignal();
    if (sig1) {
      sig1.set(isHit);
    }
    const sig2 = this.minLengthHitSignal();
    if (sig2) {
      sig2.set(isHit);
    }
    this.onMinLengthHit.emit(isHit);
    this.minLengthChange.emit(isHit);
  }

  protected onInput(event: Event): void {
    const q = (event.target as HTMLInputElement).value;
    this.query.set(q);
    this.updateValue(q);

    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }

    const minLengthMet = q.length >= this.effectiveMinLength;
    this.updateMinLengthState(minLengthMet);

    if (minLengthMet) {
      this.debounceTimer = setTimeout(() => {
        this.completeMethod.emit({ originalEvent: event, query: q });
        this.overlayVisible.set(true);
      }, this.effectiveDebounce);
    } else {
      this.overlayVisible.set(false);
    }
  }

  protected onFocus(event: FocusEvent): void {
    if (this.dropdown() && !this.query()) {
      this.completeMethod.emit({ originalEvent: event, query: '' });
      this.overlayVisible.set(true);
    }
  }

  protected onBlur(): void {
    this.handleControlBlur();
  }

  public toggleDropdown(event: MouseEvent): void {
    event.stopPropagation();
    if (this.isEffectivelyDisabled() || this.readonly()) {
      return;
    }
    if (!this.overlayVisible()) {
      this.completeMethod.emit({ originalEvent: event, query: this.query() });
      this.overlayVisible.set(true);
    } else {
      this.overlayVisible.set(false);
    }
  }

  public selectItem(item: any, event: MouseEvent): void {
    this.updateValue(item);
    const label = this.getItemLabel(item);
    this.query.set(label);
    this.updateMinLengthState(label.length >= this.effectiveMinLength);
    this.handleControlBlur();
    this.onSelect.emit({ value: item, originalEvent: event });
    this.overlayVisible.set(false);
  }

  protected onKeyDown(event: KeyboardEvent): void {
    const suggs = this.suggestions();
    if (!this.overlayVisible() || !suggs || !suggs.length) {
      return;
    }

    if (event.key === 'ArrowDown') {
      this.activeIndex.update((i) => (i + 1) % suggs.length);
      event.preventDefault();
    } else if (event.key === 'ArrowUp') {
      this.activeIndex.update((i) => (i <= 0 ? suggs.length - 1 : i - 1));
      event.preventDefault();
    } else if (event.key === 'Enter') {
      const idx = this.activeIndex();
      if (idx >= 0 && idx < suggs.length) {
        this.selectItem(suggs[idx], event as any);
        event.preventDefault();
      }
    } else if (event.key === 'Escape') {
      this.overlayVisible.set(false);
    }
  }
}
