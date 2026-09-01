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
  OnInit,
  WritableSignal,
  TemplateRef,
  contentChild,
  effect,
  viewChild,
  inject,
  Type
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { Observable, Subscription, isObservable } from 'rxjs';
import { GpIconComponent } from '../../../icons/icon.component';
import { UniqueId } from '../../../utils/unique-id';
import { ObjectUtils } from '../../../utils/object-utils';
import { GpDialogService } from '../../../services/dialog.service';
import { GpDynamicDialogConfig } from '../../../services/dialog.interface';

export interface GpAutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

export interface GpAutoCompleteAdvancedSearchEvent {
  query: string;
  originalEvent?: Event;
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
export class GpAutoCompleteComponent
  extends GpEditableBaseComponent
  implements ControlValueAccessor, OnInit, OnDestroy
{
  public inputId = input<string>(UniqueId.generate('ac_'));
  public suggestions = input<any[]>([]);
  public field = input<string>('');
  public minLength = input<number>(1);
  public minCharacters = input<number | undefined>(undefined);
  public debounce = input<number>(250);
  public delay = input<number | undefined>(undefined);
  public minLengthSignal = input<WritableSignal<boolean> | undefined>(undefined);
  public minLengthHitSignal = input<WritableSignal<boolean> | undefined>(undefined);
  public dropdown = input<boolean>(false);
  public multiple = input<boolean>(false);
  public unique = input<boolean>(true);
  public showClear = input<boolean>(false);
  public emptyMessage = input<string>('No results found');

  /** Advanced Search / Modal Dialog Support */
  public showAdvancedSearch = input<boolean>(false);
  public showAdvancedSearchButton = input<boolean>(false);
  public hasMore = input<boolean>(false);
  public totalResults = input<number | undefined>(undefined);
  public advancedSearchLabel = input<string>('Advanced Search...');
  public searchDialogComponent = input<Type<any> | undefined>(undefined);
  public searchDialogConfig = input<GpDynamicDialogConfig | undefined>(undefined);
  public searchDialogHandler = input<((query: string) => Observable<any | any[]>) | undefined>(undefined);

  /** External selection stream / Observable for dialogs & subscriptions */
  public externalSelection = input<Observable<any | any[]> | undefined>(undefined);

  /** Template slots */
  public itemTemplate = input<TemplateRef<any> | undefined>(undefined);
  public headerTemplate = input<TemplateRef<any> | undefined>(undefined);
  public footerTemplate = input<TemplateRef<any> | undefined>(undefined);
  public emptyTemplate = input<TemplateRef<any> | undefined>(undefined);
  public chipTemplate = input<TemplateRef<any> | undefined>(undefined);

  public contentChildItem = contentChild<TemplateRef<any>>('item');
  public contentChildHeader = contentChild<TemplateRef<any>>('header');
  public contentChildFooter = contentChild<TemplateRef<any>>('footer');
  public contentChildEmpty = contentChild<TemplateRef<any>>('empty');
  public contentChildChip = contentChild<TemplateRef<any>>('chip');

  public effectiveItemTemplate = computed(() => this.itemTemplate() || this.contentChildItem());
  public effectiveHeaderTemplate = computed(() => this.headerTemplate() || this.contentChildHeader());
  public effectiveFooterTemplate = computed(() => this.footerTemplate() || this.contentChildFooter());
  public effectiveEmptyTemplate = computed(() => this.emptyTemplate() || this.contentChildEmpty());
  public effectiveChipTemplate = computed(() => this.chipTemplate() || this.contentChildChip());

  public completeMethod = output<GpAutoCompleteCompleteEvent>();
  public onSelect = output<{ value: any; originalEvent?: Event }>();
  public onUnselect = output<{ value: any; originalEvent?: Event }>();
  public onClear = output<void>();
  public onAdvancedSearch = output<GpAutoCompleteAdvancedSearchEvent>();
  public onMinLengthHit = output<boolean>();
  public minLengthChange = output<boolean>();

  public overlayVisible = signal<boolean>(false);
  public activeIndex = signal<number>(-1);
  public query = signal<string>('');
  public selectedItems = signal<any[]>([]);

  private nativeInputRef = viewChild<ElementRef<HTMLInputElement>>('nativeInput');
  private dialogService = inject(GpDialogService, { optional: true });

  private debounceTimer: any = null;
  private externalSub: Subscription | null = null;

  public get effectiveMinLength(): number {
    return this.minCharacters() ?? this.minLength();
  }

  public get effectiveDebounce(): number {
    return this.delay() ?? this.debounce();
  }

  public isMinLengthMet = computed(() => (this.query() || '').length >= this.effectiveMinLength);
  public minLengthHit = computed(() => (this.query() || '').length >= this.effectiveMinLength);

  public showAdvancedSearchRow = computed(
    () => this.showAdvancedSearch() || this.hasMore() || (this.totalResults() ?? 0) > (this.suggestions()?.length || 0)
  );

  constructor(private hostElRef: ElementRef) {
    super();

    // Setup reactive effect to handle externalSelection Observable
    effect(() => {
      const stream = this.externalSelection();
      this.cleanupExternalSub();

      if (stream && isObservable(stream)) {
        this.externalSub = stream.subscribe({
          next: (value: any) => {
            if (value !== null && value !== undefined) {
              this.appendSelection(value);
            }
          },
          error: (err) => console.error('[GpAutoComplete] Error in externalSelection stream:', err)
        });
      }
    });
  }

  public override ngOnInit(): void {
    super.ngOnInit();
  }

  public override ngOnDestroy(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    this.cleanupExternalSub();
    super.ngOnDestroy();
  }

  private cleanupExternalSub(): void {
    if (this.externalSub) {
      this.externalSub.unsubscribe();
      this.externalSub = null;
    }
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
    if (this.multiple()) {
      return this.query();
    }
    const val = this.internalValue();
    if (val == null) {
      return this.query();
    }
    return this.getItemLabel(val);
  });

