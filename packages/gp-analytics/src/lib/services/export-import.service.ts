import { Injectable } from '@angular/core';
import {
  computePackageChecksum,
  createEmptyPackage,
  GpAnalyticsPackage,
  GpDistributionPayload,
  GpPackageImportMode,
  GpPackageItemCounts,
  GpPackageMetadata,
  GpPackageThemeConfig,
  GpPackageValidationResult
} from '../models/package.model';
import { Dataset } from '../models/dataset.model';
import { GpDashboardConfig } from '../models/dashboard.model';
import { GpReportConfig } from '../models/report.model';

export interface CreatePackageOptions {
  name?: string;
  description?: string;
  datasets?: Dataset[];
  dashboards?: GpDashboardConfig[];
  reports?: GpReportConfig[];
  exportedBy?: string;
  organization?: string;
  environment?: 'development' | 'staging' | 'production' | string;
  tags?: string[];
  theme?: GpPackageThemeConfig;
  extensions?: Record<string, unknown>;
}

@Injectable({
  providedIn: 'root'
})
export class GpExportImportService {
  /** Current supported package schema version */
  readonly currentSchemaVersion = '1.0.0';

  /**
   * Bundles datasets, dashboards, and reports into a versioned, checksummed GpAnalyticsPackage.
   */
  createPackage(options: CreatePackageOptions = {}): GpAnalyticsPackage {
    const pkg = createEmptyPackage(options.name || 'Analytics Distribution Package');

    if (options.description) pkg.metadata.description = options.description;
    if (options.exportedBy) pkg.metadata.exportedBy = options.exportedBy;
    if (options.organization) pkg.metadata.organization = options.organization;
    if (options.environment) pkg.metadata.environment = options.environment;
    if (options.tags) pkg.metadata.tags = [...options.tags];
    if (options.theme) pkg.theme = { ...options.theme };
    if (options.extensions) pkg.extensions = { ...options.extensions };

    pkg.datasets = options.datasets ? JSON.parse(JSON.stringify(options.datasets)) : [];
    pkg.dashboards = options.dashboards ? JSON.parse(JSON.stringify(options.dashboards)) : [];
    pkg.reports = options.reports ? JSON.parse(JSON.stringify(options.reports)) : [];

    pkg.metadata.itemCounts = {
      datasets: pkg.datasets.length,
      dashboards: pkg.dashboards.length,
      reports: pkg.reports.length
    };

    // Calculate checksum of payloads
    pkg.metadata.checksum = computePackageChecksum({
      datasets: pkg.datasets,
      dashboards: pkg.dashboards,
      reports: pkg.reports
    });

    return pkg;
  }

  /**
   * Serializes a package to formatted or compact JSON.
   */
  exportPackageToJson(pkg: GpAnalyticsPackage, pretty = true): string {
    return JSON.stringify(pkg, null, pretty ? 2 : 0);
  }

  /**
   * Validates a JSON string or object against the gp-analytics-package schema.
   */
  validatePackage(jsonOrObj: string | unknown): GpPackageValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const itemCounts: GpPackageItemCounts = { datasets: 0, dashboards: 0, reports: 0 };

    let parsed: any;
    if (typeof jsonOrObj === 'string') {
      try {
        parsed = JSON.parse(jsonOrObj);
      } catch (e: any) {
        return {
          isValid: false,
          formatMatch: false,
          version: 'unknown',
          errors: [`Invalid JSON format: ${e.message}`],
          warnings: [],
          itemCounts
        };
      }
    } else if (typeof jsonOrObj === 'object' && jsonOrObj !== null) {
      parsed = jsonOrObj;
    } else {
      return {
        isValid: false,
        formatMatch: false,
        version: 'unknown',
        errors: ['Provided input is not a valid JSON string or object'],
        warnings: [],
        itemCounts
      };
    }

    // Format & Version check
    const formatMatch = parsed.format === 'gp-analytics-package';
    if (!formatMatch) {
      errors.push(`Unrecognized package format '${parsed.format}'. Expected 'gp-analytics-package'.`);
    }

    const version = parsed.version || 'unknown';
    if (!parsed.version) {
      warnings.push("Package missing 'version' property. Defaulting to 1.0.0 compatible.");
    }

    // Metadata check
    if (!parsed.metadata || typeof parsed.metadata !== 'object') {
      errors.push("Missing 'metadata' object in package.");
    } else {
      if (!parsed.metadata.id) warnings.push('Metadata missing unique id.');
      if (!parsed.metadata.name) warnings.push('Metadata missing human-readable name.');
    }

    // Datasets validation
    if (parsed.datasets) {
      if (!Array.isArray(parsed.datasets)) {
        errors.push("'datasets' property must be an array.");
      } else {
        itemCounts.datasets = parsed.datasets.length;
        parsed.datasets.forEach((ds: any, idx: number) => {
          if (!ds.datasetId || !ds.name) {
            errors.push(`Dataset at index [${idx}] missing required 'datasetId' or 'name'.`);
          }
          if (!Array.isArray(ds.fields)) {
            warnings.push(`Dataset '${ds.name || idx}' has missing or non-array 'fields'.`);
          }
        });
      }
    }

