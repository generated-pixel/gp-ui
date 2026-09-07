import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { GpBadge, GpButton, GpToast, GpToastService } from 'gp-ui';
import {
  createEmptyDataset,
  DistributionTransmitEvent,
  GpAnalyticsPackage,
  GpPackageManager,
  PackageImportEvent
} from 'gp-analytics';
import { DocApiTable, DocApiProperty } from '../../../shared/doc-api-table';
import { DocCode } from '../../../shared/doc-code';
import { createSampleDashboardConfig, createSampleReports } from '../analytics-demo-data';

@Component({
  selector: 'app-package-manager-demo',
  standalone: true,
  imports: [GpBadge, GpButton, GpToast, GpPackageManager, DocApiTable, DocCode],
  templateUrl: './package-manager-demo.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PackageManagerDemo {
  private readonly toastService = inject(GpToastService);

  protected readonly visible = signal(false);
  protected readonly datasets = signal([createEmptyDataset('Enterprise Revenue Dataset')]);
  protected readonly dashboards = signal([createSampleDashboardConfig()]);
  protected readonly reports = signal(createSampleReports());

  protected openManager(): void {
    this.visible.set(true);
  }

  protected onVisibleChange(visible: boolean): void {
    this.visible.set(visible);
  }

  protected onPackageImported(event: PackageImportEvent): void {
    this.toastService.add({ severity: 'success', summary: 'Package imported', detail: event.package.metadata.name });
  }

  protected onPackageDistributed(event: DistributionTransmitEvent): void {
    this.toastService.add({ severity: 'success', summary: 'Package distributed', detail: event.environment });
  }

  protected onPackageExported(pkg: GpAnalyticsPackage): void {
    this.toastService.add({ severity: 'success', summary: 'Package exported', detail: pkg.metadata.name });
  }

  protected readonly usageCode = `<gp-package-manager
  [datasets]="datasets()"
  [dashboards]="dashboards()"
  [reports]="reports()"
  [(visible)]="visible"
  (packageImported)="onPackageImported($event)"
  (packageDistributed)="onPackageDistributed($event)"
  (packageExported)="onPackageExported($event)"
/>`;

  protected readonly properties: DocApiProperty[] = [
    { name: 'datasets', type: 'input<Dataset[]>', default: '[]', description: 'Source datasets available for export.' },
    {
      name: 'dashboards',
      type: 'input<GpDashboardConfig[]>',
      default: '[]',
      description: 'Source dashboards available for export.'
    },
    {
      name: 'reports',
      type: 'input<GpReportConfig[]>',
      default: '[]',
      description: 'Source reports available for export.'
    },
    {
      name: 'visible',
      type: 'model<boolean>',
      default: 'false',
      kind: 'model',
      description: 'Two-way modal dialog visibility.'
    }
  ];

  protected readonly events: DocApiProperty[] = [
    {
      name: 'packageImported',
      type: 'output<PackageImportEvent>',
      description: 'Emitted when a package is successfully imported.'
    },
    {
      name: 'packageDistributed',
      type: 'output<DistributionTransmitEvent>',
      description: 'Emitted when a package is successfully distributed to a target environment.'
    },
    {
      name: 'packageExported',
      type: 'output<GpAnalyticsPackage>',
      description: 'Emitted when a package is successfully exported/downloaded.'
    }
  ];
}
