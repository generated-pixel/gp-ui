import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { GpAnalyticsComponent } from '../../base/gp-analytics-component';
import { GpDataEngineService } from '../../../services/data-engine.service';
import { GpLocaleFormatterService } from '../../../services/locale-formatter.service';
import { GpMeasureQuery } from '../../../models/query.model';

import { FormsModule } from '@angular/forms';
import { GpBlockUI, GpButton, GpInputTextDirective, GpSelect } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-list-report',
  standalone: true,
  imports: [FormsModule, GpButton, GpInputTextDirective, GpSelect, GpBlockUI],
  templateUrl: './list-report.html',
  styleUrl: './list-report.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GpListReport extends GpAnalyticsComponent {
  protected readonly engine = inject(GpDataEngineService);
  protected readonly localeFormatter = inject(GpLocaleFormatterService);

  readonly title = input<string>('Simple List Report');
  readonly subtitle = input<string>('Flat list of data records with no aggregation or grouping');
  readonly records = input<Record<string, any>[]>([]);
  readonly dimensions = input<string[]>([]);
  readonly measures = input<GpMeasureQuery[]>([]);

  readonly searchQuery = input<string>('');
  readonly pageSize = input<number>(10);
  readonly showHeaders = input<boolean>(true);

  readonly pageSizeOptions = [
    { label: '5 per page', value: 5 },
    { label: '10 per page', value: 10 },
    { label: '25 per page', value: 25 },
    { label: 'All rows', value: 999999 }
  ];

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
   * Computed list of rows filtered by the active search query.
   */
  readonly filteredRows = computed(() => {
    const raw = this.records();
    if (!raw || raw.length === 0) {
      return [];
    }

    const q = this.searchQuery().trim().toLowerCase();
    if (!q) {
      return raw;
    }
    
    return raw.filter((row) =>
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
    const raw = this.filteredRows();
    if (!raw || raw.length === 0) {
      return [];
    }
    
    const pageSize = this.pageSize();
    const start = 0; // For list reports, we start from the beginning
    return raw.slice(start, start + pageSize);
  });

  /**
   * Formats a header string by replacing underscores/dashes with spaces and capitalizing words.
   */
  private formatHeader(str: string): string {
    return str.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  }

  /**
   * Formats a cell value for display.
   */
  formatCellValue(col: { key: string; isMeasure: boolean }, val: any): string {
    if (val == null) {
      return '—';
    }
    if (col.isMeasure && typeof val === 'number') {
      return this.localeFormatter.formatNumber(val);
    }
    return String(val);
  }

  /**
   * Formats a grand total value for display.
   */
  formatGrandTotal(val: any): string {
    if (val == null) {
      return '—';
    }
    if (typeof val === 'number') {
      return this.localeFormatter.formatNumber(val);
    }
    return String(val);
  }
}