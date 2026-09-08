import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'getting-started', pathMatch: 'full' },
  { path: 'docs', redirectTo: 'getting-started', pathMatch: 'full' },
  {
    path: 'getting-started',
    loadComponent: () => import('./pages/getting-started/getting-started').then((m) => m.GettingStarted)
  },
  {
    path: 'rules',
    loadComponent: () => import('./pages/rules-demo/rules-demo').then((m) => m.RulesDemo)
  },
  {
    path: 'analytics',
    loadComponent: () => import('./pages/analytics-demo/analytics-demo').then((m) => m.AnalyticsDemo)
  },
  {
    path: 'analytics/schema-catalogue',
    loadComponent: () =>
      import('./pages/analytics-demo/schema-catalogue-demo/schema-catalogue-demo').then((m) => m.SchemaCatalogueDemo)
  },
  {
    path: 'analytics/dataset-field-selector',
    redirectTo: 'analytics/dataset-builder',
    pathMatch: 'full'
  },
  {
    path: 'analytics/dataset-preview',
    loadComponent: () =>
      import('./pages/analytics-demo/dataset-preview-demo/dataset-preview-demo').then((m) => m.DatasetPreviewDemo)
  },
  {
    path: 'analytics/dataset-builder',
    loadComponent: () =>
      import('./pages/analytics-demo/dataset-builder-demo/dataset-builder-demo').then((m) => m.DatasetBuilderDemo)
  },
  {
    path: 'analytics/kpi-card',
    loadComponent: () => import('./pages/analytics-demo/kpi-card-demo/kpi-card-demo').then((m) => m.KpiCardDemo)
  },
  {
    path: 'analytics/analytical-chart',
    loadComponent: () =>
      import('./pages/analytics-demo/analytical-chart-demo/analytical-chart-demo').then((m) => m.AnalyticalChartDemo)
  },
  {
    path: 'analytics/filter-bar',
    loadComponent: () => import('./pages/analytics-demo/filter-bar-demo/filter-bar-demo').then((m) => m.FilterBarDemo)
  },
  {
    path: 'analytics/tabular-report',
    loadComponent: () =>
      import('./pages/analytics-demo/tabular-report-demo/tabular-report-demo').then((m) => m.TabularReportDemo)
  },
  {
    path: 'analytics/pivot-grid',
    loadComponent: () => import('./pages/analytics-demo/pivot-grid-demo/pivot-grid-demo').then((m) => m.PivotGridDemo)
  },
  {
    path: 'analytics/dashboard',
    loadComponent: () =>
      import('./pages/analytics-demo/analytics-dashboard-demo/analytics-dashboard-demo').then(
        (m) => m.AnalyticsDashboardDemo
      )
  },
  {
    path: 'analytics/report-dashboard',
    loadComponent: () =>
      import('./pages/analytics-demo/report-dashboard-demo/report-dashboard-demo').then((m) => m.ReportDashboardDemo)
  },
  {
    path: 'analytics/dashboard-designer',
    loadComponent: () =>
      import('./pages/analytics-demo/dashboard-designer-demo/dashboard-designer-demo').then(
        (m) => m.DashboardDesignerDemo
      )
  },
  {
    path: 'analytics/package-manager',
    loadComponent: () =>
      import('./pages/analytics-demo/package-manager-demo/package-manager-demo').then((m) => m.PackageManagerDemo)
  },
  {
    path: 'blocks',
    loadComponent: () => import('./pages/blocks/blocks').then((m) => m.BlocksPage)
  },
  {
    path: 'blocks-playground',
    loadComponent: () => import('./pages/blocks/blocks-playground').then((m) => m.BlocksPlaygroundPage)
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
    loadComponent: () => import('./pages/component-docs/component-doc-page').then((m) => m.ComponentDocPage)
  },
  { path: '**', redirectTo: 'getting-started' }
];
