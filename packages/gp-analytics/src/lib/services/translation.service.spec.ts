import { TestBed } from '@angular/core/testing';
import { GpTranslationService } from './translation.service';
import { GpAnalyticsConfigService } from './analytics-config.service';

describe('GpTranslationService', () => {
  let service: GpTranslationService;
  let configService: GpAnalyticsConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GpTranslationService, GpAnalyticsConfigService]
    });
    service = TestBed.inject(GpTranslationService);
    configService = TestBed.inject(GpAnalyticsConfigService);
  });

  it('should initialize with English by default', () => {
    expect(service.locale()).toBe('en');
    expect(service.translate('metadataCatalogue')).toBe('Metadata catalogue');
  });

  it('should interpolate template parameters properly', () => {
    const result = service.translate('recordsLoaded', { count: 42 });
    expect(result).toBe('42 records loaded');
  });

  it('should switch locales to French, German, Spanish, and Japanese', () => {
    service.setLocale('fr');
    expect(service.translate('metadataCatalogue')).toBe('Catalogue de métadonnées');

    service.setLocale('de');
    expect(service.translate('metadataCatalogue')).toBe('Metadaten-Katalog');

    service.setLocale('es');
    expect(service.translate('metadataCatalogue')).toBe('Catálogo de metadatos');

    service.setLocale('ja');
    expect(service.translate('metadataCatalogue')).toBe('メタデータカタログ');
  });

  it('should fall back to English defaults when a key is missing from a custom language pack', () => {
    // Register an incomplete language pack
    service.registerTranslations('it', {
      searchFieldsOrTables: 'Cerca tabelle e campi...'
    });

    service.setLocale('it');
    // Translated key
    expect(service.translate('searchFieldsOrTables')).toBe('Cerca tabelle e campi...');
    // Untranslated key falls back to English
    expect(service.translate('metadataCatalogue')).toBe('Metadata catalogue');
    expect(service.translate('clearAll')).toBe('Clear all');
  });

  it('should fall back to English when an unregistered locale is used', () => {
    service.setLocale('unknown-locale' as any);
    expect(service.translate('metadataCatalogue')).toBe('Metadata catalogue');
  });

  it('should sync locale changes with GpAnalyticsConfigService', () => {
    service.setLocale('de');
    expect(configService.locale()).toBe('de');
  });

  it('should list all available pre-registered locales', () => {
    const locales = service.getAvailableLocales();
    expect(locales).toContain('en');
    expect(locales).toContain('fr');
    expect(locales).toContain('de');
    expect(locales).toContain('es');
    expect(locales).toContain('ja');
  });
});
