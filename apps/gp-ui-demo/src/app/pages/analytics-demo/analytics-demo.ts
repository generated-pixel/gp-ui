import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GpBadge } from 'gp-ui';

interface AnalyticsDemoLink {
  route: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-analytics-demo',
  standalone: true,
  imports: [RouterLink, GpBadge],
  templateUrl: './analytics-demo.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnalyticsDemo {
  protected readonly links: AnalyticsDemoLink[] = [
    {
      route: '/analytics/schema-catalogue',
      title: 'Schema Catalogue',
      description: 'Browse relational metadata groupings, tables, and fields; drag or select fields into a dataset.'
    },
    {
      route: '/analytics/dataset-field-selector',
      title: 'Dataset Field Selector',
      description: 'Manage the fields and filters that make up an analytical dataset.'
    },
    {
      route: '/analytics/dataset-preview',
      title: 'Dataset Preview',
      description: 'Live tabular preview of a dataset with summary statistics and active filter chips.'
    },
    {
      route: '/analytics/dataset-builder',
      title: 'Dataset Builder',
      description: 'End-to-end workbench combining the schema catalogue, field selector, and preview.'
    },
    {
      route: '/analytics/kpi-card',
      title: 'KPI Card',
      description: 'Single-metric scorecard widget with trend, target progress, sparkline, and alerting.'
    },
    {
      route: '/analytics/analytical-chart',
      title: 'Analytical Chart',
      description: 'Bar, donut, and line chart widget for categorical measures.'
    },
    {
      route: '/analytics/filter-bar',
      title: 'Filter Bar',
      description: 'Quick-filter toolbar with date presets and ad-hoc filter conditions.'
    },
    {
      route: '/analytics/tabular-report',
      title: 'Tabular Report',
      description: 'Multi-dimensional grouped table report with subtotal and grand-total rollups.'
    },
    {
      route: '/analytics/pivot-grid',
      title: 'Pivot Grid',
      description: '2D cross-tabulation matrix with heatmap intensity shading.'
    },
    {
      route: '/analytics/dashboard',
      title: 'Analytics Dashboard',
      description: 'Composable KPI, chart, table, and pivot widgets on a gp-grid powered dashboard layout.'
    },
    {
      route: '/analytics/report-dashboard',
      title: 'Report Dashboard',
      description: '1-Report analytical cockpit with user-derived KPIs & graphs, 5-tier role-based access control, widget libraries, and global sorting.'
    },
    {
      route: '/analytics/dashboard-designer',
      title: 'Dashboard Designer',
      description: 'Drag-and-drop dashboard authoring tool with widget palette, inspector, and JSON export/import.'
    },
    {
      route: '/analytics/package-manager',
      title: 'Package Manager',
      description: 'Export, import, and distribute bundles of datasets, dashboards, and reports.'
    }
  ];
}
