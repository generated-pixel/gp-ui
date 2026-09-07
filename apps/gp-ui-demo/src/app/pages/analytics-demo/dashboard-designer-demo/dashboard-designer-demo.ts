import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { GpBadge, GpToast, GpToastService } from 'gp-ui';
import { createDefaultDashboardConfig, GpDashboardConfig, GpDashboardDesigner } from 'gp-analytics';
import { DocApiTable, DocApiProperty } from '../../../shared/doc-api-table';
import { DocCode } from '../../../shared/doc-code';
import { ANALYTICS_AVAILABLE_FIELDS, ANALYTICS_SAMPLE_RECORDS } from '../analytics-demo-data';

@Component({
  selector: 'app-dashboard-designer-demo',
  standalone: true,
  imports: [GpBadge, GpToast, GpDashboardDesigner, DocApiTable, DocCode],
  templateUrl: './dashboard-designer-demo.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardDesignerDemo {
  private readonly toastService = inject(GpToastService);

  protected readonly config = signal<GpDashboardConfig>(createDefaultDashboardConfig());
  protected readonly records = signal(ANALYTICS_SAMPLE_RECORDS);
  protected readonly availableFields = signal(ANALYTICS_AVAILABLE_FIELDS);

  protected onSave(config: GpDashboardConfig): void {
    this.toastService.add({ severity: 'success', summary: 'Dashboard saved', detail: config.title });
  }

  protected onCancel(): void {
    this.toastService.add({ severity: 'info', summary: 'Design cancelled' });
  }

  protected onRefresh(): void {
    this.toastService.add({ severity: 'info', summary: 'Dashboard refreshed' });
  }

  protected readonly usageCode = `<gp-dashboard-designer
  [(config)]="config"
  [records]="records()"
  [availableFields]="availableFields()"
  (save)="onSave($event)"
  (cancel)="onCancel()"
  (refresh)="onRefresh()"
/>`;

  protected readonly properties: DocApiProperty[] = [
    { name: 'config', type: 'model<GpDashboardConfig>', default: 'createDefaultDashboardConfig()', kind: 'model', description: 'Two-way bound dashboard configuration being authored.' },
    { name: 'records', type: 'input<Record<string, any>[]>', default: '[]', description: 'Dataset records used to render live previews in the designer canvas.' },
    { name: 'availableFields', type: 'input<{fieldId: string; label: string; type?: string}[]>', default: '[]', description: 'Available fields from the active domain schema or dataset.' }
  ];

  protected readonly events: DocApiProperty[] = [
    { name: 'save', type: 'output<GpDashboardConfig>', description: 'Emitted when the user clicks the Save button.' },
    { name: 'cancel', type: 'output<void>', description: 'Emitted when the user clicks Cancel or Exit.' },
    { name: 'refresh', type: 'output<void>', description: 'Emitted when the dashboard auto-refreshes or a manual refresh is triggered.' }
  ];
}
