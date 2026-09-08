import { Injectable, Optional, inject, signal } from '@angular/core';
import { DEFAULT_ENGLISH_TRANSLATIONS } from './default-translations.en';
import { ENGLISH_GB_TRANSLATIONS } from './translations.en-gb';
import { FRENCH_FR_TRANSLATIONS } from './translations.fr-fr';
import { FRENCH_CA_TRANSLATIONS } from './translations.fr-ca';
import { GERMAN_DE_TRANSLATIONS } from './translations.de-de';
import { SPANISH_TRANSLATIONS } from './translations.es';
import { JAPANESE_TRANSLATIONS } from './translations.ja';
import type { SupportedLocale } from '../types/supported-locale.type';
import type { TranslationKey } from '../types/translation-key.type';
import type { TranslationParams } from '../types/translation-params.type';
import type { GpLanguageConfig } from '../interfaces/language-config.interface';
import type { GpTranslationTerm } from '../interfaces/translation-term.interface';
import { GpAnalyticsConfigService } from './analytics-config.service';

export type { SupportedLocale } from '../types/supported-locale.type';
export type { TranslationKey } from '../types/translation-key.type';
export type { TranslationParams } from '../types/translation-params.type';
export type { GpLanguageConfig } from '../interfaces/language-config.interface';
export type { GpTranslationTerm } from '../interfaces/translation-term.interface';

const DEFAULT_LANGUAGES: GpLanguageConfig[] = [
  { code: 'en-US' },
  { code: 'en-GB' },
  { code: 'fr-FR' },
  { code: 'fr-CA' },
  { code: 'de-DE' },
  { code: 'es-ES' },
  { code: 'ja-JP' }
];

/**
 * Enterprise Translation Service with dynamic BCP 47 language and custom terms support.
 * Uses immutable English (en-US) translations as the single source of truth fallback.
 * Every registered locale dictionary is merged over English with hierarchical regional fallback
 * (e.g. 'fr-CA' -> 'fr-FR' -> 'en-US') so no UI keys are ever missing.
 *
 * Users can dynamically register their own custom languages (addLanguage) and custom terms/phrases (addTerm)
 * with full reactivity across language pickers and analytics widgets.
 */
@Injectable({ providedIn: 'root' })
export class GpTranslationService {
  private readonly configService?: GpAnalyticsConfigService;

  readonly locale = signal<SupportedLocale>('en-US');

  /**
   * Reactive signal of all currently available languages (both built-in and user-defined).
   */
  readonly availableLanguages = signal<GpLanguageConfig[]>([...DEFAULT_LANGUAGES]);

  /**
   * Reactive signal of all user-defined custom terms.
   */
  readonly customTerms = signal<GpTranslationTerm[]>([]);

  /**
   * Internal dictionary registry.
   */
  private readonly registry = new Map<string, Record<string, string>>();

  /**
   * Internal lookup map of custom terms by key.
   */
  private readonly termsMap = new Map<string, GpTranslationTerm>();

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
    this.registerTranslations('fr-FR', FRENCH_FR_TRANSLATIONS);
    this.registerTranslations('fr-CA', FRENCH_CA_TRANSLATIONS);

    // 4. Pre-register German (de-DE)
    this.registerTranslations('de-DE', GERMAN_DE_TRANSLATIONS);

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
  registerTranslations(locale: string, translations: Partial<Record<string, string>>): void {
    const baseLang = this.getBaseLanguage(locale);
    const canonicalRegional = `${baseLang}-${baseLang.toUpperCase()}`;
    const enUsDefaults = this.registry.get('en-US') || DEFAULT_ENGLISH_TRANSLATIONS;
    const existing =
      this.registry.get(locale) ||
      this.registry.get(baseLang) ||
      this.registry.get(canonicalRegional) ||
      enUsDefaults;

    const merged: Record<string, string> = {
      ...enUsDefaults,
      ...existing
    };

    for (const [k, v] of Object.entries(translations)) {
      if (v != null) {
        merged[k] = v;
      }
    }

    this.registry.set(locale, merged);
  }

  /**
   * Dynamically adds or updates a custom language in the translation registry.
   * Automatically initializes its dictionary with en-US baseline and emits updated availableLanguages signal.
   */
  addLanguage(config: GpLanguageConfig): void {
    if (!config?.code) {
      return;
    }

    const langItem: GpLanguageConfig = {
      code: config.code,
      translations: config.translations
    };

    // Initialize or augment dictionary
    this.registerTranslations(config.code, config.translations || {});

    // Also register custom terms into this new language
    const currentDict = this.registry.get(config.code);
    if (currentDict) {
      for (const term of this.termsMap.values()) {
        const termVal =
          term.translations[config.code] ||
          term.translations[this.getBaseLanguage(config.code)] ||
          term.translations['en-US'] ||
          term.defaultValue;
        if (termVal && !currentDict[term.key]) {
          currentDict[term.key] = termVal;
        }
      }
    }

    // Update availableLanguages signal
    this.availableLanguages.update((langs) => {
      const idx = langs.findIndex((l) => l.code.toLowerCase() === config.code.toLowerCase());
      if (idx >= 0) {
        const copy = [...langs];
        copy[idx] = langItem;
        return copy;
      }
      return [...langs, langItem];
    });
  }

