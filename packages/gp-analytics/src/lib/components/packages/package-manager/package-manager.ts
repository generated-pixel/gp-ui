import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GpAnalyticsComponent } from '../../base/gp-analytics-component';
import { GpExportImportService } from '../../../services/export-import.service';
import {
  GpAnalyticsPackage,
  GpDistributionPayload,
  GpPackageImportMode,
  GpPackageValidationResult
} from '../../../models/package.model';
import { Dataset } from '../../../models/dataset.model';
import { GpDashboardConfig } from '../../../models/dashboard.model';
import { GpReportConfig } from '../../../models/report.model';
import { GpButton, GpTag, GpSwitch, GpSelect, GpRadioButton, GpInputTextDirective } from '@generatedpixel/gp-ui';

export type { PackageImportEvent } from '../../../interfaces/package-import-event.interface';
export type { DistributionTransmitEvent } from '../../../interfaces/distribution-transmit-event.interface';
export type { GpPackageSnapshot } from '../../../interfaces/gp-package-snapshot.interface';

import type { PackageImportEvent } from '../../../interfaces/package-import-event.interface';
import type { DistributionTransmitEvent } from '../../../interfaces/distribution-transmit-event.interface';
import type { GpPackageSnapshot } from '../../../interfaces/gp-package-snapshot.interface';

