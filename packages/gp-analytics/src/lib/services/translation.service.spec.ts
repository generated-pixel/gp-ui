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

  it('should initialize with en-US English by default', () => {
    expect(service.locale()).toBe('en-US');
    expect(service.translate('metadataCatalogue')).toBe('Metadata catalogue');
  });

  it('should interpolate template parameters properly', () => {
    const result = service.translate('recordsLoaded', { count: 42 });
    expect(result).toBe('42 records loaded');
  });

  it('should switch locales to BCP 47 regional variants (fr-FR, de-DE, es-ES, ja-JP)', () => {
    service.setLocale('fr-FR');
    expect(service.translate('metadataCatalogue')).toBe('Catalogue de métadonnées');

    service.setLocale('de-DE');
    expect(service.translate('metadataCatalogue')).toBe('Metadaten-Katalog');
    expect(service.translate('searchFieldsOrTables')).toBe('Tabellen und Felder suchen...');
    expect(service.translate('clearAll')).toBe('Alles löschen');

    service.setLocale('es-ES');
    expect(service.translate('metadataCatalogue')).toBe('Catálogo de metadatos');

    service.setLocale('ja-JP');
    expect(service.translate('metadataCatalogue')).toBe('メタデータカタログ');
  });

  it('should support regional variants like en-GB and fr-CA with regional overrides', () => {
    service.setLocale('en-GB');
    expect(service.translate('foundationIntro')).toContain('localised display values');

    service.setLocale('fr-CA');
    expect(service.translate('searchFieldsOrTables')).toBe('Chercher des tables et des champs...');
    expect(service.translate('clearAll')).toBe('Tout effacer');
    // Non-overridden Canadian French keys fall back seamlessly to French
    expect(service.translate('metadataCatalogue')).toBe('Catalogue de métadonnées');
  });

  it('should maintain backwards compatibility with 2-letter codes (fr, es, ja, en)', () => {
    service.setLocale('fr');
    expect(service.translate('metadataCatalogue')).toBe('Catalogue de métadonnées');

    service.setLocale('es');
    expect(service.translate('metadataCatalogue')).toBe('Catálogo de metadatos');

    service.setLocale('en');
    expect(service.translate('metadataCatalogue')).toBe('Metadata catalogue');
  });

  it('should fall back to English defaults when a key is missing from a custom language pack', () => {
    // Register an incomplete language pack
    service.registerTranslations('it-IT', {
      searchFieldsOrTables: 'Cerca tabelle e campi...'
    });

    service.setLocale('it-IT');
    // Translated key
    expect(service.translate('searchFieldsOrTables')).toBe('Cerca tabelle e campi...');
    // Untranslated key falls back to English
    expect(service.translate('metadataCatalogue')).toBe('Metadata catalogue');
    expect(service.translate('clearAll')).toBe('Clear all');
  });

  it('should fall back to base language when a regional dialect is requested', () => {
    // User switches to an unregistered regional dialect like fr-BE
    service.setLocale('fr-BE');
    // Falls back to base 'fr'
    expect(service.translate('metadataCatalogue')).toBe('Catalogue de métadonnées');
  });

  it('should fall back to English when an completely unregistered locale is used', () => {
    service.setLocale('xx-YY' as any);
    expect(service.translate('metadataCatalogue')).toBe('Metadata catalogue');
  });

  it('should sync locale changes with GpAnalyticsConfigService', () => {
    service.setLocale('de-DE');
    expect(configService.locale()).toBe('de-DE');
  });

  it('should list all available pre-registered BCP 47 locales', () => {
    const locales = service.getAvailableLocales();
    expect(locales).toContain('en-US');
    expect(locales).toContain('en-GB');
    expect(locales).toContain('fr-FR');
    expect(locales).toContain('fr-CA');
    expect(locales).toContain('de-DE');
    expect(locales).toContain('es-ES');
    expect(locales).toContain('ja-JP');
    expect(locales).toContain('en');
    expect(locales).toContain('fr');
  });
});
