import { TestBed } from '@angular/core/testing';
import { GpLocaleFormatterService } from './locale-formatter.service';
import { GpAnalyticsConfigService } from './analytics-config.service';

describe('GpLocaleFormatterService', () => {
  let service: GpLocaleFormatterService;
  let configService: GpAnalyticsConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GpLocaleFormatterService, GpAnalyticsConfigService]
    });
    service = TestBed.inject(GpLocaleFormatterService);
    configService = TestBed.inject(GpAnalyticsConfigService);
  });

  describe('formatCurrency', () => {
    it('should format default currency (USD) properly', () => {
      const formatted = service.formatCurrency(1234.56);
      expect(formatted).toContain('1,234.56');
      expect(formatted).toContain('$');
    });

    it('should support per-table or per-record currency override (EUR, GBP, JPY)', () => {
      const eur = service.formatCurrency(1500, 'EUR');
      expect(eur).toContain('1,500');
      expect(eur).toContain('€');

      const gbp = service.formatCurrency(2500.5, 'GBP');
      expect(gbp).toContain('2,500.50');
      expect(gbp).toContain('£');

      const jpy = service.formatCurrency(3000, 'JPY');
      expect(jpy).toContain('3,000');
      expect(jpy).toContain('¥');
    });

    it('should handle null, undefined, or NaN safely', () => {
      expect(service.formatCurrency(null)).toBe('');
      expect(service.formatCurrency(undefined)).toBe('');
      expect(service.formatCurrency(NaN)).toBe('');
    });
  });

  describe('formatNumber', () => {
    it('should format numbers with default separators and precision', () => {
      const result = service.formatNumber(1234567.89);
      expect(result).toBe('1,234,567.89');
    });

    it('should format numbers with custom separators and precision', () => {
      const result = service.formatNumber(1234567.891, {
        decimalSeparator: ',',
        thousandSeparator: '.',
        precision: 3
      });
      expect(result).toBe('1.234.567,891');
    });

    it('should format negative numbers correctly', () => {
      const result = service.formatNumber(-4500.5);
      expect(result).toBe('-4,500.50');
    });
  });

  describe('formatDate', () => {
    it('should format dates according to YYYY-MM-DD pattern', () => {
      const date = new Date(2026, 8, 6); // September 6, 2026
      const formatted = service.formatDate(date, 'YYYY-MM-DD');
      expect(formatted).toBe('2026-09-06');
    });

    it('should format dates according to DD/MM/YYYY and MM/DD/YYYY patterns', () => {
      const date = new Date(2026, 8, 6);
      expect(service.formatDate(date, 'DD/MM/YYYY')).toBe('06/09/2026');
      expect(service.formatDate(date, 'MM/DD/YYYY')).toBe('09/06/2026');
      expect(service.formatDate(date, 'DD.MM.YYYY')).toBe('06.09.2026');
    });

    it('should respect pattern from GpAnalyticsConfigService', () => {
      configService.updateConfig({ dateFormat: 'DD/MM/YYYY' });
      const date = new Date(2026, 0, 15);
      expect(service.formatDate(date)).toBe('15/01/2026');
    });
  });

  describe('getCurrencySymbol', () => {
    it('should return correct symbols for standard currencies', () => {
      expect(service.getCurrencySymbol('USD')).toBe('$');
      expect(service.getCurrencySymbol('EUR')).toBe('€');
      expect(service.getCurrencySymbol('GBP')).toBe('£');
      expect(service.getCurrencySymbol('JPY')).toBe('¥');
      expect(service.getCurrencySymbol('CAD')).toBe('CA$');
      expect(service.getCurrencySymbol('AUD')).toBe('A$');
      expect(service.getCurrencySymbol('CHF')).toBe('CHF');
    });
  });
});
