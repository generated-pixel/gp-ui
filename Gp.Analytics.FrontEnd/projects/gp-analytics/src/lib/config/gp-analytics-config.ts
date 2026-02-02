import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GpAnalyticsConfig {
  csp = signal<{ nonce: string | undefined }>({ nonce: undefined });
}
