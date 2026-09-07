import { describe, it, expect, beforeEach } from 'vitest';
import { GpAnalyticsConfigService } from './analytics-config.service';

describe('GpAnalyticsConfigService', () => {
  let service: GpAnalyticsConfigService;

  beforeEach(() => {
    service = new GpAnalyticsConfigService();
  });

  it('should initialize with default English and USD configuration', () => {
    expect(service.locale()).toBe('en');
    expect(service.currency()).toBe('USD');
    expect(service.dateFormat()).toBe('YYYY-MM-DD');
    expect(service.numberFormat().decimalSeparator).toBe('.');
    expect(service.numberFormat().thousandSeparator).toBe(',');
  });

  it('should update locale and currency dynamically', () => {
    service.updateConfig({
      locale: 'fr',
      currency: 'EUR',
      dateFormat: 'DD/MM/YYYY',
      numberFormat: { decimalSeparator: ',', thousandSeparator: ' ' }
    });

    expect(service.locale()).toBe('fr');
    expect(service.currency()).toBe('EUR');
    expect(service.dateFormat()).toBe('DD/MM/YYYY');
    expect(service.numberFormat().decimalSeparator).toBe(',');
    expect(service.numberFormat().thousandSeparator).toBe(' ');
  });

  it('should reset to default configuration', () => {
    service.updateConfig({ locale: 'ja', currency: 'JPY' });
    expect(service.currency()).toBe('JPY');

    service.resetConfig();
    expect(service.locale()).toBe('en');
    expect(service.currency()).toBe('USD');
  });
});
