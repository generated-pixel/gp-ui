import { TestBed } from '@angular/core/testing';
import { GpLocaleService } from './gp-locale.service';
import { GpDirectionService } from '../config/gp-config.service';

describe('GpLocaleService', () => {
  let service: GpLocaleService;
  let dirService: GpDirectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GpLocaleService);
    dirService = TestBed.inject(GpDirectionService);
  });

  it('initializes with default locale and currency', () => {
    expect(service).toBeTruthy();
    expect(service.currency()).toBe('USD');
    expect(service.locale()).toBeTruthy();
  });

  it('updates locale and updates separators reactively', () => {
    service.setLocale('de-DE');
    expect(service.locale()).toBe('de-DE');
    expect(service.separators().decimal).toBe(',');
    expect(service.separators().group).toBe('.');
  });

  it('automatically sets RTL direction when setting Arabic locale', () => {
    service.setLocale('ar-EG');
    expect(service.direction()).toBe('rtl');
    expect(dirService.isRtl()).toBe(true);

    service.setLocale('en-US');
    expect(service.direction()).toBe('ltr');
    expect(dirService.isRtl()).toBe(false);
  });

  it('formats number using active locale signal', () => {
    service.setLocale('de-DE');
    const formatted = service.formatNumber(1250.75, { minimumFractionDigits: 2 });
    expect(formatted).toBe('1.250,75');
  });

  it('formats currency using active currency and locale', () => {
    service.setLocale('en-US');
    service.setCurrency('EUR');
    const formatted = service.formatCurrency(50);
    expect(formatted).toContain('50.00');
    expect(formatted).toContain('€');
  });

  it('converts currency with exchange rates', () => {
    const result = service.convertCurrency(100, 1.0, 1.35);
    expect(result).toBe(135);
  });
});
