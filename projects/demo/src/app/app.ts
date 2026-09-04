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
  GpAnalyticsService,
  AnalyticsTimeRange,
  AnalyticsEvent,
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
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnInit {
  protected readonly analytics = inject(GpAnalyticsService);
  protected readonly ruleEngine = inject(GpRuleEngineService);

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
  protected readonly activeTab = signal<'overview' | 'rules' | 'events' | 'simulator'>('overview');

  // Selected event for payload inspector
  protected readonly selectedEvent = signal<AnalyticsEvent | null>(null);

  // Time Range Options
  protected readonly timeRanges: AnalyticsTimeRange[] = ['1h', '24h', '7d', '30d'];

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

    // Dispatch rule evaluation in gp-rules engine
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