  public override writeValue(value: any): void {
    if (this.multiple()) {
      const items = Array.isArray(value) ? value : value ? [value] : [];
      this.selectedItems.set([...items]);
      this.internalValue.set(this.selectedItems() as any);
      this.query.set('');
    } else {
      this.internalValue.set(value);
      const label = this.getItemLabel(value);
      this.query.set(label);
      this.updateMinLengthState(label.length >= this.effectiveMinLength);
    }
  }

  /**
   * Appends an item or array of items (e.g. from an external search dialog / subscription).
   */
  public appendSelection(items: any | any[]): void {
    if (items === null || items === undefined) {
      return;
    }

    if (this.multiple()) {
      const listToAdd = Array.isArray(items) ? items : [items];
      const current = [...this.selectedItems()];

      for (const item of listToAdd) {
        if (this.unique()) {
          const exists = current.some((existing) => this.areItemsEqual(existing, item));
          if (!exists) {
            current.push(item);
            this.onSelect.emit({ value: item });
          }
        } else {
          current.push(item);
          this.onSelect.emit({ value: item });
        }
      }

      this.selectedItems.set(current);
      this.updateValue(current as any);
      this.query.set('');
    } else {
      const singleItem = Array.isArray(items) ? items[0] : items;
      if (singleItem !== undefined) {
        this.selectItem(singleItem);
      }
    }
  }

  /**
   * Compares two items for equality.
   */
  public areItemsEqual(a: any, b: any): boolean {
    if (a === b) {
      return true;
    }
    if (a == null || b == null) {
      return false;
    }
    const fieldKey = this.field();
    if (fieldKey && typeof a === 'object' && typeof b === 'object') {
      return ObjectUtils.resolveFieldData(a, fieldKey) === ObjectUtils.resolveFieldData(b, fieldKey);
    }
    if (typeof a === 'object' && typeof b === 'object') {
      if (a.id !== undefined && b.id !== undefined) {
        return a.id === b.id;
      }
      if (a.value !== undefined && b.value !== undefined) {
        return a.value === b.value;
      }
    }
    return false;
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

    if (!this.multiple()) {
      this.updateValue(q);
    }

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

  public selectItem(item: any, event?: Event): void {
    if (this.multiple()) {
      this.appendSelection(item);
    } else {
      this.updateValue(item);
      const label = this.getItemLabel(item);
      this.query.set(label);
      this.updateMinLengthState(label.length >= this.effectiveMinLength);
      this.handleControlBlur();
      this.onSelect.emit({ value: item, originalEvent: event });
    }
    this.overlayVisible.set(false);
  }

  public removeMultipleItem(item: any, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    if (this.isEffectivelyDisabled() || this.readonly()) {
      return;
    }

    const filtered = this.selectedItems().filter((existing) => !this.areItemsEqual(existing, item));
    this.selectedItems.set(filtered);
    this.updateValue(filtered as any);
    this.onUnselect.emit({ value: item, originalEvent: event });
    this.focusInput();
  }

  public clear(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    if (this.isEffectivelyDisabled() || this.readonly()) {
      return;
    }

    if (this.multiple()) {
      this.selectedItems.set([]);
      this.updateValue([]);
    } else {
      this.updateValue(null);
    }
    this.query.set('');
    this.updateMinLengthState(false);
    this.onClear.emit();
    this.overlayVisible.set(false);
    this.focusInput();
  }

  public triggerAdvancedSearch(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.overlayVisible.set(false);

    const q = this.query();
    this.onAdvancedSearch.emit({ query: q, originalEvent: event });

    // Automatic GpDialogService popup if searchDialogComponent is provided
    const dialogComp = this.searchDialogComponent();
    if (dialogComp && this.dialogService) {
      const config: GpDynamicDialogConfig = {
        header: this.advancedSearchLabel() || 'Advanced Search',
        data: { query: q, multiple: this.multiple() },
        width: '42rem',
        ...this.searchDialogConfig()
      };
      const dialogRef = this.dialogService.open(dialogComp, config);
      dialogRef.onClose.subscribe((result: any) => {
        if (result !== undefined && result !== null) {
          this.appendSelection(result);
        }
      });
    }

    // Automatic searchDialogHandler execution if provided
    const handler = this.searchDialogHandler();
    if (handler) {
      const stream$ = handler(q);
      if (stream$ && isObservable(stream$)) {
        stream$.subscribe((result: any) => {
          if (result !== undefined && result !== null) {
            this.appendSelection(result);
          }
        });
      }
    }
  }

  public focusInput(): void {
    const inputEl = this.nativeInputRef()?.nativeElement;
    if (inputEl) {
      inputEl.focus();
    }
  }

  protected onContainerClick(event: MouseEvent): void {
    this.focusInput();
  }

  protected onKeyDown(event: KeyboardEvent): void {
    const suggs = this.suggestions();

    // Backspace in multiple mode with empty query removes last chip
    if (event.key === 'Backspace' && this.multiple() && !this.query() && this.selectedItems().length > 0) {
      const items = this.selectedItems();
      const lastItem = items[items.length - 1];
      this.removeMultipleItem(lastItem, event);
      return;
    }

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
        this.selectItem(suggs[idx], event);
        event.preventDefault();
      }
    } else if (event.key === 'Escape') {
      this.overlayVisible.set(false);
    }
  }
}
