import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  model,
  output,
  signal
} from '@angular/core';
import { GpGrid, GpGridItem, GpGridChangeEvent } from '@generatedpixel/gp-grid';
import { GpAnalyticsComponent } from '../base/gp-analytics-component';
import { GpDataEngineService } from '../../services/data-engine.service';
import { GpAnalyticsConfigService } from '../../services/analytics-config.service';
import { GpKpiCard } from '../kpi-card/kpi-card';
import { GpTabularReport } from '../tabular-report/tabular-report';
import { GpPivotGrid } from '../pivot-grid/pivot-grid';
import { GpAnalyticalChart } from '../analytical-chart/analytical-chart';
import { GpFilterBar } from '../filter-bar/filter-bar';
import {
  GpFilterCondition,
  GpAnalyticalQuerySpec,
  GpCategoricalChartData,
  GpKpiMetricResult
} from '../../models/query.model';
import {
  GpDashboardConfig,
  GpDashboardWidgetConfig,
  GpKpiWidgetConfig,
  GpChartWidgetConfig,
  GpTableWidgetConfig,
  GpPivotWidgetConfig,
  GpCustomWidgetConfig,
  GpDashboardQuickPreset,
  createDefaultDashboardConfig
} from '../../models/dashboard.model';

@Component({
  selector: 'gp-analytics-dashboard',
  standalone: true,
  imports: [GpGrid, GpKpiCard, GpTabularReport, GpPivotGrid, GpAnalyticalChart, GpFilterBar],
  templateUrl: './analytics-dashboard.html',
  styleUrl: './analytics-dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GpAnalyticsDashboard extends GpAnalyticsComponent {
  protected readonly engine = inject(GpDataEngineService);
  protected readonly analyticsConfig = inject(GpAnalyticsConfigService, { optional: true });

  // Optional dashboard configuration; defaults to default executive layout
  readonly config = input<GpDashboardConfig | null>(null);

  readonly title = input<string>('Executive Analytics Cockpit');
  readonly subtitle = input<string>('Live analytical dashboard powered by gp-grid, gp-ui, and gp-analytics');
  readonly records = input<Record<string, any>[]>([]);

  // Active filters applied across the entire dashboard
  readonly filters = model<GpFilterCondition[]>([]);

  // Designer mode props
  readonly editable = input<boolean>(false);
  readonly selectedWidgetId = input<string | null>(null);

  // Designer events
  readonly widgetSelect = output<GpDashboardWidgetConfig>();
  readonly widgetEdit = output<GpDashboardWidgetConfig>();
  readonly widgetDuplicate = output<GpDashboardWidgetConfig>();
  readonly widgetDelete = output<GpDashboardWidgetConfig>();
  readonly layoutChange = output<GpGridItem[]>();

  /**
   * Resolved effective dashboard configuration.
   */
  readonly effectiveConfig = computed<GpDashboardConfig>(() => {
    const custom = this.config();
    if (custom) return custom;
    return createDefaultDashboardConfig();
  });

  readonly effectiveTitle = computed(() => {
    const c = this.config();
    return c?.title || this.title();
  });

  readonly effectiveSubtitle = computed(() => {
    const c = this.config();
    return c?.subtitle || this.subtitle();
  });

  readonly columns = computed(() => this.effectiveConfig().columns ?? 12);
  readonly rowHeight = computed(() => this.effectiveConfig().rowHeight ?? 95);
  readonly gap = computed(() => this.effectiveConfig().gap ?? 16);
  readonly compactType = computed(() => this.effectiveConfig().compactType ?? 'vertical');

  /**
   * Whether the grid is completely read-only or allows movement/resizing.
   */
  readonly isGridReadonly = computed(() => {
    if (this.editable()) return false;
    const allowMove = this.effectiveConfig().allowMove ?? false;
    const allowResize = this.effectiveConfig().allowResize ?? false;
    return !(allowMove || allowResize);
  });

  /**
   * Available fields for the filter bar.
   */
  readonly filterFields = computed(() => {
    const c = this.effectiveConfig();
    if (c.filterFields && c.filterFields.length > 0) {
      return c.filterFields;
    }
    return [
      { fieldId: 'customer_name', label: 'Customer Name' },
      { fieldId: 'status', label: 'Order Status' },
      { fieldId: 'region', label: 'Sales Region' }
    ];
  });

  readonly quickPresets = computed<GpDashboardQuickPreset[]>(() => {
    return (
      this.effectiveConfig().quickPresets ?? [
        {
          label: 'Completed Orders',
          condition: { fieldId: 'status', operator: 'eq', value: 'Completed' }
        }
      ]
    );
  });

  /**
   * Filtered dataset records reacting to dashboard filters.
   */
  readonly activeRecords = computed(() => {
    const raw = this.records();
    const f = this.filters();
    if (!f || f.length === 0) return raw;
    return this.engine.applyFilters(raw, f);
  });

  /**
   * Dynamic Map of Widgets by ID for fast template access.
   */
  readonly widgetsMap = computed(() => {
    const map = new Map<string, GpDashboardWidgetConfig>();
    for (const w of this.effectiveConfig().widgets) {
      map.set(w.id, w);
    }
    return map;
  });

  /**
   * Dynamic Map of Computed KPI Metrics for all KPI widgets.
   */
  readonly kpiMetricsMap = computed(() => {
    const records = this.activeRecords();
    const map = new Map<string, GpKpiMetricResult>();
    for (const w of this.effectiveConfig().widgets) {
      if (w.type === 'kpi') {
        const kpiWidget = w as GpKpiWidgetConfig;
        const prev = kpiWidget.comparePrevious
          ? records.slice(0, Math.max(1, Math.floor(records.length / 2)))
          : undefined;

        const res = this.engine.computeKpiMetric(records, kpiWidget.measure, kpiWidget.title, {
          previousRecords: prev,
          targetValue: kpiWidget.targetValue,
          formatCurrency: kpiWidget.formatCurrency ?? (kpiWidget.unit === '$' || kpiWidget.unit === 'currency'),
          currencyCode: (kpiWidget as any).currency || this.analyticsConfig?.currency()
        });

        // Override severity if explicitly configured
        if (kpiWidget.severity) {
          res.trendSeverity = kpiWidget.severity;
        }

        map.set(w.id, res);
      }
    }
    return map;
  });

  /**
   * Dynamic Map of Computed Chart Data for all chart widgets.
   */
  readonly chartDataMap = computed(() => {
    const records = this.activeRecords();
    const map = new Map<string, GpCategoricalChartData>();
    for (const w of this.effectiveConfig().widgets) {
      if (w.type === 'chart') {
        const chartWidget = w as GpChartWidgetConfig;
        const measureKey =
          chartWidget.measure.alias || `${chartWidget.measure.fieldId}_${chartWidget.measure.aggregation}`;

        const spec: GpAnalyticalQuerySpec = {
          dimensions: [chartWidget.dimension],
          measures: [chartWidget.measure],
          sorts: chartWidget.sortOrder
            ? [{ fieldId: measureKey, order: chartWidget.sortOrder }]
            : [{ fieldId: measureKey, order: 'desc' }]
        };

        const res = this.engine.executeQuery(records, spec);
        const limit = chartWidget.limit ?? 10;
        const rows = res.rows.slice(0, limit);

        map.set(w.id, {
          categories: rows.map((r) => String(r[chartWidget.dimension] ?? 'Unknown')),
          series: [
            {
              name: chartWidget.title,
              data: rows.map((r) => Number(r[measureKey] ?? 0))
            }
          ]
        });
      }
    }
    return map;
  });

  /**
   * Dynamic gp-grid Layout items synchronized with configuration.
   */
  readonly gridItems = signal<GpGridItem[]>([]);

  constructor() {
    super();
    // Synchronize grid items whenever effectiveConfig changes
    effect(() => {
      const widgets = this.effectiveConfig().widgets;
      const current = this.gridItems();
      const editable = this.editable();
      const defaultMove = editable || (this.effectiveConfig().allowMove ?? false);
      const defaultResize = editable || (this.effectiveConfig().allowResize ?? false);

      const needsUpdate =
        widgets.length !== current.length ||
        widgets.some((w, idx) => {
          const c = current[idx];
          const expectedDraggable = w.grid.draggable !== undefined ? w.grid.draggable : defaultMove;
          const expectedResizable = w.grid.resizable !== undefined ? w.grid.resizable : defaultResize;
          return (
            !c ||
            c.id !== w.id ||
            c.x !== w.grid.x ||
            c.y !== w.grid.y ||
            c.w !== w.grid.w ||
            c.h !== w.grid.h ||
            c.fixed !== (w.grid.fixed ?? false) ||
            c.locked !== (w.grid.locked ?? false) ||
            c.draggable !== expectedDraggable ||
            c.resizable !== expectedResizable
          );
        });

      if (needsUpdate) {
        const items: GpGridItem[] = widgets.map((w) => ({
          id: w.id,
          x: w.grid.x,
          y: w.grid.y,
          w: w.grid.w,
          h: w.grid.h,
          minW: w.grid.minW ?? 3,
          minH: w.grid.minH ?? 2,
          maxW: w.grid.maxW,
          maxH: w.grid.maxH,
          draggable: w.grid.draggable !== undefined ? w.grid.draggable : defaultMove,
          resizable: w.grid.resizable !== undefined ? w.grid.resizable : defaultResize,
          fixed: w.grid.fixed ?? false,
          locked: w.grid.locked ?? false
        }));
        this.gridItems.set(items);
      }
    });
  }

  // Backwards-compatible computed KPI properties for existing tests/consumers
  readonly kpiRevenue = computed(() => {
    const kpi = this.kpiMetricsMap().get('kpi-1');
    if (kpi) return kpi;
    return this.engine.computeKpiMetric(this.records(), { fieldId: 'total', aggregation: 'sum' }, 'Total Revenue', {
      previousRecords: this.records().slice(0, Math.max(1, Math.floor(this.records().length / 2))),
      targetValue: 80000,
      formatCurrency: true
    });
  });

  readonly kpiOrders = computed(() => {
    const kpi = this.kpiMetricsMap().get('kpi-2');
    if (kpi) return kpi;
    return this.engine.computeKpiMetric(this.records(), { fieldId: 'total', aggregation: 'count' }, 'Total Orders', {
      previousRecords: this.records().slice(0, Math.max(1, Math.floor(this.records().length / 3))),
      targetValue: 100,
      formatCurrency: false
    });
  });

  readonly kpiAvgOrder = computed(() => {
    const kpi = this.kpiMetricsMap().get('kpi-3');
    if (kpi) return kpi;
    return this.engine.computeKpiMetric(this.records(), { fieldId: 'total', aggregation: 'avg' }, 'Avg Order Value', {
      previousRecords: this.records().slice(0, Math.max(1, Math.floor(this.records().length / 2))),
      formatCurrency: true
    });
  });

  readonly customerBreakdownChart = computed(() => {
    const chart = this.chartDataMap().get('chart-bar');
    if (chart) return chart;
    const res = this.engine.executeQuery(this.records(), {
      dimensions: ['customer_name'],
      measures: [{ fieldId: 'total', aggregation: 'sum', alias: 'revenue' }],
      sorts: [{ fieldId: 'revenue', order: 'desc' }]
    });
    return {
      categories: res.rows.map((r) => String(r['customer_name'] ?? 'Unknown')),
      series: [{ name: 'Revenue', data: res.rows.map((r) => Number(r['revenue'] ?? 0)) }]
    };
  });

  protected onFiltersChange(updated: GpFilterCondition[]): void {
    this.filters.set(updated);
  }

  protected onLayoutChanged(items: GpGridItem[]): void {
    this.layoutChange.emit(items);
  }

  protected onGridItemChange(event?: GpGridChangeEvent): void {
    if (event?.allItems) {
      this.layoutChange.emit(event.allItems);
    } else {
      this.layoutChange.emit(this.gridItems());
    }
  }

  // Type-safe widget retrieval helpers for the template
  protected getWidget(id: string): GpDashboardWidgetConfig | undefined {
    return this.widgetsMap().get(id);
  }

  protected asKpi(w?: GpDashboardWidgetConfig): GpKpiWidgetConfig | undefined {
    return w?.type === 'kpi' ? (w as GpKpiWidgetConfig) : undefined;
  }

  protected asChart(w?: GpDashboardWidgetConfig): GpChartWidgetConfig | undefined {
    return w?.type === 'chart' ? (w as GpChartWidgetConfig) : undefined;
  }

  protected asTable(w?: GpDashboardWidgetConfig): GpTableWidgetConfig | undefined {
    return w?.type === 'table' ? (w as GpTableWidgetConfig) : undefined;
  }

  protected asPivot(w?: GpDashboardWidgetConfig): GpPivotWidgetConfig | undefined {
    return w?.type === 'pivot' ? (w as GpPivotWidgetConfig) : undefined;
  }

  protected asCustom(w?: GpDashboardWidgetConfig): GpCustomWidgetConfig | undefined {
    return w?.type === 'custom' ? (w as GpCustomWidgetConfig) : undefined;
  }

  protected onSelect(w: GpDashboardWidgetConfig, event: MouseEvent): void {
    if (!this.editable()) return;
    event.stopPropagation();
    this.widgetSelect.emit(w);
  }

  protected onEdit(w: GpDashboardWidgetConfig, event: MouseEvent): void {
    event.stopPropagation();
    this.widgetEdit.emit(w);
  }

  protected onDuplicate(w: GpDashboardWidgetConfig, event: MouseEvent): void {
    event.stopPropagation();
    this.widgetDuplicate.emit(w);
  }

  protected onDelete(w: GpDashboardWidgetConfig, event: MouseEvent): void {
    event.stopPropagation();
    this.widgetDelete.emit(w);
  }
}
