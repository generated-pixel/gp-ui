import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'getting-started', pathMatch: 'full' },
  { path: 'docs', redirectTo: 'getting-started', pathMatch: 'full' },
  {
    path: 'getting-started',
    loadComponent: () =>
      import('./pages/getting-started/getting-started').then((m) => m.GettingStarted)
  },
  {
    path: 'rules',
    loadComponent: () => import('./pages/rules-demo/rules-demo').then((m) => m.RulesDemo)
  },
  {
    path: 'blocks',
    loadComponent: () => import('./pages/blocks/blocks').then((m) => m.BlocksPage)
  },
  {
    path: 'blocks-playground',
    loadComponent: () =>
      import('./pages/blocks/blocks-playground').then((m) => m.BlocksPlaygroundPage)
  },
  {
    path: 'theming',
    loadComponent: () => import('./pages/theming/theming').then((m) => m.ThemingPage)
  },
  {
    path: 'gp-css',
    loadComponent: () => import('./pages/gp-css/gp-css').then((m) => m.GpCssPage)
  },
  {
    path: 'i18n',
    loadComponent: () => import('./pages/i18n/i18n').then((m) => m.I18nPage)
  },
  {
    path: 'grid',
    loadComponent: () => import('./pages/grid/grid-demo').then((m) => m.GridDemo)
  },
  {
    path: 'component/grid',
    loadComponent: () => import('./pages/grid/grid-demo').then((m) => m.GridDemo)
  },
  {
    path: 'component/:component',
    loadComponent: () =>
      import('./pages/component-docs/component-doc-page').then((m) => m.ComponentDocPage)
  },
  { path: '**', redirectTo: 'getting-started' }
];
