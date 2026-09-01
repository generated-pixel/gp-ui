import { GpBaseComponent } from '../../../base/gp-base.component';
import {
  Component,
  input,
  model,
  output,
  contentChildren,
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
export class GpTableComponent extends GpBaseComponent {
  protected translationService = inject(GpTranslationService);

  public columns = contentChildren(GpColumnComponent);

  public value = input<any[]>([]);
  public paginator = input<boolean>(false);
  public rows = model<number>(10);
  public rowsPerPageOptions = input<number[]>([5, 10, 25, 50]);
  public stripedRows = input<boolean>(false);
  public showGridlines = input<boolean>(false);
  public size = input<'sm' | 'md' | 'lg'>('md');
  public scrollHeight = input<string>('');
  public selectionMode = input<GpSelectionMode>(null);
  public selection = model<any>(null);
  public dataKey = input<string>('id');
  public rowExpansion = input<boolean>(false);
  public globalFilterFields = input<string[]>([]);
  public globalFilterPlaceholder = input<string>('Global search...');
  public captionTemplate = input<any>(undefined);

  public onRowSelect = output<{ data: any; originalEvent: Event }>();
  public onRowUnselect = output<{ data: any; originalEvent: Event }>();
  public onSort = output<{ field: string; order: number }>();
  public onPage = output<GpPageState>();

  protected sortField = signal<string>('');
  protected sortOrder = signal<number>(1);
  protected first = signal<number>(0);
  protected globalFilterText = signal<string>('');
  protected expandedRows = signal<Set<any>>(new Set());

  public resolveFieldData(data: any, field: string): any {
    return ObjectUtils.resolveFieldData(data, field);
  }

  public rowTrackBy(row: any, index: number): any {
    const key = this.dataKey();
    return key ? (row[key] ?? index) : index;
  }

  protected filteredRows = computed<any[]>(() => {
    let rows = this.value() || [];
    const q = this.globalFilterText().toLowerCase().trim();
    const fields = this.globalFilterFields();
    if (q && fields.length > 0) {
      rows = rows.filter((row) => {
        return fields.some((field) => {
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
        if (val1 == null && val2 != null) {
          return -1 * order;
        }
        if (val1 != null && val2 == null) {
          return 1 * order;
        }
        if (val1 == null && val2 == null) {
          return 0;
        }
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
    if (!this.paginator()) {
      return rows;
    }
    const start = this.first();
    return rows.slice(start, start + this.rows());
  });

  protected totalRecordsCount = computed(() => this.filteredRows().length);

  protected totalColumnsCount = computed(() => {
    let count = this.columns() ? this.columns().length : 0;
    if (this.rowExpansion()) {
      count++;
    }
    if (this.selectionMode()) {
      count++;
    }
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
    const sel = this.selection();
    if (!sel) {
      return false;
    }
    const mode = this.selectionMode();
    const key = this.dataKey();
    if (mode === 'single') {
      return ObjectUtils.equals(sel, row, key);
    }
    if (mode === 'multiple' && Array.isArray(sel)) {
      return sel.some((r) => ObjectUtils.equals(r, row, key));
    }
    return false;
  }

  public isAllSelected(): boolean {
    const rows = this.displayedRows();
    const sel = this.selection();
    if (!rows.length || !Array.isArray(sel)) {
      return false;
    }
    return rows.every((r) => this.isRowSelected(r));
  }

  public toggleSelectAll(): void {
    const rows = this.displayedRows();
    const sel = this.selection();
    const key = this.dataKey();
    let next: any[];
    if (this.isAllSelected()) {
      next = (sel || []).filter((s: any) => !rows.some((r) => ObjectUtils.equals(r, s, key)));
    } else {
      const current = Array.isArray(sel) ? sel : [];
      const newItems = rows.filter((r) => !this.isRowSelected(r));
      next = [...current, ...newItems];
    }
    this.selection.set(next);
  }

  public toggleRowSelection(row: any): void {
    const sel = this.selection();
    const key = this.dataKey();
    let current = Array.isArray(sel) ? [...sel] : [];
    if (this.isRowSelected(row)) {
      current = current.filter((r) => !ObjectUtils.equals(r, row, key));
      this.onRowUnselect.emit({ data: row, originalEvent: new CustomEvent('unselect') });
    } else {
      current.push(row);
      this.onRowSelect.emit({ data: row, originalEvent: new CustomEvent('select') });
    }
    this.selection.set(current);
  }

  public selectSingleRow(row: any): void {
    this.selection.set(row);
    this.onRowSelect.emit({ data: row, originalEvent: new CustomEvent('select') });
  }

  public onRowClick(row: any, event: MouseEvent): void {
    if (this.selectionMode() === 'single') {
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
    this.rows.set(state.rows);
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
    const cols = this.columns();
    let csv = cols.map((c) => `"${c.header()}"`).join(',') + '\r\n';

    rows.forEach((r) => {
      const line = cols.map((c) => `"${this.resolveFieldData(r, c.field()) ?? ''}"`).join(',');
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
