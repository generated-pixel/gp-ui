import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  GeneratedReport,
  ReportColumn,
  ReportDataPoint,
  ReportRow,
} from '../../models/designer.models';
import { ReportGeneratorService } from '../../services/report-generator.service';

@Component({
  selector: 'gp-report-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './report-viewer.html',
  styleUrl: './report-viewer.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GpReportViewer {
  private readonly generator = inject(ReportGeneratorService);

  readonly report = input.required<GeneratedReport>();
  readonly showToolbar = input<boolean>(true);

  readonly exportCsv = output<void>();
  readonly exportJson = output<void>();

  // Active sorting state
  protected readonly sortColumnKey = signal<string | null>(null);
  protected readonly sortDirection = signal<'asc' | 'desc'>('asc');

  // Sorted rows
  protected readonly displayedRows = computed<ReportRow[]>(() => {
    const rep = this.report();
    const rows = [...rep.rows];
    const key = this.sortColumnKey();
    const dir = this.sortDirection();

    if (!key) return rows;

    return rows.sort((a, b) => {
      const valA = a[key];
      const valB = b[key];
      if (typeof valA === 'number' && typeof valB === 'number') {
        return dir === 'asc' ? valA - valB : valB - valA;
      }
      return dir === 'asc'
        ? String(valA ?? '').localeCompare(String(valB ?? ''))
        : String(valB ?? '').localeCompare(String(valA ?? ''));
    });
  });

  // KPI primary point
  protected readonly primaryPoint = computed<ReportDataPoint | undefined>(() => {
    return this.report().dataPoints[0];
  });

  // Maximum value for bar graph scaling
  protected readonly maxDataPointValue = computed<number>(() => {
    const values = this.report().dataPoints.map((p) => Number(p.value) || 0);
    return values.length > 0 ? Math.max(...values, 1) : 100;
  });

  protected getBarPercentage(value: unknown): number {
    const num = typeof value === 'number' ? value : Number(value);
    const max = this.maxDataPointValue();
    if (!num || isNaN(num) || max <= 0) return 4;
    return Math.min(Math.max((num / max) * 100, 4), 100);
  }

  protected formatCellValue(row: ReportRow, col: ReportColumn): string {
    const val = row[col.key];
    return this.generator.formatValue(val, col.format);
  }

  protected toggleSort(colKey: string): void {
    if (this.sortColumnKey() === colKey) {
      if (this.sortDirection() === 'asc') {
        this.sortDirection.set('desc');
      } else {
        this.sortColumnKey.set(null);
        this.sortDirection.set('asc');
      }
    } else {
      this.sortColumnKey.set(colKey);
      this.sortDirection.set('asc');
    }
  }

  protected onExportCsv(): void {
    const csv = this.generator.exportToCsv(this.report());
    this.generator.downloadFile(csv, `${this.report().title.toLowerCase().replace(/\s+/g, '-')}.csv`, 'text/csv');
    this.exportCsv.emit();
  }

  protected onExportJson(): void {
    const json = this.generator.exportToJson(this.report());
    this.generator.downloadFile(json, `${this.report().title.toLowerCase().replace(/\s+/g, '-')}.json`, 'application/json');
    this.exportJson.emit();
  }
}
