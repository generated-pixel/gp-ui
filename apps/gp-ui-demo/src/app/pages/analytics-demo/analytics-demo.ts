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
      route: '/analytics/dashboard',
      title: 'Analytics Dashboard',
      description: 'Composable KPI, chart, table, and pivot widgets on a gp-grid powered dashboard layout.'
    },
    {
      route: '/analytics/report-dashboard',
      title: 'Report Dashboard',
      description:
        '1-Report analytical cockpit with user-derived KPIs & graphs, 5-tier role-based access control, widget libraries, and global sorting.'
    },
    {
      route: '/analytics/dashboard-designer',
      title: 'Dashboard Designer',
      description: 'Drag-and-drop dashboard authoring tool with widget palette, inspector, and JSON export/import.'
    },
    {
      route: '/analytics/dataset-builder',
      title: 'Dataset Builder',
      description: 'End-to-end workbench combining schema catalogue, dataset field configuration, and live preview.'
    },
    {
      route: '/analytics/package-manager',
      title: 'Package Manager',
      description: 'Export, import, and distribute bundles of datasets, dashboards, and reports.'
    }
  ];
}
