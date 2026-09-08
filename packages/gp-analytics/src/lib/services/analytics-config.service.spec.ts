import { describe, it, expect, beforeEach } from 'vitest';
import { GpAnalyticsConfigService } from './analytics-config.service';

describe('GpAnalyticsConfigService', () => {
  let service: GpAnalyticsConfigService;

  beforeEach(() => {
    service = new GpAnalyticsConfigService();
  });

  it('should initialize with default en-US and USD configuration', () => {
    expect(service.locale()).toBe('en-US');
    expect(service.currency()).toBe('USD');
    expect(service.dateFormat()).toBe('YYYY-MM-DD');
    expect(service.numberFormat().decimalSeparator).toBe('.');
    expect(service.numberFormat().thousandSeparator).toBe(',');
  });

  it('should update locale and currency dynamically', () => {
    service.updateConfig({
      locale: 'fr-FR',
      currency: 'EUR',
      dateFormat: 'DD/MM/YYYY',
      numberFormat: { decimalSeparator: ',', thousandSeparator: ' ' }
    });

    expect(service.locale()).toBe('fr-FR');
    expect(service.currency()).toBe('EUR');
    expect(service.dateFormat()).toBe('DD/MM/YYYY');
    expect(service.numberFormat().decimalSeparator).toBe(',');
    expect(service.numberFormat().thousandSeparator).toBe(' ');
  });

  it('should reset to default configuration', () => {
    service.updateConfig({ locale: 'ja-JP', currency: 'JPY' });
    expect(service.currency()).toBe('JPY');

    service.resetConfig();
    expect(service.locale()).toBe('en-US');
    expect(service.currency()).toBe('USD');
  });
});
