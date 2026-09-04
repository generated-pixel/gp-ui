# gp-analytics

High-performance analytics, telemetry, and rule-driven monitoring engine for Angular, designed for Generated Pixel design system applications.

## Overview

`gp-analytics` provides a reactive, signal-based telemetry pipeline with automated anomaly detection powered by `@generatedpixel/gp-rules`, themed natively with `@generatedpixel/gp-ui-theme`, and styled with `@generatedpixel/gp-css`.

## Features

- ⚡ **Reactive Signal-Based State**: Track live telemetry, events, metrics, and alerts using Angular Signals.
- 🛡️ **Rule Engine Integration**: Native integration with `@generatedpixel/gp-rules` to evaluate metric thresholds, fire automated alerts, and trigger mitigation workflows.
- 🎨 **Theme-First Architecture**: Seamless styling with `@generatedpixel/gp-ui-theme` and `@generatedpixel/gp-css`.
- 📊 **Telemetry Ingestion**: In-memory event buffering, metric trend calculation, and sparkline sample tracking.

## Installation

```bash
npm install gp-analytics @generatedpixel/gp-ui @generatedpixel/gp-ui-theme @generatedpixel/gp-rules @generatedpixel/gp-css
```

## Quick Start

### 1. Register Providers

```ts
import { ApplicationConfig } from '@angular/core';
import { provideGpAnalytics } from 'gp-analytics';

export const appConfig: ApplicationConfig = {
  providers: [
    provideGpAnalytics({
      appName: 'My Enterprise App',
      enabled: true,
      defaultTimeRange: '24h',
      bufferSize: 200,
    }),
  ],
};
```

### 2. Inject & Track Telemetry

```ts
import { Component, inject } from '@angular/core';
import { GpAnalyticsService } from 'gp-analytics';

@Component({
  selector: 'app-analytics-view',
  standalone: true,
  template: `
    <div>
      <h3>Total Events: {{ analytics.totalEventsCount() }}</h3>
      <button (click)="trackClick()">Track Interaction</button>
    </div>
  `,
})
export class AnalyticsViewComponent {
  protected readonly analytics = inject(GpAnalyticsService);

  trackClick(): void {
    this.analytics.trackEvent('button_click', 'user_action', {
      buttonId: 'checkout_btn',
    });
  }
}
```

## Scripts

- `npm run build:lib` - Builds `gp-analytics` via `ng-packagr` to `dist/gp-analytics`
- `npm run test` - Runs Vitest unit tests for the library
