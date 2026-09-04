import { Injectable, signal } from '@angular/core';
import {
  ColumnFormat,
  DatasetFolder,
  Field,
  LocalizedText,
  resolveDisplayValue,
  resolveFolderDescription,
  resolveFolderName,
  resolveFieldDescription,
  resolveFieldLabel,
  resolveLocalizedText,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class LocalizationService {
  /**
   * The active locale code (e.g. 'en-US', 'fr-FR', 'de-DE', 'es-ES').
   */
  readonly activeLocale = signal<string>('en-US');

  /**
   * Sets the global active locale.
   */
  setLocale(locale: string): void {
    this.activeLocale.set(locale);
  }

  /**
   * Resolves a LocalizedText string for the current active locale.
   */
  resolve(text: LocalizedText | undefined | null, fallback = ''): string {
    return resolveLocalizedText(text, this.activeLocale(), fallback);
  }

  /**
   * Resolves the localized label for a Field.
   */
  resolveFieldLabel(field: Field): string {
    return resolveFieldLabel(field, this.activeLocale());
  }

  /**
   * Resolves the localized description for a Field.
   */
  resolveFieldDescription(field: Field): string {
    return resolveFieldDescription(field, this.activeLocale());
  }

  /**
   * Resolves the localized name for a DatasetFolder.
   */
  resolveFolderName(folder: DatasetFolder): string {
    return resolveFolderName(folder, this.activeLocale());
  }

  /**
   * Resolves the localized description for a DatasetFolder.
   */
  resolveFolderDescription(folder: DatasetFolder): string {
    return resolveFolderDescription(folder, this.activeLocale());
  }

  /**
   * Resolves the localized display value for a raw data value.
   */
  resolveDisplayValue(rawValue: unknown, field?: Field): string {
    return resolveDisplayValue(
      rawValue,
      field?.valueMapping,
      field?.getDisplayValue,
      this.activeLocale(),
    );
  }

  /**
   * Formats a numeric value according to the active locale and requested format.
   */
  formatValue(value: unknown, format?: ColumnFormat, field?: Field): string {
    if (value === null || value === undefined) return '-';

    // If field has a discrete value mapping, resolve its localized display string
    if (field?.valueMapping || field?.getDisplayValue) {
      return this.resolveDisplayValue(value, field);
    }

    const num = Number(value);
    const locale = this.activeLocale();

    switch (format) {
      case 'currency':
        return isNaN(num)
          ? String(value)
          : new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD' }).format(num);

      case 'percent':
        return isNaN(num)
          ? String(value)
          : new Intl.NumberFormat(locale, {
              style: 'percent',
              minimumFractionDigits: 1,
              maximumFractionDigits: 1,
            }).format(num <= 1 ? num : num / 100);

      case 'number-0':
        return isNaN(num)
          ? String(value)
          : new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(num);

      case 'number-2':
        return isNaN(num)
          ? String(value)
          : new Intl.NumberFormat(locale, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(num);

      case 'date-short':
        if (value instanceof Date || !isNaN(Date.parse(String(value)))) {
          return new Intl.DateTimeFormat(locale, { dateStyle: 'short' }).format(
            new Date(value as string | number | Date),
          );
        }
        return String(value);

      case 'date-long':
        if (value instanceof Date || !isNaN(Date.parse(String(value)))) {
          return new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(
            new Date(value as string | number | Date),
          );
        }
        return String(value);

      default:
        return isNaN(num)
          ? String(value)
          : new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(num);
    }
  }
}
