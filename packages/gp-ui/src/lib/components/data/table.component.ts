import { Component, Input, Output, EventEmitter, ContentChildren, QueryList, ChangeDetectionStrategy, ViewEncapsulation, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GpIconComponent } from '../../icons/icon.component';
import { GpColumnComponent } from './column.component';
import { GpPaginatorComponent, GpPageState } from './paginator.component';
import { GpCheckboxComponent } from '../form/checkbox.component';
import { GpRadioButtonComponent } from '../form/radio-button.component';
import { ObjectUtils } from '../../utils/object-utils';
import { GpTranslationService } from '../../config/gp-config.service';

export type GpSelectionMode = 'single' | 'multiple' | null;

@Component({
  selector: 'gp-table',
  standalone: true,
  imports: [CommonModule, FormsModule, GpIconComponent, GpPaginatorComponent, GpCheckboxComponent, GpRadioButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div
      class="gp-datatable"
      [class.gp-datatable-striped]="stripedRows"
      [class.gp-datatable-gridlines]="showGridlines"
      [class.gp-datatable-sm]="size === 'sm'"
      [class.gp-datatable-lg]="size === 'lg'"
    >
      <!-- Global Search / Header Slot -->
      @if (globalFilterFields.length > 0 || captionTemplate) {
        <div class="gp-datatable-header">
          <ng-content select="[caption]" />
          @if (globalFilterFields.length > 0) {
            <div class="gp-datatable-global-filter">
              <input
                type="text"
                class="gp-inputtext"
                [placeholder]="globalFilterPlaceholder"
                [value]="globalFilterText()"
                (input)="onGlobalFilterInput($event)"
                aria-label="Global search table"
              />
              <gp-icon name="search" size="0.85em" class="gp-datatable-search-icon" />
            </div>
          }
        </div>
      }

      <div class="gp-datatable-wrapper" [style.max-height]="scrollHeight">
        <table class="gp-datatable-table" role="table">
          <thead class="gp-datatable-thead">
            <tr role="row">
              @if (rowExpansion) {
                <th class="gp-datatable-expander-header" scope="col"></th>
              }
              @if (selectionMode === 'multiple') {
                <th class="gp-datatable-selection-header" scope="col">
                  <gp-checkbox
                    [binary]="true"
                    [value]="isAllSelected()"
                    (onChange)="toggleSelectAll()"
                  />
                </th>
              } @else if (selectionMode === 'single') {
                <th class="gp-datatable-selection-header" scope="col"></th>
              }

              @for (col of columns; track col.field || $index) {
                <th
                  class="gp-datatable-th"
                  [class.gp-datatable-sortable]="col.sortable"
                  [class.gp-datatable-sorted]="sortField() === col.field"
                  [style.width]="col.width || null"
                  [style.text-align]="col.align"
                  (click)="col.sortable ? sort(col.field) : null"
                  scope="col"
                >
                  <div class="gp-datatable-header-content">
                    @if (col.headerTemplate) {
                      <ng-container *ngTemplateOutlet="col.headerTemplate; context: { $implicit: col }" />
                    } @else {
                      <span class="gp-datatable-column-title">{{ col.header }}</span>
                    }

                    @if (col.sortable) {
                      <span class="gp-datatable-sort-icon">
                        @if (sortField() === col.field) {
                          <gp-icon [name]="sortOrder() === 1 ? 'sort-up' : 'sort-down'" size="0.85em" />
                        } @else {
                          <gp-icon name="sort-alt" size="0.85em" />
                        }
                      </span>
                    }
                  </div>
                </th>
              }
            </tr>
          </thead>

          <tbody class="gp-datatable-tbody" role="rowgroup">
            @for (row of displayedRows(); track rowTrackBy(row, $index)) {
              <tr
                class="gp-datatable-row"
                [class.gp-datatable-row-selected]="isRowSelected(row)"
                (click)="onRowClick(row, $event)"
                role="row"
              >
                @if (rowExpansion) {
                  <td class="gp-datatable-expander-cell">
                    <button
                      type="button"
                      class="gp-datatable-expander-btn"
                      (click)="toggleRowExpansion(row, $event)"
                      aria-label="Expand row"
                    >
                      <gp-icon [name]="isRowExpanded(row) ? 'chevron-down' : 'chevron-right'" size="0.75em" />
                    </button>
                  </td>
                }
                @if (selectionMode === 'multiple') {
                  <td class="gp-datatable-selection-cell" (click)="$event.stopPropagation()">
                    <gp-checkbox
                      [binary]="true"
                      [value]="isRowSelected(row)"
                      (onChange)="toggleRowSelection(row)"
                    />
                  </td>
                } @else if (selectionMode === 'single') {
                  <td class="gp-datatable-selection-cell" (click)="$event.stopPropagation()">
                    <gp-radio-button
                      [value]="row"
                      [name]="'gp-table-rb'"
                      (onClickEvent)="selectSingleRow(row)"
                    />
                  </td>
                }

                @for (col of columns; track col.field || $index) {
                  <td class="gp-datatable-td" [style.text-align]="col.align" role="cell">
                    @if (col.bodyTemplate) {
                      <ng-container *ngTemplateOutlet="col.bodyTemplate; context: { $implicit: row, column: col }" />
                    } @else {
                      {{ resolveFieldData(row, col.field) }}
                    }
                  </td>
                }
              </tr>

              @if (rowExpansion && isRowExpanded(row)) {
                <tr class="gp-datatable-row-expansion">
                  <td [attr.colspan]="totalColumnsCount()">
                    <ng-content select="[rowexpansion]" />
                  </td>
                </tr>
              }
            } @empty {
              <tr class="gp-datatable-empty-row">
                <td [attr.colspan]="totalColumnsCount()" class="gp-datatable-empty-message">
                  {{ translationService.get('emptyMessage') }}
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      @if (paginator) {
        <gp-paginator
          [totalRecords]="totalRecordsCount()"
          [rows]="rows"
          [first]="first()"
          [rowsPerPageOptions]="rowsPerPageOptions"
          (onPageChange)="onPaginationChange($event)"
        />
      }
    </div>
  `,
  styles: [`
    .gp-datatable {
      position: relative;
      background: var(--gp-surface-card);
      border: 1px solid var(--gp-surface-border);
      border-radius: var(--gp-border-radius);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      width: 100%;
    }
    .gp-datatable-header {
      padding: 0.75rem 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--gp-surface-border);
      background: var(--gp-surface-card);
    }
    .gp-datatable-global-filter {
      position: relative;
      width: 16rem;
    }
    .gp-datatable-global-filter .gp-inputtext {
      padding-right: 2rem;
      height: 2.25rem;
    }
    .gp-datatable-search-icon {
      position: absolute;
      right: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--gp-text-color-muted);
    }
    .gp-datatable-wrapper {
      overflow-x: auto;
      width: 100%;
    }
    .gp-datatable-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }
    .gp-datatable-thead tr th {
      background: var(--gp-surface-section);
      color: var(--gp-text-color);
      font-weight: 600;
      font-size: var(--gp-font-size-sm);
      padding: 0.75rem 1rem;
      border-bottom: 1px solid var(--gp-surface-border);
      user-select: none;
    }
    .gp-datatable-sortable {
      cursor: pointer;
      transition: background var(--gp-transition-duration);
    }
    .gp-datatable-sortable:hover {
      background: var(--gp-surface-hover);
    }
    .gp-datatable-sorted {
      color: var(--gp-primary);
    }
    .gp-datatable-header-content {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .gp-datatable-sort-icon {
      color: var(--gp-text-color-muted);
    }
    .gp-datatable-sorted .gp-datatable-sort-icon {
      color: var(--gp-primary);
    }
    .gp-datatable-tbody tr {
      background: var(--gp-surface-card);
      border-bottom: 1px solid var(--gp-surface-border);
      transition: background var(--gp-transition-duration);
    }
    .gp-datatable-tbody tr:hover {
      background: var(--gp-surface-hover);
    }
    .gp-datatable-tbody td {
      padding: 0.75rem 1rem;
      font-size: var(--gp-font-size-sm);
      color: var(--gp-text-color);
    }
    .gp-datatable-striped .gp-datatable-tbody tr:nth-child(even) {
      background: var(--gp-surface-ground);
    }
    .gp-datatable-gridlines .gp-datatable-th,
    .gp-datatable-gridlines .gp-datatable-td {
      border: 1px solid var(--gp-surface-border);
    }
    .gp-datatable-sm .gp-datatable-th, .gp-datatable-sm .gp-datatable-td {
      padding: 0.4rem 0.6rem;
      font-size: var(--gp-font-size-xs);
    }
    .gp-datatable-lg .gp-datatable-th, .gp-datatable-lg .gp-datatable-td {
      padding: 1.1rem 1.5rem;
      font-size: var(--gp-font-size-base);
    }
    .gp-datatable-row-selected {
      background: var(--gp-primary-light) !important;
      color: var(--gp-primary);
    }
    .gp-datatable-expander-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--gp-text-color-secondary);
      padding: 0.25rem;
      display: inline-flex;
    }
    .gp-datatable-empty-message {
      padding: 2rem 1rem;
      text-align: center;
      color: var(--gp-text-color-muted);
    }
  `]
})
export class GpTableComponent {
  protected translationService = inject(GpTranslationService);

  @ContentChildren(GpColumnComponent) columns!: QueryList<GpColumnComponent>;

  @Input() value: any[] = [];
  @Input() paginator = false;
  @Input() rows = 10;
  @Input() rowsPerPageOptions: number[] = [5, 10, 25, 50];
  @Input() stripedRows = false;
  @Input() showGridlines = false;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() scrollHeight = '';
  @Input() selectionMode: GpSelectionMode = null;
  @Input() selection: any = null;
  @Input() dataKey = 'id';
  @Input() rowExpansion = false;
  @Input() globalFilterFields: string[] = [];
  @Input() globalFilterPlaceholder = 'Global search...';
  @Input() captionTemplate?: any;

  @Output() selectionChange = new EventEmitter<any>();
  @Output() onRowSelect = new EventEmitter<{ data: any; originalEvent: Event }>();
  @Output() onRowUnselect = new EventEmitter<{ data: any; originalEvent: Event }>();
  @Output() onSort = new EventEmitter<{ field: string; order: number }>();
  @Output() onPage = new EventEmitter<GpPageState>();

  protected sortField = signal<string>('');
  protected sortOrder = signal<number>(1);
  protected first = signal<number>(0);
  protected globalFilterText = signal<string>('');
  protected expandedRows = signal<Set<any>>(new Set());

  public resolveFieldData(data: any, field: string): any {
    return ObjectUtils.resolveFieldData(data, field);
  }

  public rowTrackBy(row: any, index: number): any {
    return this.dataKey ? (row[this.dataKey] ?? index) : index;
  }

  protected filteredRows = computed<any[]>(() => {
    let rows = this.value || [];
    const q = this.globalFilterText().toLowerCase().trim();
    if (q && this.globalFilterFields.length > 0) {
      rows = rows.filter(row => {
        return this.globalFilterFields.some(field => {
          const val = this.resolveFieldData(row, field);
          return val != null && String(val).toLowerCase().includes(q);
        });
      });
    }
    return rows;
  });

  protected sortedRows = computed<any[]>(() => {
    let rows = [...this.filteredRows()];
    const field = this.sortField();
    const order = this.sortOrder();

    if (field) {
      rows.sort((a, b) => {
        const val1 = this.resolveFieldData(a, field);
        const val2 = this.resolveFieldData(b, field);
        if (val1 == null && val2 != null) return -1 * order;
        if (val1 != null && val2 == null) return 1 * order;
        if (val1 == null && val2 == null) return 0;
        if (typeof val1 === 'string' && typeof val2 === 'string') {
          return val1.localeCompare(val2) * order;
        }
        return (val1 < val2 ? -1 : val1 > val2 ? 1 : 0) * order;
      });
    }
    return rows;
  });

  protected displayedRows = computed<any[]>(() => {
    const rows = this.sortedRows();
    if (!this.paginator) return rows;
    const start = this.first();
    return rows.slice(start, start + this.rows);
  });

  protected totalRecordsCount = computed(() => this.filteredRows().length);

  protected totalColumnsCount = computed(() => {
    let count = (this.columns ? this.columns.length : 0);
    if (this.rowExpansion) count++;
    if (this.selectionMode) count++;
    return count;
  });

  public sort(field: string): void {
    let nextOrder = 1;
    if (this.sortField() === field) {
      nextOrder = this.sortOrder() === 1 ? -1 : 1;
    }
    this.sortField.set(field);
    this.sortOrder.set(nextOrder);
    this.onSort.emit({ field, order: nextOrder });
  }

  public isRowSelected(row: any): boolean {
    if (!this.selection) return false;
    if (this.selectionMode === 'single') {
      return ObjectUtils.equals(this.selection, row, this.dataKey);
    }
    if (this.selectionMode === 'multiple' && Array.isArray(this.selection)) {
      return this.selection.some(r => ObjectUtils.equals(r, row, this.dataKey));
    }
    return false;
  }

  public isAllSelected(): boolean {
    const rows = this.displayedRows();
    if (!rows.length || !Array.isArray(this.selection)) return false;
    return rows.every(r => this.isRowSelected(r));
  }

  public toggleSelectAll(): void {
    const rows = this.displayedRows();
    let next: any[];
    if (this.isAllSelected()) {
      next = (this.selection || []).filter((sel: any) => !rows.some(r => ObjectUtils.equals(r, sel, this.dataKey)));
    } else {
      const current = Array.isArray(this.selection) ? this.selection : [];
      const newItems = rows.filter(r => !this.isRowSelected(r));
      next = [...current, ...newItems];
    }
    this.selection = next;
    this.selectionChange.emit(next);
  }

  public toggleRowSelection(row: any): void {
    let current = Array.isArray(this.selection) ? [...this.selection] : [];
    if (this.isRowSelected(row)) {
      current = current.filter(r => !ObjectUtils.equals(r, row, this.dataKey));
      this.onRowUnselect.emit({ data: row, originalEvent: new CustomEvent('unselect') });
    } else {
      current.push(row);
      this.onRowSelect.emit({ data: row, originalEvent: new CustomEvent('select') });
    }
    this.selection = current;
    this.selectionChange.emit(current);
  }

  public selectSingleRow(row: any): void {
    this.selection = row;
    this.selectionChange.emit(row);
    this.onRowSelect.emit({ data: row, originalEvent: new CustomEvent('select') });
  }

  public onRowClick(row: any, event: MouseEvent): void {
    if (this.selectionMode === 'single') {
      this.selectSingleRow(row);
    }
  }

  public isRowExpanded(row: any): boolean {
    return this.expandedRows().has(row);
  }

  public toggleRowExpansion(row: any, event: MouseEvent): void {
    event.stopPropagation();
    const set = new Set(this.expandedRows());
    if (set.has(row)) {
      set.delete(row);
    } else {
      set.add(row);
    }
    this.expandedRows.set(set);
  }

  public onPaginationChange(state: GpPageState): void {
    this.first.set(state.first);
    this.rows = state.rows;
    this.onPage.emit(state);
  }

  protected onGlobalFilterInput(event: Event): void {
    const q = (event.target as HTMLInputElement).value;
    this.globalFilterText.set(q);
    this.first.set(0);
  }

  /**
   * Export Table Data to CSV
   */
  public exportCSV(filename = 'export.csv'): void {
    const rows = this.sortedRows();
    const cols = this.columns.toArray();
    let csv = cols.map(c => `"${c.header}"`).join(',') + '\r\n';

    rows.forEach(r => {
      const line = cols.map(c => `"${this.resolveFieldData(r, c.field) ?? ''}"`).join(',');
      csv += line + '\r\n';
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.click();
  }
}
