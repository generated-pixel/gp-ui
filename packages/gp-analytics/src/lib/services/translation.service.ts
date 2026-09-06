import { Injectable, Optional, inject, signal } from '@angular/core';
import { DEFAULT_ENGLISH_TRANSLATIONS } from './default-translations.en';
import { FRENCH_TRANSLATIONS } from './translations.fr';
import { GERMAN_TRANSLATIONS } from './translations.de';
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
 * Enterprise Translation Service.
 * Uses immutable English translations as the single source of truth fallback.
 * Every registered locale dictionary is merged over English so no UI keys are ever missing.
 */
@Injectable({ providedIn: 'root' })
export class GpTranslationService {
  private readonly configService = inject(GpAnalyticsConfigService, { optional: true });

  readonly locale = signal<SupportedLocale>('en');

  /**
   * Internal dictionary registry.
   */
  private readonly registry = new Map<string, Record<TranslationKey, string>>();

  constructor() {
    // 1. Establish English baseline
    this.registry.set('en', { ...DEFAULT_ENGLISH_TRANSLATIONS });

    // 2. Pre-register standard built-in language packs merged over English defaults
    this.registerTranslations('fr', FRENCH_TRANSLATIONS);
    this.registerTranslations('de', GERMAN_TRANSLATIONS);
    this.registerTranslations('es', SPANISH_TRANSLATIONS);
    this.registerTranslations('ja', JAPANESE_TRANSLATIONS);

    // 3. Sync with global config service if available
    if (this.configService) {
      const initialLocale = this.configService.locale();
      if (initialLocale) {
        this.locale.set(initialLocale as SupportedLocale);
      }
    }
  }

  /**
   * Registers or extends translations for any locale.
   * Merges over English defaults to guarantee full key coverage.
   */
  registerTranslations(locale: string, translations: Partial<Record<TranslationKey, string>>): void {
    const existing = this.registry.get(locale) || { ...DEFAULT_ENGLISH_TRANSLATIONS };
    this.registry.set(locale, {
      ...existing,
      ...translations
    });
  }

  /**
   * Sets the active locale.
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
   * Checks whether a locale dictionary is registered.
   */
  isLocaleSupported(locale: string): boolean {
    return this.registry.has(locale);
  }

  /**
   * Translates a key with optional dynamic template parameters.
   * Falls back to English defaults if key is missing in active locale.
   */
  translate(key: TranslationKey, params: TranslationParams = {}): string {
    const activeLocale = this.locale();
    const dictionary = this.registry.get(activeLocale) || this.registry.get('en') || DEFAULT_ENGLISH_TRANSLATIONS;
    let text = dictionary[key] ?? DEFAULT_ENGLISH_TRANSLATIONS[key] ?? key;

    for (const [name, value] of Object.entries(params)) {
      text = text.split(`{${name}}`).join(String(value));
    }

    return text;
  }
}
