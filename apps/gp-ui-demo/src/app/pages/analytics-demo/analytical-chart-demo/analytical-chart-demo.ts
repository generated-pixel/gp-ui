import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { GpBadge, GpToast, GpToastService } from 'gp-ui';
import { GpAnalyticalChart, GpCategoricalChartData } from 'gp-analytics';
import { DocApiTable, DocApiProperty } from '../../../shared/doc-api-table';
import { DocCode } from '../../../shared/doc-code';

@Component({
  selector: 'app-analytical-chart-demo',
  standalone: true,
  imports: [GpBadge, GpToast, GpAnalyticalChart, DocApiTable, DocCode],
  templateUrl: './analytical-chart-demo.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnalyticalChartDemo {
  private readonly toastService = inject(GpToastService);

  protected readonly chartType = signal<'bar' | 'donut' | 'line'>('bar');

  protected readonly chartData = signal<GpCategoricalChartData>({
    categories: ['EMEA', 'AMER', 'APAC'],
    series: [{ name: 'Revenue', data: [40650, 73900, 3120000] }]
  });

  protected onRefresh(widgetId: string): void {
    this.toastService.add({ severity: 'info', summary: 'Refresh requested', detail: widgetId || 'chart-regional' });
  }

  protected onExportData(event: { widgetId: string; format: 'csv' | 'json' | 'png' }): void {
    this.toastService.add({ severity: 'success', summary: 'Export requested', detail: event.format.toUpperCase() });
  }

  protected readonly usageCode = `<gp-analytical-chart
  widgetId="chart-regional"
  title="Revenue Distribution by Region"
  [type]="'bar'"
  [data]="chartData()"
  [stacked]="false"
  [enableSvgExport]="true"
  (refresh)="onRefresh($event)"
  (exportData)="onExportData($event)"
/>`;

  protected readonly properties: DocApiProperty[] = [
    { name: 'widgetId', type: 'input<string>', default: "''", description: 'Identifier passed back on refresh/export events.' },
    { name: 'title', type: 'input<string>', default: "'Analytical Visualization'", description: 'Chart title.' },
    { name: 'subtitle', type: 'input<string>', default: "''", description: 'Optional subtitle text.' },
    { name: 'type', type: "input<'bar'|'donut'|'line'>", default: "'bar'", description: 'Chart rendering type.' },
    { name: 'data', type: 'input<GpCategoricalChartData | null>', default: 'null', description: 'Categories and one or more named series of values.' },
    { name: 'stacked', type: 'input<boolean>', default: 'false', description: 'Whether multi-series bar charts render stacked instead of grouped.' },
    { name: 'enableSvgExport', type: 'input<boolean>', default: 'true', description: 'Whether the SVG export action is available.' }
  ];

  protected readonly events: DocApiProperty[] = [
    { name: 'refresh', type: 'output<string>', description: 'Emitted with the widgetId when the user requests a refresh.' },
    { name: 'exportData', type: "output<{widgetId: string; format: 'csv'|'json'|'png'}>", description: 'Emitted when the user requests a data export.' },
    { name: 'configure', type: 'output<string>', description: 'Emitted with the widgetId when the user requests configuration.' }
  ];
}