    // Dashboards validation
    if (parsed.dashboards) {
      if (!Array.isArray(parsed.dashboards)) {
        errors.push("'dashboards' property must be an array.");
      } else {
        itemCounts.dashboards = parsed.dashboards.length;
        parsed.dashboards.forEach((d: any, idx: number) => {
          if (!d.id || !d.title) {
            errors.push(`Dashboard at index [${idx}] missing required 'id' or 'title'.`);
          }
          if (!Array.isArray(d.widgets)) {
            warnings.push(`Dashboard '${d.title || idx}' has missing or non-array 'widgets'.`);
          }
        });
      }
    }

    // Reports validation
    if (parsed.reports) {
      if (!Array.isArray(parsed.reports)) {
        errors.push("'reports' property must be an array.");
      } else {
        itemCounts.reports = parsed.reports.length;
        parsed.reports.forEach((r: any, idx: number) => {
          if (!r.id || !r.name || !r.type) {
            errors.push(`Report at index [${idx}] missing required 'id', 'name', or 'type'.`);
          }
          if (!['tabular', 'pivot', 'chart'].includes(r.type)) {
            warnings.push(`Report '${r.name || idx}' has uncommon report type '${r.type}'.`);
          }
          if (!r.config) {
            errors.push(`Report '${r.name || idx}' missing required 'config' object.`);
          }
        });
      }
    }

    // Checksum verification
    if (parsed.metadata?.checksum) {
      const calculated = computePackageChecksum({
        datasets: parsed.datasets || [],
        dashboards: parsed.dashboards || [],
        reports: parsed.reports || []
      });
      if (calculated !== parsed.metadata.checksum) {
        warnings.push('Package checksum mismatch: content may have been modified outside the exporter.');
      }
    }

    return {
      isValid: errors.length === 0,
      formatMatch,
      version,
      errors,
      warnings,
      itemCounts,
      metadata: parsed.metadata
    };
  }

  /**
   * Imports and hydrates a package from JSON with optional ID regeneration (mode = 'copy').
   */
  importPackage(jsonString: string, mode: GpPackageImportMode = 'merge'): GpAnalyticsPackage {
    const validation = this.validatePackage(jsonString);
    if (!validation.isValid) {
      throw new Error(`Failed to import package: ${validation.errors.join('; ')}`);
    }

    const pkg: GpAnalyticsPackage = JSON.parse(jsonString);

    if (mode === 'copy') {
      const idSuffix = `_copy_${Date.now().toString(36)}`;
      pkg.metadata.id = `${pkg.metadata.id}${idSuffix}`;
      pkg.metadata.name = `${pkg.metadata.name} (Copy)`;

      pkg.datasets.forEach((ds) => {
        ds.datasetId = `${ds.datasetId}${idSuffix}`;
        ds.name = `${ds.name} (Copy)`;
      });

      pkg.dashboards.forEach((d) => {
        d.id = `${d.id}${idSuffix}`;
        d.title = `${d.title} (Copy)`;
      });

      pkg.reports.forEach((r) => {
        r.id = `${r.id}${idSuffix}`;
        r.name = `${r.name} (Copy)`;
      });
    }

    return pkg;
  }

  /**
   * Prepares a distribution payload formatted for transmission to a remote REST/API endpoint.
   */
  prepareDistributionPayload(
    pkg: GpAnalyticsPackage,
    targetEndpoint = '/api/v1/analytics/distribution/packages'
  ): GpDistributionPayload {
    const jsonStr = this.exportPackageToJson(pkg, false);
    const payloadSizeBytes = new Blob([jsonStr]).size;

    return {
      packageId: pkg.metadata.id,
      name: pkg.metadata.name,
      version: pkg.version,
      payloadSizeBytes,
      checksum: pkg.metadata.checksum || computePackageChecksum(jsonStr),
      exportedAt: pkg.metadata.exportedAt,
      targetEndpoint,
      package: pkg
    };
  }

  /**
   * Downloads a JSON file in the browser client.
   */
  downloadJsonFile(filename: string, jsonContent: string): void {
    if (typeof window === 'undefined' || !window.document) return;
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename.endsWith('.json') ? filename : `${filename}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Reads the text content of an uploaded JSON File.
   */
  readJsonFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error || new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  /**
   * Export single Dataset as a standalone portable package.
   */
  exportSingleDataset(dataset: Dataset, pretty = true): string {
    const pkg = this.createPackage({
      name: `Dataset - ${dataset.name}`,
      description: dataset.description || `Standalone export of dataset ${dataset.name}`,
      datasets: [dataset]
    });
    return this.exportPackageToJson(pkg, pretty);
  }

  /**
   * Export single Dashboard as a standalone portable package.
   */
  exportSingleDashboard(dashboard: GpDashboardConfig, pretty = true): string {
    const pkg = this.createPackage({
      name: `Dashboard - ${dashboard.title}`,
      description: dashboard.subtitle || `Standalone export of dashboard ${dashboard.title}`,
      dashboards: [dashboard]
    });
    return this.exportPackageToJson(pkg, pretty);
  }

  /**
   * Export single Report as a standalone portable package.
   */
  exportSingleReport(report: GpReportConfig, pretty = true): string {
    const pkg = this.createPackage({
      name: `Report - ${report.name}`,
      description: report.description || `Standalone export of report ${report.name}`,
      reports: [report]
    });
    return this.exportPackageToJson(pkg, pretty);
  }
}