  /**
   * Removes a user-registered custom language.
   * Cannot remove the baseline 'en-US' locale.
   */
  removeLanguage(code: string): void {
    if (!code || code === 'en-US') {
      return;
    }

    this.registry.delete(code);
    this.availableLanguages.update((langs) => langs.filter((l) => l.code !== code));

    if (this.locale() === code) {
      this.setLocale('en-US');
    }
  }

  /**
   * Dynamically registers a custom term with localized strings across multiple languages.
   * If en-US is provided (or defaultValue), ensures it is placed into en-US dictionary so all languages fall back to it.
   */
  addTerm(term: GpTranslationTerm): void {
    if (!term?.key) {
      return;
    }

    const customTerm: GpTranslationTerm = {
      ...term,
      isCustom: term.isCustom ?? true
    };

    this.termsMap.set(term.key, customTerm);

    const fallbackString =
      term.translations['en-US'] ||
      term.defaultValue ||
      Object.values(term.translations)[0] ||
      term.key;

    // 1. Ensure en-US baseline dictionary has the fallback value
    const enUsDict = this.registry.get('en-US');
    if (enUsDict) {
      enUsDict[term.key] = fallbackString;
    }

    // 2. Distribute term translations to each registered locale
    for (const [locale, translated] of Object.entries(term.translations)) {
      if (translated != null) {
        if (!this.registry.has(locale)) {
          this.registerTranslations(locale, {});
        }
        const dict = this.registry.get(locale);
        if (dict) {
          dict[term.key] = translated;
        }
      }
    }

    // 3. Update reactive customTerms signal
    this.customTerms.update((terms) => {
      const idx = terms.findIndex((t) => t.key === term.key);
      if (idx >= 0) {
        const copy = [...terms];
        copy[idx] = customTerm;
        return copy;
      }
      return [...terms, customTerm];
    });
  }

  /**
   * Batch registers multiple custom terms.
   */
  addTerms(terms: GpTranslationTerm[]): void {
    for (const term of terms) {
      this.addTerm(term);
    }
  }

  /**
   * Removes a custom term by key across all registered dictionaries.
   */
  removeTerm(key: string): void {
    if (!key) {
      return;
    }

    this.termsMap.delete(key);

    for (const dict of this.registry.values()) {
      delete dict[key];
    }

    this.customTerms.update((terms) => terms.filter((t) => t.key !== key));
  }

  /**
   * Retrieves a specific custom term definition by key.
   */
  getCustomTerm(key: string): GpTranslationTerm | undefined {
    return this.termsMap.get(key);
  }

  /**
   * Exports all custom terms for persistence or sharing.
   */
  exportCustomTerms(): GpTranslationTerm[] {
    return this.customTerms();
  }

  /**
   * Bulk imports custom terms from external storage or JSON.
   */
  importCustomTerms(terms: GpTranslationTerm[]): void {
    if (Array.isArray(terms)) {
      this.addTerms(terms);
    }
  }

  /**
   * Sets the active locale. Accepts BCP 47 codes like 'en-US', 'fr-FR', 'en-GB', 'fr-CA', 'de-DE'
   * or any custom locale string.
   */
  setLocale(locale: SupportedLocale): void {
    this.locale.set(locale);
    if (this.configService && this.configService.locale() !== locale) {
      this.configService.updateConfig({ locale });
    }
  }

  /**
   * Returns list of currently available locale codes.
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
    const canonicalRegional = `${baseLang}-${baseLang.toUpperCase()}`;
    return this.registry.has(baseLang) || this.registry.has(canonicalRegional);
  }

  /**
   * Translates a key with optional dynamic template parameters.
   * Employs hierarchical fallback: exact locale -> base language -> canonical regional (e.g. fr-FR) -> en-US defaults -> term defaultValue -> key.
   * Any values that do not exist in other languages come directly from en-US.
   */
  translate(key: TranslationKey, params: TranslationParams = {}): string {
    const activeLocale = this.locale();
    const baseLang = this.getBaseLanguage(activeLocale);
    const canonicalRegional = `${baseLang}-${baseLang.toUpperCase()}`;
    const enUsDefaults = this.registry.get('en-US') || DEFAULT_ENGLISH_TRANSLATIONS;

    const dictionary =
      this.registry.get(activeLocale) ||
      this.registry.get(baseLang) ||
      this.registry.get(canonicalRegional) ||
      enUsDefaults;

    let text: string | undefined = dictionary[key];

    // Check custom term definition if not found directly in dictionary
    if (!text && this.termsMap.has(key)) {
      const term = this.termsMap.get(key);
      if (term) {
        text =
          term.translations[activeLocale] ||
          term.translations[baseLang] ||
          term.translations[canonicalRegional] ||
          term.translations['en-US'] ||
          term.defaultValue;
      }
    }

    if (!text) {
      text = enUsDefaults[key] || key;
    }

    for (const [name, value] of Object.entries(params)) {
      text = text.split(`{${name}}`).join(String(value));
    }

    return text;
  }
}
