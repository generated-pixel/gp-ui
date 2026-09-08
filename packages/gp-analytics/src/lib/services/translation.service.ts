import { Injectable, Optional, inject, signal } from '@angular/core';
import { DEFAULT_ENGLISH_TRANSLATIONS } from './default-translations.en';
import { ENGLISH_GB_TRANSLATIONS } from './translations.en-gb';
import { FRENCH_TRANSLATIONS } from './translations.fr';
import { FRENCH_CA_TRANSLATIONS } from './translations.fr-ca';
import { GERMAN_TRANSLATIONS } from './translations.de';
import { GERMAN_DE_TRANSLATIONS } from './translations.de-de';
import { SPANISH_TRANSLATIONS } from './translations.es';
import { JAPANESE_TRANSLATIONS } from './translations.ja';
import type { SupportedLocale } from '../types/supported-locale.type';
import type { TranslationKey } from '../types/translation-key.type';
import type { TranslationParams } from '../types/translation-params.type';
import { GpAnalyticsConfigService } from './analytics-config.service';

export type { SupportedLocale } from '../types/supported-locale.type';
export type { TranslationKey } from '../types/translation-key.type';
export type { TranslationParams } from '../types/translation-params.type';

/**
 * Enterprise Translation Service with BCP 47 language code support (e.g. 'en-US', 'fr-FR', 'en-GB', 'fr-CA').
 * Uses immutable English (en-US) translations as the single source of truth fallback.
 * Every registered locale dictionary is merged over English with hierarchical regional fallback
 * (e.g. 'fr-CA' -> 'fr-FR' / 'fr' -> 'en-US' / 'en') so no UI keys are ever missing.
 */
@Injectable({ providedIn: 'root' })
export class GpTranslationService {
  private readonly configService?: GpAnalyticsConfigService;

  readonly locale = signal<SupportedLocale>('en-US');

  /**
   * Internal dictionary registry.
   */
  private readonly registry = new Map<string, Record<TranslationKey, string>>();

  constructor(@Optional() configService?: GpAnalyticsConfigService) {
    if (configService) {
      this.configService = configService;
    } else {
      try {
        this.configService = inject(GpAnalyticsConfigService, { optional: true }) || undefined;
      } catch {
        this.configService = undefined;
      }
    }

    // 1. Establish English baseline (both BCP 47 and ISO 639-1)
    this.registry.set('en-US', { ...DEFAULT_ENGLISH_TRANSLATIONS });
    this.registry.set('en', { ...DEFAULT_ENGLISH_TRANSLATIONS });

    // 2. Pre-register British English dialect
    this.registerTranslations('en-GB', ENGLISH_GB_TRANSLATIONS);

    // 3. Pre-register French variants
    this.registerTranslations('fr-FR', FRENCH_TRANSLATIONS);
    this.registerTranslations('fr-CA', FRENCH_CA_TRANSLATIONS);
    this.registerTranslations('fr', FRENCH_TRANSLATIONS);

    // 4. Pre-register German variants
    this.registerTranslations('de-DE', GERMAN_DE_TRANSLATIONS);
    this.registerTranslations('de', GERMAN_TRANSLATIONS);

    // 5. Pre-register Spanish variants
    this.registerTranslations('es-ES', SPANISH_TRANSLATIONS);
    this.registerTranslations('es', SPANISH_TRANSLATIONS);

    // 6. Pre-register Japanese variants
    this.registerTranslations('ja-JP', JAPANESE_TRANSLATIONS);
    this.registerTranslations('ja', JAPANESE_TRANSLATIONS);

    // 7. Sync with global config service if available
    if (this.configService) {
      const initialLocale = this.configService.locale();
      if (initialLocale) {
        this.locale.set(initialLocale as SupportedLocale);
      }
    }
  }

  /**
   * Extracts the base language code (e.g. 'en' from 'en-US', 'fr' from 'fr-CA').
   */
  getBaseLanguage(locale: string): string {
    return (locale || 'en-US').split('-')[0].toLowerCase();
  }

  /**
   * Registers or extends translations for any locale.
   * Merges over the closest matching base language or English defaults to guarantee full key coverage.
   */
  registerTranslations(locale: string, translations: Partial<Record<TranslationKey, string>>): void {
    const baseLang = this.getBaseLanguage(locale);
    const enUsDefaults = this.registry.get('en-US') || DEFAULT_ENGLISH_TRANSLATIONS;
    const existing =
      this.registry.get(locale) ||
      this.registry.get(baseLang) ||
      enUsDefaults;

    this.registry.set(locale, {
      ...enUsDefaults,
      ...existing,
      ...translations
    });
  }

  /**
   * Sets the active locale. Accepts BCP 47 codes like 'en-US', 'fr-FR', 'en-GB', 'fr-CA'
   * or short codes like 'en', 'fr'.
   */
  setLocale(locale: SupportedLocale): void {
    this.locale.set(locale);
    if (this.configService && this.configService.locale() !== locale) {
      this.configService.updateConfig({ locale });
    }
  }

  /**
   * Returns list of currently available locales.
   */
  getAvailableLocales(): string[] {
    return Array.from(this.registry.keys());
  }

  /**
   * Checks whether a locale dictionary or its base language is registered.
   */
  isLocaleSupported(locale: string): boolean {
    if (this.registry.has(locale)) {
      return true;
    }
    const baseLang = this.getBaseLanguage(locale);
    return this.registry.has(baseLang);
  }

  /**
   * Translates a key with optional dynamic template parameters.
   * Employs hierarchical fallback: exact locale -> base language -> en-US defaults.
   * Any values that do not exist in other languages come directly from en-US.
   */
  translate(key: TranslationKey, params: TranslationParams = {}): string {
    const activeLocale = this.locale();
    const baseLang = this.getBaseLanguage(activeLocale);
    const enUsDefaults = this.registry.get('en-US') || DEFAULT_ENGLISH_TRANSLATIONS;

    const dictionary =
      this.registry.get(activeLocale) ||
      this.registry.get(baseLang) ||
      enUsDefaults;

    let text = dictionary[key] || enUsDefaults[key] || key;

    for (const [name, value] of Object.entries(params)) {
      text = text.split(`{${name}}`).join(String(value));
    }

    return text;
  }
}
