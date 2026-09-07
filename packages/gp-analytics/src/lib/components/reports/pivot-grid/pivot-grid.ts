import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { GpAnalyticsComponent } from '../../base/gp-analytics-component';
import { GpDataEngineService } from '../../../services/data-engine.service';
import { GpLocaleFormatterService } from '../../../services/locale-formatter.service';
import { GpMeasureQuery, GpPivotMatrix } from '../../../models/query.model';

import { FormsModule } from '@angular/forms';
import { GpButton, GpProgressSpinner, GpSelect } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-pivot-grid',
  standalone: true,
  imports: [FormsModule, GpButton, GpSelect, GpProgressSpinner],
  templateUrl: './pivot-grid.html',
  styleUrl: './pivot-grid.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GpPivotGrid extends GpAnalyticsComponent {
  protected readonly engine = inject(GpDataEngineService);
  protected readonly localeFormatter = inject(GpLocaleFormatterService);

  readonly title = input<string>('Dynamic Pivot Matrix');
  readonly records = input<Record<string, any>[]>([]);
  readonly rowDimension = input<string>('');
  readonly colDimension = input<string>('');
  readonly measure = input<GpMeasureQuery>({ fieldId: 'total', aggregation: 'sum' });

  readonly heatmapMode = signal<'primary' | 'emerald' | 'amber' | 'none'>('primary');
  readonly heatmapOptions = [
    { label: 'Heatmap: Primary', value: 'primary' },
    { label: 'Heatmap: Emerald', value: 'emerald' },
    { label: 'Heatmap: Amber', value: 'amber' },
    { label: 'No Heatmap', value: 'none' }
  ];

  // Interactive axis override
  protected readonly activeRowDim = signal<string | null>(null);
  protected readonly activeColDim = signal<string | null>(null);

  readonly effectiveRowDim = computed(() => this.activeRowDim() ?? this.rowDimension());
  readonly effectiveColDim = computed(() => this.activeColDim() ?? this.colDimension());

  /**
   * Computed 2D Pivot Matrix.
   */
  readonly pivotMatrix = computed<GpPivotMatrix | null>(() => {
    const data = this.records();
    const rDim = this.effectiveRowDim();
    const cDim = this.effectiveColDim();

    if (!data || data.length === 0 || !rDim || !cDim) {
      return null;
    }

    return this.engine.buildPivotMatrix(data, rDim, cDim, this.measure());
  });

  /**
   * Computes max cell value for relative heatmap background shading.
   */
  readonly maxCellValue = computed<number>(() => {
    const p = this.pivotMatrix();
    if (!p) return 1;

    let max = 0;
    for (const row of p.matrix) {
      for (const val of row) {
        if (typeof val === 'number' && val > max) {
          max = val;
        }
      }
    }
    return max === 0 ? 1 : max;
  });

  swapAxes(): void {
    const currentR = this.effectiveRowDim();
    const currentC = this.effectiveColDim();
    this.activeRowDim.set(currentC);
    this.activeColDim.set(currentR);
  }

  getCellOpacity(val: number | string | null): number {
    if (typeof val !== 'number' || val <= 0) return 0;
    const ratio = val / this.maxCellValue();
    return Math.max(0.08, Math.min(0.7, ratio * 0.7));
  }

  getCellBg(val: number | string | null): string {
    const mode = this.heatmapMode();
    if (mode === 'none' || typeof val !== 'number' || val <= 0) return 'transparent';
    const percent = Math.round(this.getCellOpacity(val) * 100);

    switch (mode) {
      case 'emerald':
        return `color-mix(in srgb, #059669 ${percent}%, transparent)`;
      case 'amber':
        return `color-mix(in srgb, #d97706 ${percent}%, transparent)`;
      case 'primary':
      default:
        return `color-mix(in srgb, var(--gp-color-primary, #4f46e5) ${percent}%, transparent)`;
    }
  }

  exportToCsv(): void {
    const p = this.pivotMatrix();
    if (!p) return;

    const csvLines: string[] = [];
    const rDim = this.effectiveRowDim();
    const cDim = this.effectiveColDim();

    // 1. Header line
    const headerLine = [`"${rDim} \\ ${cDim}"`, ...p.colHeaders.map((c) => `"${c}"`), '"Total"'].join(',');
    csvLines.push(headerLine);

    // 2. Data rows
    for (let r = 0; r < p.rowHeaders.length; r++) {
      const rowLabel = `"${p.rowHeaders[r]}"`;
      const cellValues = p.matrix[r].map((v) => (v != null ? String(v) : '""'));
      const rowTotal = p.rowTotals[r] != null ? String(p.rowTotals[r]) : '""';
      csvLines.push([rowLabel, ...cellValues, rowTotal].join(','));
    }

    // 3. Column Totals / Grand Total row
    const colTotals: (number | string)[] = [];
    for (let c = 0; c < p.colHeaders.length; c++) {
      let sum = 0;
      let hasVal = false;
      for (let r = 0; r < p.rowHeaders.length; r++) {
        const val = p.matrix[r][c];
        if (typeof val === 'number') {
          sum += val;
          hasVal = true;
        }
      }
      colTotals.push(hasVal ? Number(sum.toFixed(2)) : '""');
    }
    const grandTotalVal = p.grandTotal != null ? String(p.grandTotal) : '""';
    csvLines.push(['"Total"', ...colTotals.map(String), grandTotalVal].join(','));

    const csvContent = csvLines.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pivot_${rDim}_by_${cDim}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  formatCellValue(val: any): string {
    if (val == null) return '—';
    if (typeof val === 'number') {
      return this.localeFormatter.formatNumber(val);
    }
    return String(val);
  }
}
