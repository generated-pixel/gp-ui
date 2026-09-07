import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { GpBadge, GpToast, GpToastService } from 'gp-ui';
import { GpKpiCard } from 'gp-analytics';
import { DocApiTable, DocApiProperty } from '../../../shared/doc-api-table';
import { DocCode } from '../../../shared/doc-code';

@Component({
  selector: 'app-kpi-card-demo',
  standalone: true,
  imports: [GpBadge, GpToast, GpKpiCard, DocApiTable, DocCode],
  templateUrl: './kpi-card-demo.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KpiCardDemo {
  private readonly toastService = inject(GpToastService);

  protected readonly value = signal(184500);
  protected readonly sparkline = signal([142000, 156000, 149000, 168000, 172000, 179000, 184500]);

  protected onRefresh(widgetId: string): void {
    this.toastService.add({ severity: 'info', summary: 'Refresh requested', detail: widgetId || 'kpi-revenue' });
  }

  protected onExportData(event: { widgetId: string; format: 'csv' | 'json' | 'png' }): void {
    this.toastService.add({ severity: 'success', summary: 'Export requested', detail: event.format.toUpperCase() });
  }

  protected onConfigure(widgetId: string): void {
    this.toastService.add({ severity: 'info', summary: 'Configure requested', detail: widgetId || 'kpi-revenue' });
  }

  protected readonly usageCode = `<gp-kpi-card
  widgetId="kpi-revenue"
  title="Global Revenue"
  icon="💰"
  [value]="184500"
  currency="USD"
  [previousValue]="172000"
  [variancePercentage]="7.3"
  trend="up"
  severity="success"
  [targetValue]="200000"
  [targetProgress]="92"
  [sparklinePoints]="sparkline()"
  [alertThreshold]="150000"
  alertCondition="below"
  alertMessage="Revenue is below the monthly floor"
  (refresh)="onRefresh($event)"
  (exportData)="onExportData($event)"
  (configure)="onConfigure($event)"
/>`;

  protected readonly properties: DocApiProperty[] = [
    {
      name: 'widgetId',
      type: 'input<string>',
      default: "''",
      description: 'Identifier passed back on refresh/export/configure events.'
    },
    { name: 'title', type: 'input<string>', default: "'Metric'", description: 'Card title.' },
    { name: 'subtitle', type: 'input<string>', default: "''", description: 'Optional subtitle text.' },
    {
      name: 'description',
      type: 'input<string>',
      default: "''",
      description: 'Optional longer description shown in tooltip/expanded views.'
    },
    {
      name: 'error',
      type: 'input<string | null>',
      default: 'null',
      description: 'Error message; when set, the card renders an error state.'
    },
    { name: 'value', type: 'input<number | string>', default: '0', description: 'The raw metric value.' },
    {
      name: 'formattedValue',
      type: 'input<string | null>',
      default: 'null',
      description: 'Pre-formatted value string; overrides automatic formatting.'
    },
    {
      name: 'currency',
      type: 'input<string | null>',
      default: 'null',
      description: 'ISO currency code used to format the value as currency.'
    },
    {
      name: 'previousValue',
      type: 'input<number | null>',
      default: 'null',
      description: 'Previous period value, used to compute variance.'
    },
    {
      name: 'variancePercentage',
      type: 'input<number | null>',
      default: 'null',
      description: 'Percentage change vs. the previous value.'
    },
    {
      name: 'trend',
      type: "input<'up'|'down'|'neutral'>",
      default: "'neutral'",
      description: 'Directional trend indicator.'
    },
    {
      name: 'severity',
      type: "input<'success'|'danger'|'info'|'warning'>",
      default: "'info'",
      description: 'Visual severity/accent color.'
    },
    {
      name: 'targetValue',
      type: 'input<number | null>',
      default: 'null',
      description: 'Target value used to compute progress.'
    },
    {
      name: 'targetProgress',
      type: 'input<number | null>',
      default: 'null',
      description: 'Explicit progress percentage toward the target (0-100).'
    },
    {
      name: 'sparklinePoints',
      type: 'input<number[]>',
      default: '[]',
      description: 'Historical data points rendered as an inline sparkline.'
    },
    { name: 'icon', type: 'input<string>', default: "'📊'", description: 'Icon/emoji rendered in the card header.' },
    { name: 'unit', type: 'input<string>', default: "''", description: 'Unit suffix appended to the formatted value.' },
    {
      name: 'alertThreshold',
      type: 'input<number | null>',
      default: 'null',
      description: 'Threshold used to trigger the alert state.'
    },
    {
      name: 'alertCondition',
      type: "input<'above'|'below'>",
      default: "'below'",
      description: 'Whether the alert triggers above or below the threshold.'
    },
    {
      name: 'alertMessage',
      type: 'input<string | null>',
      default: 'null',
      description: 'Message shown when the alert condition is met.'
    }
  ];

  protected readonly events: DocApiProperty[] = [
    {
      name: 'refresh',
      type: 'output<string>',
      description: 'Emitted with the widgetId when the user requests a refresh.'
    },
    {
      name: 'exportData',
      type: "output<{widgetId: string; format: 'csv'|'json'|'png'}>",
      description: 'Emitted when the user requests a data export.'
    },
    {
      name: 'configure',
      type: 'output<string>',
      description: 'Emitted with the widgetId when the user requests configuration.'
    }
  ];
}
