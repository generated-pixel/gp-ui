import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Dashboard, DashboardWidget, DesignedItem, Designer, Widget } from 'gp-analytics';

const SAMPLE_REVENUE_ITEM: DesignedItem = {
  metadata: {
    id: 'demo-revenue-kpi',
    name: 'Revenue KPI',
    artifactType: 'kpi',
    fields: [],
    generatedAt: '2026-03-24T12:00:00.000Z',
  },
  style: {
    tone: 'accent',
    highlighted: true,
  },
  data: {
    summary: 'Generated from the designer configuration on the server.',
    points: [
      {
        key: 'revenue',
        label: 'Revenue',
        value: 128400,
        valueType: 'currency',
      },
      {
        key: 'growth',
        label: 'Growth',
        value: 0.12,
        valueType: 'percent',
      },
    ],
  },
};

@Component({
  selector: 'app-root',
  imports: [Dashboard, Designer, Widget],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly revenueItem = SAMPLE_REVENUE_ITEM;
  protected readonly dashboardWidgets: DashboardWidget[] = [
    {
      id: 'widget-total-users',
      title: 'Total Users',
      layout: { x: 0, y: 0, w: 4, h: 3 },
      item: {
        metadata: {
          id: 'total-users',
          name: 'Total Users',
          artifactType: 'kpi',
          fields: [],
        },
        data: {
          summary: '42,891 active users this month.',
        },
      },
    },
    {
      id: 'widget-revenue',
      layout: { x: 4, y: 0, w: 4, h: 4 },
      item: SAMPLE_REVENUE_ITEM,
    },
    {
      id: 'widget-conversion',
      title: 'Conversion Rate',
      locked: true,
      layout: { x: 8, y: 0, w: 4, h: 3 },
      item: {
        metadata: {
          id: 'conversion-rate',
          name: 'Conversion Rate',
          artifactType: 'kpi',
          fields: [],
        },
        data: {
          summary: '3.7% across all campaigns.',
        },
      },
    },
  ];
}
