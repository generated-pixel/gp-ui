import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { GpAnalyticsComponent } from '../base/gp-analytics-component';
import { GpDataEngineService } from '../../services/data-engine.service';
import { GpAnalyticalQuerySpec, GpMeasureQuery } from '../../models/query.model';

import { FormsModule } from '@angular/forms';
import { GpButton, GpInputTextDirective, GpSelect, GpTag } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-tabular-report',
  standalone: true,
  imports: [FormsModule, GpButton, GpInputTextDirective, GpSelect, GpTag],
  templateUrl: './tabular-report.html',
  styleUrl: './tabular-report.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GpTabularReport extends GpAnalyticsComponent {
  protected readonly engine = inject(GpDataEngineService);

  readonly title = input<string>('Tabular Analytical Report');
  readonly subtitle = input<string>('Aggregated enterprise reporting with subtotal rollups');
  readonly records = input<Record<string, any>[]>([]);
  readonly dimensions = input<string[]>([]);
  readonly measures = input<GpMeasureQuery[]>([]);
  readonly showSubtotals = input<boolean>(true);
  readonly showGrandTotal = input<boolean>(true);

  readonly searchQuery = signal<string>('');
  readonly currentPage = signal<number>(1);
  readonly pageSize = signal<number>(10);
  readonly pageSizeOptions = [
    { label: '5 per page', value: 5 },
    { label: '10 per page', value: 10 },
    { label: '25 per page', value: 25 },
    { label: 'All rows', value: 999999 }
  ];

  protected readonly sortColumn = signal<string | null>(null);
  protected readonly sortOrder = signal<'asc' | 'desc'>('desc');
  protected readonly Math = Math;

  /**
   * Computed column metadata.
   */
  readonly columns = computed(() => {
    const cols: { key: string; header: string; isDimension: boolean; isMeasure: boolean }[] = [];

    for (const dim of this.dimensions()) {
      cols.push({
        key: dim,
        header: this.formatHeader(dim),
        isDimension: true,
        isMeasure: false
      });
    }

    for (const m of this.measures()) {
      const key = m.alias || `${m.fieldId}_${m.aggregation}`;
      cols.push({
        key,
        header: `${this.formatHeader(m.fieldId)} (${m.aggregation.toUpperCase()})`,
        isDimension: false,
        isMeasure: true
      });
    }

    return cols;
  });

  /**
   * Computed analytical query execution result.
   */
  readonly queryResult = computed(() => {
    const raw = this.records();
    if (!raw || raw.length === 0) {
      return null;
    }

    const sorts = this.sortColumn() ? [{ fieldId: this.sortColumn()!, order: this.sortOrder() }] : undefined;

    const spec: GpAnalyticalQuerySpec = {
      dimensions: this.dimensions(),
      measures: this.measures(),
      sorts
    };

    return this.engine.executeQuery(raw, spec);
  });

  /**
   * Computed list of rows filtered by the active search query.
   */
  readonly filteredRows = computed(() => {
    const res = this.queryResult();
    if (!res) return [];
    const q = this.searchQuery().trim().toLowerCase();
    if (!q) return res.rows;
    return res.rows.filter((row) =>
      this.columns().some((col) =>
        String(row[col.key] ?? '')
          .toLowerCase()
          .includes(q)
      )
    );
  });

  /**
   * Computed total number of pages based on filtered records.
   */
  readonly totalPages = computed(() => {
    const total = this.filteredRows().length;
    return Math.max(1, Math.ceil(total / this.pageSize()));
  });

  /**
   * Computed rows for the active page.
   */
  readonly paginatedRows = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filteredRows().slice(start, start + this.pageSize());
  });

  goToPage(page: number): void {
    const clamped = Math.max(1, Math.min(page, this.totalPages()));
    this.currentPage.set(clamped);
  }

  setPageSize(size: number): void {
    this.pageSize.set(size);
    this.currentPage.set(1);
  }

  protected onSort(columnKey: string): void {
    if (this.sortColumn() === columnKey) {
      this.sortOrder.update((o) => (o === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortColumn.set(columnKey);
      this.sortOrder.set('desc');
    }
  }

  protected exportToCsv(): void {
    const res = this.queryResult();
    if (!res || res.rows.length === 0) return;

    const cols = this.columns();
    const headers = cols.map((c) => `"${c.header}"`).join(',');
    const rows = res.rows.map((row) => {
      return cols.map((c) => `"${row[c.key] ?? ''}"`).join(',');
    });

    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${this.title().toLowerCase().replace(/\s+/g, '_')}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private formatHeader(str: string): string {
    return str.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  }
}
