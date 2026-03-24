import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideGpAnalytics } from 'gp-analytics';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideGpAnalytics({
      appName: 'Demo App',
      endpoint: 'https://api.example.com',
      enabled: true,
      theme: {
        radiusLg: '1rem',
        accentBackground: '#e0f2fe',
        accentBorder: '#7dd3fc',
      },
    }),
  ],
};
