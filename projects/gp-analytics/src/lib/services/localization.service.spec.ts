import { TestBed } from '@angular/core/testing';
import { LocalizationService } from './localization.service';
import {
  evaluateFieldFilter,
  Field,
  FieldFilter,
  resolveDisplayValue,
  resolveLocalizedText,
} from '../models';

describe('Localization & Filter Engine', () => {
  let service: LocalizationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LocalizationService],
    });
    service = TestBed.inject(LocalizationService);
  });

  describe('resolveLocalizedText', () => {
    it('should resolve plain string directly', () => {
      expect(resolveLocalizedText('Hello World', 'en-US')).toBe('Hello World');
      expect(resolveLocalizedText('Hello World', 'fr-FR')).toBe('Hello World');
    });

    it('should resolve exact and base locale matches from map', () => {
      const text = {
        'en-US': 'Sales Revenue',
        fr: 'Chiffre d’affaires',
        de: 'Umsatzerlöse',
        es: 'Ingresos por ventas',
      };

      expect(resolveLocalizedText(text, 'en-US')).toBe('Sales Revenue');
      expect(resolveLocalizedText(text, 'fr-FR')).toBe('Chiffre d’affaires');
      expect(resolveLocalizedText(text, 'de-DE')).toBe('Umsatzerlöse');
      expect(resolveLocalizedText(text, 'es-ES')).toBe('Ingresos por ventas');
      expect(resolveLocalizedText(text, 'it-IT')).toBe('Sales Revenue'); // Fallback to en
    });
  });

  describe('resolveDisplayValue', () => {
    const statusMapping = {
      PENDING: { en: 'Pending Review', fr: 'En attente', de: 'Ausstehend' },
      SHIPPED: { en: 'Dispatched & Shipped', fr: 'Expédié', de: 'Versendet' },
      DELIVERED: { en: 'Successfully Delivered', fr: 'Livré', de: 'Geliefert' },
    };

    it('should resolve mapped display values across languages', () => {
      expect(resolveDisplayValue('PENDING', statusMapping, undefined, 'en-US')).toBe('Pending Review');
      expect(resolveDisplayValue('PENDING', statusMapping, undefined, 'fr-FR')).toBe('En attente');
      expect(resolveDisplayValue('PENDING', statusMapping, undefined, 'de-DE')).toBe('Ausstehend');
    });

    it('should return raw string when no mapping exists', () => {
      expect(resolveDisplayValue('UNKNOWN_CODE', statusMapping, undefined, 'en-US')).toBe('UNKNOWN_CODE');
    });
  });

  describe('evaluateFieldFilter (Locale-aware filtering)', () => {
    const countryField: Field = {
      name: 'country',
      label: { en: 'Country', fr: 'Pays', de: 'Land' },
      dataType: 'string',
      valueMapping: {
        US: { en: 'United States', fr: 'États-Unis', de: 'Vereinigte Staaten' },
        DE: { en: 'Germany', fr: 'Allemagne', de: 'Deutschland' },
        FR: { en: 'France', fr: 'France', de: 'Frankreich' },
      },
    };

    it('should match raw value with matchTarget = "both"', () => {
      const filter: FieldFilter = {
        fieldName: 'country',
        operator: 'eq',
        value: 'US',
        matchTarget: 'both',
        locale: 'en-US',
      };

      const match = evaluateFieldFilter('US', filter, {
        mapping: countryField.valueMapping,
        activeLocale: 'en-US',
      });
      expect(match).toBe(true);
    });

    it('should match localized display value in French when querying "États-Unis"', () => {
      const filter: FieldFilter = {
        fieldName: 'country',
        operator: 'contains',
        value: 'États-Unis',
        matchTarget: 'both',
        locale: 'fr-FR',
      };

      const match = evaluateFieldFilter('US', filter, {
        mapping: countryField.valueMapping,
        activeLocale: 'fr-FR',
      });
      expect(match).toBe(true);
    });

    it('should match German display value when querying "Deutschland"', () => {
      const filter: FieldFilter = {
        fieldName: 'country',
        operator: 'eq',
        value: 'Deutschland',
        matchTarget: 'display',
        locale: 'de-DE',
      };

      const matchDE = evaluateFieldFilter('DE', filter, {
        mapping: countryField.valueMapping,
        activeLocale: 'de-DE',
      });
      expect(matchDE).toBe(true);

      const matchFR = evaluateFieldFilter('FR', filter, {
        mapping: countryField.valueMapping,
        activeLocale: 'de-DE',
      });
      expect(matchFR).toBe(false);
    });

    it('should fail display match if matchTarget is "raw"', () => {
      const filter: FieldFilter = {
        fieldName: 'country',
        operator: 'eq',
        value: 'United States',
        matchTarget: 'raw',
        locale: 'en-US',
      };

      const match = evaluateFieldFilter('US', filter, {
        mapping: countryField.valueMapping,
        activeLocale: 'en-US',
      });
      expect(match).toBe(false); // Raw is 'US', not 'United States'
    });
  });

  describe('LocalizationService Number & Currency Formatting', () => {
    it('should format currencies and numbers in active locale', () => {
      service.setLocale('en-US');
      expect(service.formatValue(12500.5, 'currency')).toBe('$12,500.50');
      expect(service.formatValue(0.185, 'percent')).toBe('18.5%');

      service.setLocale('fr-FR');
      const frCurrency = service.formatValue(12500.5, 'currency');
      expect(frCurrency).toContain('12');
      expect(frCurrency).toContain('500');
    });
  });
});
