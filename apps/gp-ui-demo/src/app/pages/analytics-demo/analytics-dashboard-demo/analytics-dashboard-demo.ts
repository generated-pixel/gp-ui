import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { GpBadge, GpToast, GpToastService } from 'gp-ui';
import { GpAnalyticsDashboard, GpDashboardWidgetConfig, GpFilterCondition } from 'gp-analytics';
import { GpGridItem } from 'gp-grid';
import { DocApiTable, DocApiProperty } from '../../../shared/doc-api-table';
import { DocCode } from '../../../shared/doc-code';
import { ANALYTICS_SAMPLE_RECORDS, createSampleDashboardConfig } from '../analytics-demo-data';

@Component({
  selector: 'app-analytics-dashboard-demo',
  standalone: true,
  imports: [GpBadge, GpToast, GpAnalyticsDashboard, DocApiTable, DocCode],
  templateUrl: './analytics-dashboard-demo.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnalyticsDashboardDemo {
  private readonly toastService = inject(GpToastService);

  protected readonly config = signal(createSampleDashboardConfig());
  protected readonly records = signal(ANALYTICS_SAMPLE_RECORDS);
  protected readonly filters = signal<GpFilterCondition[]>([]);

  protected onWidgetSelect(widget: GpDashboardWidgetConfig): void {
    this.toastService.add({ severity: 'info', summary: 'Widget selected', detail: widget.title });
  }

  protected onLayoutChange(items: GpGridItem[]): void {
    this.toastService.add({ severity: 'info', summary: 'Layout changed', detail: `${items.length} widget(s)` });
  }

  protected onWidgetDataLoaded(event: { widgetId: string; data: any; fromCache: boolean }): void {
    this.toastService.add({ severity: 'success', summary: 'Widget data loaded', detail: event.widgetId });
  }

  protected readonly usageCode = `<gp-analytics-dashboard
  title="Executive Analytics Cockpit"
  subtitle="Live analytical dashboard"
  [config]="config()"
  [records]="records()"
  [(filters)]="filters"
  [editable]="false"
  (widgetSelect)="onWidgetSelect($event)"
  (layoutChange)="onLayoutChange($event)"
  (widgetDataLoaded)="onWidgetDataLoaded($event)"
/>`;

  protected readonly properties: DocApiProperty[] = [
    {
      name: 'config',
      type: 'input<GpDashboardConfig | null>',
      default: 'null',
      description: 'Dashboard layout & widget configuration; defaults to the built-in executive layout.'
    },
    {
      name: 'title',
      type: 'input<string>',
      default: "'Executive Analytics Cockpit'",
      description: 'Fallback title used when config.title is not set.'
    },
    {
      name: 'subtitle',
      type: 'input<string>',
      default: "'Live analytical dashboard powered by gp-grid, gp-ui, and gp-analytics'",
      description: 'Fallback subtitle used when config.subtitle is not set.'
    },
    {
      name: 'records',
      type: 'input<Record<string, any>[]>',
      default: '[]',
      description: 'Inherited dataset records for widgets using the "inherited" data source.'
    },
    {
      name: 'filters',
      type: 'model<GpFilterCondition[]>',
      default: '[]',
      kind: 'model',
      description: 'Two-way active filters applied across the entire dashboard.'
    },
    {
      name: 'editable',
      type: 'input<boolean>',
      default: 'false',
      description: 'Enables designer mode: widget selection, drag/resize regardless of config flags.'
    },
    {
      name: 'selectedWidgetId',
      type: 'input<string | null>',
      default: 'null',
      description: 'Currently selected widget ID, used to highlight the widget in designer mode.'
    }
  ];

  protected readonly events: DocApiProperty[] = [
    {
      name: 'widgetSelect',
      type: 'output<GpDashboardWidgetConfig>',
      description: 'Emitted when a widget is clicked in editable/designer mode.'
    },
    {
      name: 'widgetEdit',
      type: 'output<GpDashboardWidgetConfig>',
      description: 'Emitted when a widget edit action is triggered.'
    },
    {
      name: 'widgetDuplicate',
      type: 'output<GpDashboardWidgetConfig>',
      description: 'Emitted when a widget duplicate action is triggered.'
    },
    {
      name: 'widgetDelete',
      type: 'output<GpDashboardWidgetConfig>',
      description: 'Emitted when a widget delete action is triggered.'
    },
    {
      name: 'layoutChange',
      type: 'output<GpGridItem[]>',
      description: 'Emitted whenever the grid layout (positions/sizes) changes.'
    },
    {
      name: 'widgetDataLoaded',
      type: 'output<{widgetId: string; data: any; fromCache: boolean}>',
      description: 'Emitted whenever a widget finishes loading its data.'
    }
  ];
}
