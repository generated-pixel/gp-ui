import { inject, Injectable, signal } from '@angular/core';

import { DEFAULT_GP_ANALYTICS_FORMATTING, GpAnalyticsEvent } from '../config/gp-analytics-config';
import { GP_ANALYTICS_CONFIG } from '../tokens/gp-analytics.token';

@Injectable({
  providedIn: 'root',
})
export class GpAnalyticsService {
  private readonly config = inject(GP_ANALYTICS_CONFIG, { optional: true });
  private readonly trackedEventsState = signal<GpAnalyticsEvent[]>([]);

  readonly trackedEvents = this.trackedEventsState.asReadonly();

  track(name: string, payload?: Record<string, unknown>): void {
    if (this.config?.enabled === false) {
      return;
    }

    this.trackedEventsState.update((events) => [
      ...events,
      {
        name,
        payload,
        timestamp: new Date().toISOString(),
      },
    ]);
  }

  clear(): void {
    this.trackedEventsState.set([]);
  }

  formatDate(value: Date | string | number, style: 'short' | 'long' = 'short'): string {
    const date = value instanceof Date ? value : new Date(value);
    const formatting = this.config?.formatting ?? DEFAULT_GP_ANALYTICS_FORMATTING;
    const options = style === 'long' ? formatting.dateLong : formatting.dateShort;

    return new Intl.DateTimeFormat(formatting.locale, {
      ...options,
      ...(formatting.timeZone ? { timeZone: formatting.timeZone } : {}),
    }).format(date);
  }

  formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
    const formatting = this.config?.formatting ?? DEFAULT_GP_ANALYTICS_FORMATTING;
    return new Intl.NumberFormat(formatting.locale, options).format(value);
  }

  formatCurrency(value: number, currency?: string): string {
    const formatting = this.config?.formatting ?? DEFAULT_GP_ANALYTICS_FORMATTING;
    return new Intl.NumberFormat(formatting.locale, {
      style: 'currency',
      currency: currency ?? formatting.currency,
    }).format(value);
  }
}
