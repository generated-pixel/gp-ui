import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GpAnalyticsComponent } from '../base/gp-analytics-component';
import { GpExportImportService } from '../../services/export-import.service';
import {
  GpAnalyticsPackage,
  GpDistributionPayload,
  GpPackageImportMode,
  GpPackageValidationResult,
} from '../../models/package.model';
import { Dataset } from '../../models/dataset.model';
import { GpDashboardConfig } from '../../models/dashboard.model';
import { GpReportConfig } from '../../models/report.model';
import {
  GpButton,
  GpTag,
  GpSwitch,
  GpSelect,
  GpRadioButton,
  GpInputTextDirective,
} from '@generatedpixel/gp-ui';

export interface PackageImportEvent {
  package: GpAnalyticsPackage;
  mode: GpPackageImportMode;
}

export interface DistributionTransmitEvent {
  payload: GpDistributionPayload;
  endpoint: string;
  environment: string;
}

@Component({
  selector: 'gp-package-manager',
  standalone: true,
  imports: [
    FormsModule,
    GpButton,
    GpTag,
    GpSwitch,
    GpSelect,
    GpRadioButton,
    GpInputTextDirective,
  ],
  templateUrl: './package-manager.html',
  styleUrl: './package-manager.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GpPackageManager extends GpAnalyticsComponent {
  protected readonly exportImportService = inject(GpExportImportService);

  readonly environmentOptions = [
    { label: 'Production', value: 'production' },
    { label: 'Staging', value: 'staging' },
    { label: 'Development', value: 'development' },
  ];

  // Inputs: Source assets available for export
  readonly datasets = input<Dataset[]>([]);
  readonly dashboards = input<GpDashboardConfig[]>([]);
  readonly reports = input<GpReportConfig[]>([]);

  // Dialog visibility state
  readonly visible = input<boolean>(false);
  readonly visibleChange = output<boolean>();

  // Outputs: Emitted when actions succeed
  readonly packageImported = output<PackageImportEvent>();
  readonly packageDistributed = output<DistributionTransmitEvent>();
  readonly packageExported = output<GpAnalyticsPackage>();

  // Active modal tab: 'export' | 'import' | 'distribution'
  readonly activeTab = signal<'export' | 'import' | 'distribution'>('export');

  // Export Form State
  readonly packageName = signal<string>('Enterprise Analytics Distribution');
  readonly packageDesc = signal<string>('Configured dashboards, datasets, and operational reports');
  readonly packageAuthor = signal<string>('System Admin');
  readonly packageEnvironment = signal<'development' | 'staging' | 'production'>('production');

  // Asset selection toggles
  readonly includeAllDatasets = signal<boolean>(true);
  readonly includeAllDashboards = signal<boolean>(true);
  readonly includeAllReports = signal<boolean>(true);

  // Selected asset ID sets
  readonly selectedDatasetIds = signal<Set<string>>(new Set());
  readonly selectedDashboardIds = signal<Set<string>>(new Set());
  readonly selectedReportIds = signal<Set<string>>(new Set());

  // Import Form State
  readonly importJsonBuffer = signal<string>('');
  readonly importMode = signal<GpPackageImportMode>('merge');
  readonly validationResult = computed<GpPackageValidationResult | null>(() => {
    const raw = this.importJsonBuffer().trim();
    if (!raw) return null;
    return this.exportImportService.validatePackage(raw);
  });

  // Remote Distribution State
  readonly targetEndpoint = signal<string>('https://api.enterprise.corp/v1/analytics/distribution/packages');
  readonly apiAuthToken = signal<string>('bearer_live_dist_sec_8923a1');
  readonly isTransmitting = signal<boolean>(false);
  readonly transmissionResponse = signal<{
    status: number;
    distributionId: string;
    deliveredAt: string;
    targetEndpoint: string;
    checksum: string;
    message: string;
  } | null>(null);

  // Notification toast
  readonly actionToast = signal<string | null>(null);

  /**
   * Computed active export package based on current selection and form fields.
   */
  readonly currentExportPackage = computed<GpAnalyticsPackage>(() => {
    const allDs = this.datasets();
    const allDb = this.dashboards();
    const allRp = this.reports();

    const selectedDs = this.includeAllDatasets()
      ? allDs
      : allDs.filter((d) => this.selectedDatasetIds().has(d.datasetId));

    const selectedDb = this.includeAllDashboards()
      ? allDb
      : allDb.filter((d) => this.selectedDashboardIds().has(d.id));

    const selectedRp = this.includeAllReports()
      ? allRp
      : allRp.filter((r) => this.selectedReportIds().has(r.id));

    return this.exportImportService.createPackage({
      name: this.packageName(),
      description: this.packageDesc(),
      exportedBy: this.packageAuthor(),
      environment: this.packageEnvironment(),
      datasets: selectedDs,
      dashboards: selectedDb,
      reports: selectedRp,
    });
  });

  /**
   * Formatted JSON string of the current export package.
   */
  readonly exportJsonString = computed<string>(() => {
    return this.exportImportService.exportPackageToJson(this.currentExportPackage(), true);
  });

  /**
   * Distribution payload preview for remote API transmission.
   */
  readonly distributionPayload = computed<GpDistributionPayload>(() => {
    return this.exportImportService.prepareDistributionPayload(
      this.currentExportPackage(),
      this.targetEndpoint(),
    );
  });

  setTab(tab: 'export' | 'import' | 'distribution'): void {
    this.activeTab.set(tab);
    this.actionToast.set(null);
  }

  close(): void {
    this.visibleChange.emit(false);
  }

  // ================= Export Actions =================

  copyExportJson(): void {
    const json = this.exportJsonString();
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(json).then(() => {
        this.showToast('✓ Package JSON copied to clipboard!');
      });
    }
  }

  downloadExportJson(): void {
    const pkg = this.currentExportPackage();
    const filename = `${pkg.metadata.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${pkg.metadata.id}.json`;
    this.exportImportService.downloadJsonFile(filename, this.exportJsonString());
    this.packageExported.emit(pkg);
    this.showToast(`✓ Package downloaded as ${filename}`);
  }

  // ================= Import Actions =================

  async onFileUpload(event: Event): Promise<void> {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      try {
        const text = await this.exportImportService.readJsonFile(file);
        this.importJsonBuffer.set(text);
        this.showToast(`✓ Loaded file: ${file.name}`);
      } catch (err: any) {
        this.showToast(`⚠️ Failed to read file: ${err.message}`);
      }
    }
  }

  applyImport(): void {
    const raw = this.importJsonBuffer().trim();
    if (!raw) return;

    try {
      const imported = this.exportImportService.importPackage(raw, this.importMode());
      this.packageImported.emit({
        package: imported,
        mode: this.importMode(),
      });
      this.showToast(`✓ Successfully imported ${imported.metadata.name}!`);
      setTimeout(() => {
        this.close();
      }, 900);
    } catch (e: any) {
      this.showToast(`⚠️ Import failed: ${e.message}`);
    }
  }

  loadSampleImport(): void {
    const sample = this.exportImportService.createPackage({
      name: 'Sample Operations Package',
      description: 'Pre-bundled distribution package with live executive KPI cockpit and sales dataset',
      exportedBy: 'Cloud Distribution Engine',
      environment: 'production',
      datasets: this.datasets().slice(0, 1),
      dashboards: this.dashboards().slice(0, 1),
      reports: this.reports().slice(0, 2),
    });
    this.importJsonBuffer.set(this.exportImportService.exportPackageToJson(sample, true));
    this.showToast('✓ Loaded sample distribution package');
  }

  // ================= Remote API Distribution Actions =================

  transmitToRemoteApi(): void {
    this.isTransmitting.set(true);
    this.transmissionResponse.set(null);

    const payload = this.distributionPayload();

    // Simulate network transmission to remote API endpoint
    setTimeout(() => {
      this.isTransmitting.set(false);
      const distId = `dist_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
      const response = {
        status: 200,
        distributionId: distId,
        deliveredAt: new Date().toISOString(),
        targetEndpoint: this.targetEndpoint(),
        checksum: payload.checksum,
        message: `Package successfully ingested by distribution cluster at ${this.targetEndpoint()}`,
      };
      this.transmissionResponse.set(response);
      this.packageDistributed.emit({
        payload,
        endpoint: this.targetEndpoint(),
        environment: this.packageEnvironment(),
      });
      this.showToast(`🚀 Successfully distributed package (${payload.payloadSizeBytes} bytes) to remote API!`);
    }, 800);
  }

  protected showToast(msg: string): void {
    this.actionToast.set(msg);
    setTimeout(() => {
      if (this.actionToast() === msg) {
        this.actionToast.set(null);
      }
    }, 4000);
  }
}
