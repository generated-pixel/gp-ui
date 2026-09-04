import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  GpButton,
  GpIcon,
  GpTag,
  GpBadge,
} from '@generatedpixel/gp-ui';
import {
  GpRuleEngineService,
  GpRuleInspector,
  GpRuleContextFactory,
  GpBusinessRule,
} from '@generatedpixel/gp-rules';
import {
  GpGrid,
  GpGridItem,
} from '@generatedpixel/gp-grid';
import {
  GpAnalyticsService,
  AnalyticsTimeRange,
  AnalyticsEvent,
  GpAnalyticsDesigner,
  GpReportViewer,
  ReportGeneratorService,
  GeneratedReport,
  DatasetFolder,
} from 'gp-analytics';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DatePipe,
    DecimalPipe,
    GpButton,
    GpIcon,
    GpTag,
    GpBadge,
    GpRuleInspector,
    GpGrid,
    GpAnalyticsDesigner,
    GpReportViewer,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnInit {
  protected readonly analytics = inject(GpAnalyticsService);
  protected readonly ruleEngine = inject(GpRuleEngineService);
  protected readonly reportGenerator = inject(ReportGeneratorService);

  // Theme & Appearance
  protected readonly isDarkMode = signal<boolean>(true);
  protected readonly activeTheme = signal<string>('default');
  protected readonly availableThemes = [
    { id: 'default', name: 'Default Indigo' },
    { id: 'ocean', name: 'Ocean Cyan' },
    { id: 'emerald', name: 'Emerald Green' },
    { id: 'amethyst', name: 'Amethyst Purple' },
    { id: 'sunset', name: 'Sunset Orange' },
    { id: 'cyberpunk', name: 'Cyberpunk Neon' },
    { id: 'nord', name: 'Nord Frost' },
  ];

  // Active View Tab
  protected readonly activeTab = signal<'designer' | 'overview' | 'rules' | 'events' | 'simulator'>('overview');

  // Selected event for payload inspector
  protected readonly selectedEvent = signal<AnalyticsEvent | null>(null);

  // Time Range Options
  protected readonly timeRanges: AnalyticsTimeRange[] = ['1h', '24h', '7d', '30d'];

  // Grid Configuration (gp-grid)
  protected readonly showGridLines = signal<boolean>(false);
  protected readonly compactMode = signal<'vertical' | 'none'>('vertical');

  // Sample Dataset Definition for Analytics Designer
  protected readonly datasetFolders: DatasetFolder[] = [
    {
      id: 'financials',
      name: 'Financials & Revenue',
      description: 'Monetary metrics, profit margins and sales volumes',
      fields: [
        { name: 'sales', label: 'Gross Sales', dataType: 'number', folderId: 'financials', defaultAggregation: 'sum', defaultFormat: 'currency' },
        { name: 'profit', label: 'Net Profit', dataType: 'number', folderId: 'financials', defaultAggregation: 'sum', defaultFormat: 'currency' },
        { name: 'units', label: 'Quantity Sold', dataType: 'number', folderId: 'financials', defaultAggregation: 'sum', defaultFormat: 'number-0' },
        { name: 'discount', label: 'Discount Rate', dataType: 'number', folderId: 'financials', defaultAggregation: 'avg', defaultFormat: 'percent' },
      ],
    },
    {
      id: 'geography',
      name: 'Customer & Geography',
      description: 'Geographic distribution and account segments',
      fields: [
        { name: 'region', label: 'Territory Region', dataType: 'string', folderId: 'geography' },
        { name: 'country', label: 'Billing Country', dataType: 'string', folderId: 'geography' },
        { name: 'segment', label: 'Account Segment', dataType: 'string', folderId: 'geography' },
      ],
    },
    {
      id: 'products',
      name: 'Product Catalog',
      description: 'Product taxonomy, lines, and categories',
      fields: [
        { name: 'category', label: 'Category', dataType: 'string', folderId: 'products' },
        { name: 'subCategory', label: 'Sub-Category', dataType: 'string', folderId: 'products' },
        { name: 'sku', label: 'Product SKU', dataType: 'string', folderId: 'products' },
      ],
    },
    {
      id: 'logistics',
      name: 'Operations & Shipping',
      description: 'Order fulfillment times and logistical channels',
      fields: [
        { name: 'shipMode', label: 'Ship Mode', dataType: 'string', folderId: 'logistics' },
        { name: 'shippingDays', label: 'Shipping Duration (Days)', dataType: 'number', folderId: 'logistics', defaultAggregation: 'avg', defaultFormat: 'number-0' },
      ],
    },
  ];

  protected readonly datasetRows: Record<string, unknown>[] = [
    { region: 'North America', country: 'United States', segment: 'Enterprise', category: 'Cloud Infrastructure', subCategory: 'Compute', sku: 'SKU-COMP-01', sales: 48500, profit: 16200, units: 32, discount: 0.08, shipMode: 'Instant Digital', shippingDays: 0 },
    { region: 'North America', country: 'United States', segment: 'Mid-Market', category: 'SaaS Software', subCategory: 'Analytics', sku: 'SKU-ANLYT-02', sales: 24200, profit: 11500, units: 48, discount: 0.05, shipMode: 'Instant Digital', shippingDays: 0 },
    { region: 'North America', country: 'Canada', segment: 'Enterprise', category: 'Hardware Devices', subCategory: 'Edge Routers', sku: 'SKU-ROUT-11', sales: 31000, profit: 8900, units: 14, discount: 0.12, shipMode: 'Express Air', shippingDays: 2 },
    { region: 'Europe', country: 'Germany', segment: 'Enterprise', category: 'Cloud Infrastructure', subCategory: 'Storage', sku: 'SKU-STOR-05', sales: 56000, profit: 19800, units: 60, discount: 0.06, shipMode: 'Instant Digital', shippingDays: 0 },
    { region: 'Europe', country: 'United Kingdom', segment: 'Strategic', category: 'SaaS Software', subCategory: 'Security', sku: 'SKU-SEC-09', sales: 41500, profit: 18400, units: 28, discount: 0.04, shipMode: 'Instant Digital', shippingDays: 0 },
    { region: 'Europe', country: 'France', segment: 'Mid-Market', category: 'Hardware Devices', subCategory: 'IoT Sensors', sku: 'SKU-IOT-44', sales: 18700, profit: 4200, units: 85, discount: 0.15, shipMode: 'Standard Freight', shippingDays: 4 },
    { region: 'Asia Pacific', country: 'Japan', segment: 'Enterprise', category: 'Cloud Infrastructure', subCategory: 'Compute', sku: 'SKU-COMP-02', sales: 62000, profit: 24500, units: 45, discount: 0.05, shipMode: 'Instant Digital', shippingDays: 0 },
    { region: 'Asia Pacific', country: 'Australia', segment: 'Strategic', category: 'SaaS Software', subCategory: 'Analytics', sku: 'SKU-ANLYT-03', sales: 34800, profit: 14700, units: 30, discount: 0.07, shipMode: 'Instant Digital', shippingDays: 0 },
    { region: 'Asia Pacific', country: 'Singapore', segment: 'Enterprise', category: 'Hardware Devices', subCategory: 'Edge Routers', sku: 'SKU-ROUT-12', sales: 27900, profit: 7800, units: 18, discount: 0.10, shipMode: 'Express Air', shippingDays: 1 },
    { region: 'Latin America', country: 'Brazil', segment: 'Mid-Market', category: 'Cloud Infrastructure', subCategory: 'Compute', sku: 'SKU-COMP-08', sales: 19500, profit: 6400, units: 19, discount: 0.10, shipMode: 'Instant Digital', shippingDays: 0 },
    { region: 'Latin America', country: 'Mexico', segment: 'Mid-Market', category: 'SaaS Software', subCategory: 'Security', sku: 'SKU-SEC-15', sales: 16200, profit: 5900, units: 22, discount: 0.08, shipMode: 'Instant Digital', shippingDays: 0 },
    { region: 'Middle East', country: 'UAE', segment: 'Strategic', category: 'Cloud Infrastructure', subCategory: 'Compute', sku: 'SKU-COMP-09', sales: 38400, profit: 15200, units: 26, discount: 0.05, shipMode: 'Instant Digital', shippingDays: 0 },
  ];

  // Saved Designer Reports map
  protected readonly savedReports = signal<Map<string, GeneratedReport>>(new Map());

  // Notification for newly added report
  protected readonly lastAddedReportTitle = signal<string | null>(null);

  protected readonly initialGridItems: GpGridItem[] = [
    {
      id: 'rep_sales_by_region',
      x: 0,
      y: 0,
      w: 6,
      h: 3,
      minW: 4,
      minH: 2,
      title: '📊 Global Revenue by Region',
      icon: 'bar-chart',
      badge: 'GRAPH REPORT',
      badgeSeverity: 'primary',
      widgetType: 'custom',
    },
    {
      id: 'rep_category_breakdown',
      x: 6,
      y: 0,
      w: 6,
      h: 3,
      minW: 4,
      minH: 2,
      title: '📋 Category Profitability Matrix',
      icon: 'table',
      badge: 'TABULAR REPORT',
      badgeSeverity: 'info',
      widgetType: 'custom',
    },
    {
      id: 'rep_total_revenue_kpi',
      x: 0,
      y: 3,
      w: 3,
      h: 2,
      minW: 2,
      minH: 2,
      title: 'Enterprise Gross Sales',
      icon: 'activity',
      badge: 'KPI',
      badgeSeverity: 'success',
      widgetType: 'custom',
    },
    {
      id: 'kpi_latency',
      x: 3,
      y: 3,
      w: 3,
      h: 2,
      minW: 2,
      minH: 2,
      title: 'P99 Pipeline Latency',
      icon: 'zap',
      badge: 'Rule: >250ms',
      badgeSeverity: 'danger',
      widgetType: 'custom',
    },
    {
      id: 'kpi_error',
      x: 6,
      y: 3,
      w: 3,
      h: 2,
      minW: 2,
      minH: 2,
      title: 'Ingestion Error Rate',
      icon: 'alert-triangle',
      badge: 'Rule: >3%',
      badgeSeverity: 'warning',
      widgetType: 'custom',
    },
    {
      id: 'kpi_sessions',
      x: 9,
      y: 3,
      w: 3,
      h: 2,
      minW: 2,
      minH: 2,
      title: 'Active Sessions',
      icon: 'users',
      badge: 'Real-time',
      badgeSeverity: 'contrast',
      widgetType: 'custom',
    },
    {
      id: 'simulator_widget',
      x: 0,
      y: 5,
      w: 6,
      h: 3,
      minW: 4,
      minH: 2,
      title: '⚡ Live Traffic Simulator & Anomaly Injection',
      icon: 'cpu',
      widgetType: 'custom',
    },
    {
      id: 'rules_widget',
      x: 6,
      y: 5,
      w: 6,
      h: 3,
      minW: 4,
      minH: 2,
      title: '🛡️ Rules Engine Status & Mitigation (gp-rules)',
      icon: 'shield-alert',
      widgetType: 'custom',
    },
  ];

  protected readonly gridItems = signal<GpGridItem[]>([...this.initialGridItems]);

  // Simulation State
  protected readonly isAutoSimulating = signal<boolean>(false);
  private simIntervalId: ReturnType<typeof setInterval> | null = null;

  // Computed status indicator
  protected readonly systemStatus = computed<'healthy' | 'warning' | 'critical'>(() => {
    const alerts = this.analytics.alerts().filter((a) => !a.acknowledged);
    if (alerts.some((a) => a.severity === 'critical')) return 'critical';
    if (alerts.some((a) => a.severity === 'warning' || a.severity === 'error')) return 'warning';
    return 'healthy';
  });

  ngOnInit(): void {
    // Apply initial theme
    this.applyTheme(this.activeTheme(), this.isDarkMode());

    // Register initial analytics metrics
    this.initMetrics();

    // Register rules in gp-rules engine and gp-analytics
    this.initRules();

    // Seed initial event stream
    this.seedInitialEvents();

    // Generate starter reports into the dashboard
    this.initStarterReports();
  }

  private initStarterReports(): void {
    // 1. Regional Graph Report
    const regionalGraphReport = this.reportGenerator.generateReport(
      {
        title: 'Global Revenue by Region',
        description: 'Aggregated gross sales across continental territories',
        artifactType: 'graph',
        graphType: 'bar',
        fields: [
          {
            field: { name: 'region', label: 'Region', dataType: 'string', folderId: 'geography' },
            aggregation: 'none',
            groupBy: true,
          },
          {
            field: { name: 'sales', label: 'Revenue', dataType: 'number', folderId: 'financials' },
            aggregation: 'sum',
            groupBy: false,
            columnFormat: 'currency',
          },
        ],
      },
      this.datasetRows,
    );

    // 2. Category Tabular Report
    const categoryTableReport = this.reportGenerator.generateReport(
      {
        title: 'Category Profitability Matrix',
        description: 'Total revenue, profits, and margin breakdown by catalog',
        artifactType: 'tabular',
        fields: [
          {
            field: { name: 'category', label: 'Category', dataType: 'string', folderId: 'products' },
            aggregation: 'none',
            groupBy: true,
          },
          {
            field: { name: 'sales', label: 'Sales', dataType: 'number', folderId: 'financials' },
            aggregation: 'sum',
            groupBy: false,
            columnFormat: 'currency',
          },
          {
            field: { name: 'profit', label: 'Profit', dataType: 'number', folderId: 'financials' },
            aggregation: 'sum',
            groupBy: false,
            columnFormat: 'currency',
          },
          {
            field: { name: 'units', label: 'Units', dataType: 'number', folderId: 'financials' },
            aggregation: 'sum',
            groupBy: false,
            columnFormat: 'number-0',
          },
        ],
      },
      this.datasetRows,
    );

    // 3. KPI Report
    const revenueKpiReport = this.reportGenerator.generateReport(
      {
        title: 'Enterprise Gross Sales',
        description: 'Total generated revenue worldwide',
        artifactType: 'kpi',
        fields: [
          {
            field: { name: 'sales', label: 'Gross Sales', dataType: 'number', folderId: 'financials' },
            aggregation: 'sum',
            groupBy: false,
            columnFormat: 'currency',
          },
          {
            field: { name: 'region', label: 'Region', dataType: 'string', folderId: 'geography' },
            aggregation: 'none',
            groupBy: true,
          },
        ],
      },
      this.datasetRows,
    );

    const map = new Map<string, GeneratedReport>();
    map.set('rep_sales_by_region', regionalGraphReport);
    map.set('rep_category_breakdown', categoryTableReport);
    map.set('rep_total_revenue_kpi', revenueKpiReport);
    this.savedReports.set(map);
  }

  // Retrieve saved report for grid widget
  protected getSavedReport(widgetId: string): GeneratedReport | undefined {
    return this.savedReports().get(widgetId);
  }

  // Handle report generated from GpAnalyticsDesigner
  protected onReportSaved(report: GeneratedReport): void {
    const widgetId = `custom_rep_${Date.now()}`;
    this.savedReports.update((map) => {
      const next = new Map(map);
      next.set(widgetId, report);
      return next;
    });

    const isKpi = report.artifactType === 'kpi';
    const newGridItem: GpGridItem = {
      id: widgetId,
      x: 0,
      y: 0,
      w: isKpi ? 4 : 6,
      h: isKpi ? 2 : 3,
      minW: 3,
      minH: 2,
      title: report.title,
      icon: isKpi ? 'zap' : report.artifactType === 'graph' ? 'bar-chart' : 'table',
      badge: report.artifactType.toUpperCase(),
      badgeSeverity: isKpi ? 'success' : report.artifactType === 'graph' ? 'primary' : 'info',
      widgetType: 'custom',
    };

    this.gridItems.update((items) => [newGridItem, ...items]);
    this.lastAddedReportTitle.set(report.title);
    this.activeTab.set('overview');

    // Auto-clear notification after 4s
    setTimeout(() => {
      if (this.lastAddedReportTitle() === report.title) {
        this.lastAddedReportTitle.set(null);
      }
    }, 4000);
  }

  private initMetrics(): void {
    this.analytics.registerMetric({
      id: 'ingestion_rate',
      name: 'Event Ingestion Rate',
      label: 'Ingestion Rate',
      value: 1420,
      unit: 'evt/s',
      trend: 'up',
      changePercentage: 12.4,
      sparkline: [1100, 1150, 1220, 1300, 1280, 1340, 1420],
      updatedAt: new Date(),
    });

    this.analytics.registerMetric({
      id: 'p99_latency',
      name: 'P99 Pipeline Latency',
      label: 'P99 Latency',
      value: 84,
      unit: 'ms',
      trend: 'neutral',
      changePercentage: -2.1,
      sparkline: [95, 92, 88, 90, 85, 82, 84],
      updatedAt: new Date(),
    });

    this.analytics.registerMetric({
      id: 'error_rate',
      name: 'Telemetry Ingestion Errors',
      label: 'Error Rate',
      value: 0.12,
      unit: '%',
      trend: 'down',
      changePercentage: -0.45,
      sparkline: [0.5, 0.4, 0.3, 0.25, 0.18, 0.15, 0.12],
      updatedAt: new Date(),
    });

    this.analytics.registerMetric({
      id: 'active_sessions',
      name: 'Active User Sessions',
      label: 'Active Sessions',
      value: 8640,
      unit: 'users',
      trend: 'up',
      changePercentage: 8.7,
      sparkline: [7200, 7500, 7900, 8100, 8350, 8500, 8640],
      updatedAt: new Date(),
    });
  }

  private initRules(): void {
    // 1. Register alert thresholds in gp-analytics
    this.analytics.registerRule({
      id: 'rule_high_latency',
      metricId: 'p99_latency',
      condition: 'gt',
      threshold: 250,
      message: 'Critical P99 Latency degradation detected!',
      severity: 'critical',
    });

    this.analytics.registerRule({
      id: 'rule_error_spike',
      metricId: 'error_rate',
      condition: 'gt',
      threshold: 3.0,
      message: 'Anomaly detected: Ingestion Error Rate breached threshold',
      severity: 'warning',
    });

    // 2. Register Business Rules in @generatedpixel/gp-rules engine
    const latencyRule: GpBusinessRule = {
      id: 'gp_latency_monitor',
      name: 'High Latency Automated Throttle Rule',
      trigger: [{ event: 'change', targetField: 'p99_latency' }],
      condition: {
        field: 'p99_latency',
        operator: 'gt',
        value: 250,
      },
      actions: [
        {
          type: 'custom',
          target: 'systemHealth',
          value: 'degraded',
        },
      ],
      elseActions: [
        {
          type: 'custom',
          target: 'systemHealth',
          value: 'nominal',
        },
      ],
    };

    const errorSpikeRule: GpBusinessRule = {
      id: 'gp_error_burst_monitor',
      name: 'Error Burst Anomaly Rule',
      trigger: [{ event: 'change', targetField: 'error_rate' }],
      condition: {
        field: 'error_rate',
        operator: 'gt',
        value: 3.0,
      },
      actions: [
        {
          type: 'custom',
          target: 'alertBadge',
          value: 'active',
        },
      ],
    };

    this.ruleEngine.registerRules([latencyRule, errorSpikeRule]);
  }

  private seedInitialEvents(): void {
    this.analytics.trackEvent('page_view', 'navigation', { path: '/dashboard', referrer: 'direct' });
    this.analytics.trackEvent('widget_rendered', 'ui', { widgetId: 'kpi_summary', renderTimeMs: 14 });
    this.analytics.trackEvent('session_start', 'lifecycle', { client: 'Chrome 124', country: 'US' });
    this.analytics.trackEvent('metric_query', 'query', { range: '24h', metricsCount: 4 });
  }

  // Grid Actions
  protected resetGridLayout(): void {
    this.gridItems.set(JSON.parse(JSON.stringify(this.initialGridItems)));
  }

  protected toggleGridLines(): void {
    this.showGridLines.update((v) => !v);
  }

  protected toggleCompactMode(): void {
    this.compactMode.update((mode) => (mode === 'vertical' ? 'none' : 'vertical'));
  }

  protected onLayoutChange(_items: GpGridItem[]): void {
    // Layout updated reactively by gp-grid
  }

  // Action handlers
  protected selectTheme(themeId: string): void {
    this.activeTheme.set(themeId);
    this.applyTheme(themeId, this.isDarkMode());
  }

  protected toggleDarkMode(): void {
    const nextMode = !this.isDarkMode();
    this.isDarkMode.set(nextMode);
    this.applyTheme(this.activeTheme(), nextMode);
  }

  private applyTheme(theme: string, isDark: boolean): void {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.setAttribute('data-gp-theme', theme);
    root.setAttribute('data-gp-mode', isDark ? 'dark' : 'light');

    const classesToRemove: string[] = ['gp-light', 'gp-dark'];
    root.classList.forEach((cls) => {
      if (cls.startsWith('gp-theme-')) {
        classesToRemove.push(cls);
      }
    });
    root.classList.remove(...classesToRemove);
    root.classList.add(`gp-theme-${theme}`);
    root.classList.add(isDark ? 'gp-dark' : 'gp-light');
  }

  protected setTimeRange(range: AnalyticsTimeRange): void {
    this.analytics.setTimeRange(range);
    this.analytics.trackEvent('filter_time_range', 'interaction', { selectedRange: range });
  }

  protected selectEvent(event: AnalyticsEvent): void {
    this.selectedEvent.set(event);
  }

  // Traffic & Anomaly Simulators
  protected simulateNormalEvent(): void {
    const actions = ['page_view', 'button_click', 'form_submit', 'query_executed', 'token_refresh'];
    const selectedAction = actions[Math.floor(Math.random() * actions.length)];
    this.analytics.trackEvent(selectedAction, 'simulator', {
      simulatedAt: new Date().toISOString(),
      source: 'manual_trigger',
      randomPayload: Math.floor(Math.random() * 1000),
    });

    const currentRate = this.analytics.metrics().get('ingestion_rate')?.value ?? 1400;
    const delta = Math.floor(Math.random() * 80) - 40;
    const nextRate = Math.max(800, currentRate + delta);
    this.analytics.updateMetric('ingestion_rate', nextRate, { sparklinePoint: nextRate });
  }

  protected simulateLatencySpike(): void {
    const spikeValue = 340 + Math.floor(Math.random() * 120);
    this.analytics.trackEvent('pipeline_latency_spike', 'performance', {
      latencyMs: spikeValue,
      service: 'ingestion-worker-3',
    }, 'critical');

    this.analytics.updateMetric('p99_latency', spikeValue, {
      sparklinePoint: spikeValue,
      trend: 'up',
    });

    const ctx = GpRuleContextFactory.create({ triggerEvent: 'change', state: { p99_latency: spikeValue } });
    this.ruleEngine.dispatchEvent('change', ctx, 'p99_latency');
  }

  protected simulateLatencyRecovery(): void {
    const normalLatency = 78 + Math.floor(Math.random() * 15);
    this.analytics.trackEvent('pipeline_latency_recovered', 'performance', {
      latencyMs: normalLatency,
    }, 'info');

    this.analytics.updateMetric('p99_latency', normalLatency, {
      sparklinePoint: normalLatency,
      trend: 'down',
    });

    const ctx = GpRuleContextFactory.create({ triggerEvent: 'change', state: { p99_latency: normalLatency } });
    this.ruleEngine.dispatchEvent('change', ctx, 'p99_latency');
  }

  protected simulateErrorBurst(): void {
    const burstRate = 6.8 + Math.random() * 2.5;
    const roundedRate = Math.round(burstRate * 100) / 100;
    this.analytics.trackEvent('telemetry_ingest_error', 'ingestion', {
      statusCode: 503,
      reason: 'upstream_rate_limited',
    }, 'error');

    this.analytics.updateMetric('error_rate', roundedRate, {
      sparklinePoint: roundedRate,
      trend: 'up',
    });

    const ctx = GpRuleContextFactory.create({ triggerEvent: 'change', state: { error_rate: roundedRate } });
    this.ruleEngine.dispatchEvent('change', ctx, 'error_rate');
  }

  protected simulateConversion(): void {
    const revenue = Math.floor(Math.random() * 300) + 49;
    this.analytics.trackEvent('checkout_completed', 'conversion', {
      orderId: `ord-${Math.floor(Math.random() * 90000) + 10000}`,
      revenue,
      currency: 'USD',
    }, 'info');
  }

  protected toggleAutoSimulator(): void {
    if (this.isAutoSimulating()) {
      if (this.simIntervalId) {
        clearInterval(this.simIntervalId);
        this.simIntervalId = null;
      }
      this.isAutoSimulating.set(false);
    } else {
      this.isAutoSimulating.set(true);
      this.simIntervalId = setInterval(() => {
        this.simulateNormalEvent();
      }, 1800);
    }
  }

  protected clearAllAlerts(): void {
    this.analytics.clearAlerts();
  }

  protected clearAllEvents(): void {
    this.analytics.events.set([]);
    this.selectedEvent.set(null);
  }
}
