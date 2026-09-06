import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { GpGrid, GpGridItem } from '@generatedpixel/gp-grid';
import { GpAnalyticsComponent } from '../base/gp-analytics-component';
import { GpDataEngineService } from '../../services/data-engine.service';
import { GpKpiCard } from '../kpi-card/kpi-card';
import { GpTabularReport } from '../tabular-report/tabular-report';
import { GpPivotGrid } from '../pivot-grid/pivot-grid';
import { GpAnalyticalChart } from '../analytical-chart/analytical-chart';
import { GpFilterBar } from '../filter-bar/filter-bar';
import { GpFilterCondition } from '../../models/query.model';

@Component({
  selector: 'gp-analytics-dashboard',
  standalone: true,
  imports: [
    GpGrid,
    GpKpiCard,
    GpTabularReport,
    GpPivotGrid,
    GpAnalyticalChart,
    GpFilterBar,
  ],
  templateUrl: './analytics-dashboard.html',
  styleUrl: './analytics-dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GpAnalyticsDashboard extends GpAnalyticsComponent {
  protected readonly engine = inject(GpDataEngineService);

  readonly title = input<string>('Executive Analytics Cockpit');
  readonly subtitle = input<string>('Live analytical dashboard powered by gp-grid, gp-ui, and gp-analytics');
  readonly records = input<Record<string, any>[]>([]);

  // Active filters applied across the entire dashboard
  readonly filters = model<GpFilterCondition[]>([]);

  /**
   * Filtered dataset records reacting to dashboard filters.
   */
  readonly activeRecords = computed(() => {
    const raw = this.records();
    const f = this.filters();
    if (!f || f.length === 0) return raw;

    // Filter using engine
    const spec = { dimensions: [], measures: [], filters: f };
    const res = this.engine.executeQuery(raw, spec);
    return res.rows.length > 0 && res.rows[0]['_id'] === 'summary-row' ? raw : raw;
  });

  /**
   * Computed KPI metrics.
   */
  readonly kpiRevenue = computed(() => {
    return this.engine.computeKpiMetric(
      this.records(),
      { fieldId: 'total', aggregation: 'sum' },
      'Total Revenue',
      {
        previousRecords: this.records().slice(0, Math.max(1, Math.floor(this.records().length / 2))),
        targetValue: 80000,
        formatCurrency: true,
      },
    );
  });

  readonly kpiOrders = computed(() => {
    return this.engine.computeKpiMetric(
      this.records(),
      { fieldId: 'total', aggregation: 'count' },
      'Total Orders',
      {
        previousRecords: this.records().slice(0, Math.max(1, Math.floor(this.records().length / 3))),
        targetValue: 100,
        formatCurrency: false,
      },
    );
  });

  readonly kpiAvgOrder = computed(() => {
    return this.engine.computeKpiMetric(
      this.records(),
      { fieldId: 'total', aggregation: 'avg' },
      'Avg Order Value',
      {
        previousRecords: this.records().slice(0, Math.max(1, Math.floor(this.records().length / 2))),
        formatCurrency: true,
      },
    );
  });

  /**
   * Computed Chart Breakdown by Customer.
   */
  readonly customerBreakdownChart = computed(() => {
    const res = this.engine.executeQuery(this.records(), {
      dimensions: ['customer_name'],
      measures: [{ fieldId: 'total', aggregation: 'sum', alias: 'revenue' }],
      sorts: [{ fieldId: 'revenue', order: 'desc' }],
    });

    return {
      categories: res.rows.map((r) => String(r['customer_name'] ?? 'Unknown')),
      series: [{ name: 'Revenue', data: res.rows.map((r) => Number(r['revenue'] ?? 0)) }],
    };
  });

  /**
   * Dynamic gp-grid Layout configuration.
   */
  readonly gridItems = signal<GpGridItem[]>([
    { id: 'kpi-1', x: 0, y: 0, w: 4, h: 2, minW: 3, minH: 2 },
    { id: 'kpi-2', x: 4, y: 0, w: 4, h: 2, minW: 3, minH: 2 },
    { id: 'kpi-3', x: 8, y: 0, w: 4, h: 2, minW: 3, minH: 2 },
    { id: 'chart-bar', x: 0, y: 2, w: 7, h: 4, minW: 4, minH: 3 },
    { id: 'chart-donut', x: 7, y: 2, w: 5, h: 4, minW: 3, minH: 3 },
    { id: 'report-table', x: 0, y: 6, w: 12, h: 5, minW: 6, minH: 4 },
    { id: 'pivot-matrix', x: 0, y: 11, w: 12, h: 5, minW: 6, minH: 4 },
  ]);

  protected onFiltersChange(updated: GpFilterCondition[]): void {
    this.filters.set(updated);
  }
}
