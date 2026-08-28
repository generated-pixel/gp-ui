import { GpEditableBaseComponent } from '../../../base/gp-editable-base.component';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ContentChildren,
  QueryList,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  signal,
  computed,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GpIconComponent } from '../../../icons/icon.component';
import { GpColumnComponent } from '../column/column.component';
import { GpPaginatorComponent, GpPageState } from '../paginator/paginator.component';
import { GpCheckboxComponent } from '../../form/checkbox/checkbox.component';
import { GpRadioButtonComponent } from '../../form/radio-button/radio-button.component';
import { GpInputTextComponent } from '../../form/input-text/input-text.component';
import { ObjectUtils } from '../../../utils/object-utils';
import { GpTranslationService } from '../../../config/gp-config.service';

export type GpSelectionMode = 'single' | 'multiple' | null;

@Component({
  selector: 'gp-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    GpIconComponent,
    GpPaginatorComponent,
    GpCheckboxComponent,
    GpRadioButtonComponent,
    GpInputTextComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class GpTableComponent extends GpEditableBaseComponent {
  protected translationService = inject(GpTranslationService);

  @ContentChildren(GpColumnComponent) columns!: QueryList<GpColumnComponent>;

  @Input() override value: any[] = [];
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
      rows = rows.filter((row) => {
        return this.globalFilterFields.some((field) => {
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
    let count = this.columns ? this.columns.length : 0;
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
      return this.selection.some((r) => ObjectUtils.equals(r, row, this.dataKey));
    }
    return false;
  }

  public isAllSelected(): boolean {
    const rows = this.displayedRows();
    if (!rows.length || !Array.isArray(this.selection)) return false;
    return rows.every((r) => this.isRowSelected(r));
  }

  public toggleSelectAll(): void {
    const rows = this.displayedRows();
    let next: any[];
    if (this.isAllSelected()) {
      next = (this.selection || []).filter((sel: any) => !rows.some((r) => ObjectUtils.equals(r, sel, this.dataKey)));
    } else {
      const current = Array.isArray(this.selection) ? this.selection : [];
      const newItems = rows.filter((r) => !this.isRowSelected(r));
      next = [...current, ...newItems];
    }
    this.selection = next;
    this.selectionChange.emit(next);
  }

  public toggleRowSelection(row: any): void {
    let current = Array.isArray(this.selection) ? [...this.selection] : [];
    if (this.isRowSelected(row)) {
      current = current.filter((r) => !ObjectUtils.equals(r, row, this.dataKey));
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

  public clearGlobalFilter(): void {
    this.globalFilterText.set('');
    this.first.set(0);
  }

  /**
   * Export Table Data to CSV
   */
  public exportCSV(filename = 'export.csv'): void {
    const rows = this.sortedRows();
    const cols = this.columns.toArray();
    let csv = cols.map((c) => `"${c.header}"`).join(',') + '\r\n';

    rows.forEach((r) => {
      const line = cols.map((c) => `"${this.resolveFieldData(r, c.field) ?? ''}"`).join(',');
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
