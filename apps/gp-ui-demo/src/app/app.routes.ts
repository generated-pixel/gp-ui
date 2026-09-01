import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'getting-started', pathMatch: 'full' },
  { path: 'docs', redirectTo: 'getting-started', pathMatch: 'full' },
  {
    path: 'getting-started',
    loadComponent: () => import('./pages/getting-started/getting-started.component').then((m) => m.GettingStartedComponent)
  },
  {
    path: 'rules',
    loadComponent: () => import('./pages/rules-demo/rules-demo.component').then((m) => m.RulesDemoComponent)
  },
  {
    path: 'blocks',
    loadComponent: () => import('./pages/blocks/blocks.component').then((m) => m.BlocksPageComponent)
  },
  {
    path: 'blocks-playground',
    loadComponent: () => import('./pages/blocks/blocks-playground.component').then((m) => m.BlocksPlaygroundPageComponent)
  },
  {
    path: 'theming',
    loadComponent: () => import('./pages/theming/theming.component').then((m) => m.ThemingPageComponent)
  },
  {
    path: 'gp-css',
    loadComponent: () => import('./pages/gp-css/gp-css.component').then((m) => m.GpCssPageComponent)
  },
  {
    path: 'i18n',
    loadComponent: () => import('./pages/i18n/i18n.component').then((m) => m.I18nPageComponent)
  },
  {
    path: 'grid',
    loadComponent: () => import('./pages/grid/grid-demo.component').then((m) => m.GridDemoComponent)
  },
  {
    path: 'component/grid',
    loadComponent: () => import('./pages/grid/grid-demo.component').then((m) => m.GridDemoComponent)
  },
  {
    path: 'component/:component',
    loadComponent: () => import('./pages/component-docs/component-doc-page.component').then((m) => m.ComponentDocPageComponent)
  },
  { path: '**', redirectTo: 'getting-started' }
];
