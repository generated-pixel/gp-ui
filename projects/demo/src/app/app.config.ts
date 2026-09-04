import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideGpAnalytics } from 'gp-analytics';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideGpAnalytics({
      appName: 'gp-analytics Enterprise Cockpit',
      enabled: true,
      debug: true,
      defaultTimeRange: '24h',
      bufferSize: 200,
    }),
  ],
};