@Component({
  selector: 'gp-package-manager',
  standalone: true,
  imports: [FormsModule, GpButton, GpTag, GpSwitch, GpSelect, GpRadioButton, GpInputTextDirective],
  templateUrl: './package-manager.html',
  styleUrl: './package-manager.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GpPackageManager extends GpAnalyticsComponent {
  protected readonly exportImportService = inject(GpExportImportService);

  readonly environmentOptions = [
    { label: 'Production', value: 'production' },
    { label: 'Staging', value: 'staging' },
    { label: 'Development', value: 'development' }
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

  // Local storage history of export/import packages
  readonly packageHistory = signal<GpPackageSnapshot[]>([]);

  constructor() {
    super();
    this.loadPackageHistory();
  }

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

  readonly parsedImportPackage = computed<GpAnalyticsPackage | null>(() => {
    const val = this.validationResult();
    if (!val || !val.isValid) return null;
    try {
      return JSON.parse(this.importJsonBuffer());
    } catch {
      return null;
    }
  });

  // Selective import asset selection
  readonly importAllDatasets = signal<boolean>(true);
  readonly importAllDashboards = signal<boolean>(true);
  readonly importAllReports = signal<boolean>(true);

  readonly selectedImportDatasetIds = signal<Set<string>>(new Set());
  readonly selectedImportDashboardIds = signal<Set<string>>(new Set());
  readonly selectedImportReportIds = signal<Set<string>>(new Set());

  toggleImportDataset(id: string): void {
    const current = new Set(this.selectedImportDatasetIds());
    if (current.has(id)) current.delete(id);
    else current.add(id);
    this.selectedImportDatasetIds.set(current);
    this.importAllDatasets.set(false);
  }

  toggleImportAllDatasets(): void {
    const next = !this.importAllDatasets();
    this.importAllDatasets.set(next);
    if (next) this.selectedImportDatasetIds.set(new Set());
  }

  toggleImportDashboard(id: string): void {
    const current = new Set(this.selectedImportDashboardIds());
    if (current.has(id)) current.delete(id);
    else current.add(id);
    this.selectedImportDashboardIds.set(current);
    this.importAllDashboards.set(false);
  }

  toggleImportAllDashboards(): void {
    const next = !this.importAllDashboards();
    this.importAllDashboards.set(next);
    if (next) this.selectedImportDashboardIds.set(new Set());
  }

  toggleImportReport(id: string): void {
    const current = new Set(this.selectedImportReportIds());
    if (current.has(id)) current.delete(id);
    else current.add(id);
    this.selectedImportReportIds.set(current);
    this.importAllReports.set(false);
  }

  toggleImportAllReports(): void {
    const next = !this.importAllReports();
    this.importAllReports.set(next);
    if (next) this.selectedImportReportIds.set(new Set());
  }

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

    const selectedDb = this.includeAllDashboards() ? allDb : allDb.filter((d) => this.selectedDashboardIds().has(d.id));

    const selectedRp = this.includeAllReports() ? allRp : allRp.filter((r) => this.selectedReportIds().has(r.id));

    return this.exportImportService.createPackage({
      name: this.packageName(),
      description: this.packageDesc(),
      exportedBy: this.packageAuthor(),
      environment: this.packageEnvironment(),
      datasets: selectedDs,
      dashboards: selectedDb,
      reports: selectedRp
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
    return this.exportImportService.prepareDistributionPayload(this.currentExportPackage(), this.targetEndpoint());
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
    const pkg = this.currentExportPackage();
    const json = this.exportJsonString();
    this.savePackageSnapshot('export', pkg);
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(json).then(() => {
        this.showToast('✓ Package JSON copied to clipboard!');
      });
    }
  }

  downloadExportJson(): void {
    const pkg = this.currentExportPackage();
    this.savePackageSnapshot('export', pkg);
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
      let imported = this.exportImportService.importPackage(raw, this.importMode());

      // If selective import is configured, cherry-pick only selected items
      const filterDs = !this.importAllDatasets() && this.selectedImportDatasetIds().size > 0;
      const filterDb = !this.importAllDashboards() && this.selectedImportDashboardIds().size > 0;
      const filterRp = !this.importAllReports() && this.selectedImportReportIds().size > 0;

      if (filterDs || filterDb || filterRp) {
        imported = {
          ...imported,
          datasets: filterDs
            ? imported.datasets.filter((d: Dataset) => this.selectedImportDatasetIds().has(d.datasetId))
            : imported.datasets,
          dashboards: filterDb
            ? imported.dashboards.filter((d: GpDashboardConfig) => this.selectedImportDashboardIds().has(d.id))
            : imported.dashboards,
          reports: filterRp
            ? imported.reports.filter((r: GpReportConfig) => this.selectedImportReportIds().has(r.id))
            : imported.reports
        };
      }

      this.savePackageSnapshot('import', imported);

      this.packageImported.emit({
        package: imported,
        mode: this.importMode()
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
      reports: this.reports().slice(0, 2)
    });
    this.importJsonBuffer.set(this.exportImportService.exportPackageToJson(sample, true));
    this.showToast('✓ Loaded sample distribution package');
  }

  // ================= Remote API Distribution Actions =================

  transmitToRemoteApi(): void {
    this.isTransmitting.set(true);
    this.transmissionResponse.set(null);

    const payload = this.distributionPayload();
    const pkg = this.currentExportPackage();

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
        message: `Package successfully ingested by distribution cluster at ${this.targetEndpoint()}`
      };
      this.transmissionResponse.set(response);
      this.savePackageSnapshot('distribution', pkg);
      this.packageDistributed.emit({
        payload,
        endpoint: this.targetEndpoint(),
        environment: this.packageEnvironment()
      });
      this.showToast(`🚀 Successfully distributed package (${payload.payloadSizeBytes} bytes) to remote API!`);
    }, 800);
  }

  // ================= Package History & Snapshots =================

  loadPackageHistory(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = window.localStorage.getItem('gp_analytics_package_history');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            this.packageHistory.set(parsed);
          }
        }
      }
    } catch {
      // Ignore localStorage read errors
    }
  }

  savePackageSnapshot(action: 'export' | 'import' | 'distribution', pkg: GpAnalyticsPackage): void {
    try {
      const snapshot: GpPackageSnapshot = {
        id: `snap_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        timestamp: new Date().toISOString(),
        action,
        name: pkg.metadata?.name || 'Analytics Package',
        environment: pkg.metadata?.environment || 'production',
        itemCounts: {
          datasets: pkg.datasets?.length ?? 0,
          dashboards: pkg.dashboards?.length ?? 0,
          reports: pkg.reports?.length ?? 0
        },
        jsonPayload: this.exportImportService.exportPackageToJson(pkg, true)
      };

      const filtered = this.packageHistory().filter((s) => !(s.name === snapshot.name && s.action === snapshot.action));
      const updated = [snapshot, ...filtered].slice(0, 8);
      this.packageHistory.set(updated);

      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('gp_analytics_package_history', JSON.stringify(updated));
      }
    } catch {
      // Ignore localStorage write errors
    }
  }

  restoreSnapshot(snapshot: GpPackageSnapshot): void {
    this.importJsonBuffer.set(snapshot.jsonPayload);
    this.activeTab.set('import');
    this.showToast(`✓ Restored snapshot "${snapshot.name}" to Import editor`);
  }

  clearHistory(): void {
    this.packageHistory.set([]);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem('gp_analytics_package_history');
      }
      this.showToast('✓ Package history cleared');
    } catch {
      // Ignore storage errors
    }
  }

  formatSnapshotTime(iso: string): string {
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return iso;
    }
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
