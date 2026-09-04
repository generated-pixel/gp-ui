import { TestBed } from '@angular/core/testing';
import { GpAnalyticsService } from './gp-analytics.service';
import { provideGpAnalytics } from '../providers/provide-gp-analytics';

describe('GpAnalyticsService', () => {
  let service: GpAnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideGpAnalytics({
          appName: 'Test App',
          enabled: true,
          bufferSize: 10,
        }),
      ],
    });
    service = TestBed.inject(GpAnalyticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should record events and update signal', () => {
    expect(service.events().length).toBe(0);

    const event = service.trackEvent('test_click', 'ui', { buttonId: 'submit-btn' });
    expect(event.name).toBe('test_click');
    expect(service.events().length).toBe(1);
    expect(service.totalEventsCount()).toBe(1);
    expect(service.events()[0].properties).toEqual({ buttonId: 'submit-btn' });
  });

  it('should register and update metrics', () => {
    service.registerMetric({
      id: 'active_users',
      name: 'Active Users',
      label: 'Active Users',
      value: 100,
      updatedAt: new Date(),
    });

    const metric = service.metrics().get('active_users');
    expect(metric).toBeDefined();
    expect(metric?.value).toBe(100);

    service.updateMetric('active_users', 150, { sparklinePoint: 150 });
    const updated = service.metrics().get('active_users');
    expect(updated?.value).toBe(150);
    expect(updated?.trend).toBe('up');
    expect(updated?.changePercentage).toBe(50);
  });

  it('should trigger alert rule when threshold is breached', () => {
    service.registerMetric({
      id: 'error_rate',
      name: 'Error Rate',
      label: 'Error Rate',
      value: 1.0,
      updatedAt: new Date(),
    });

    service.registerRule({
      id: 'rule-high-error',
      metricId: 'error_rate',
      condition: 'gt',
      threshold: 5.0,
      message: 'High error rate detected',
      severity: 'critical',
    });

    expect(service.alerts().length).toBe(0);

    // Update with value below threshold
    service.updateMetric('error_rate', 4.0);
    expect(service.alerts().length).toBe(0);

    // Update with value breaching threshold
    service.updateMetric('error_rate', 6.5);
    expect(service.alerts().length).toBe(1);
    expect(service.alerts()[0].severity).toBe('critical');
    expect(service.alerts()[0].triggerValue).toBe(6.5);
  });
});
