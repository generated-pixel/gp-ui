import { Dataset } from './dataset.model';
import { GpDashboardConfig } from './dashboard.model';
import { GpReportConfig } from './report.model';

export type GpPackageImportMode = 'merge' | 'replace' | 'copy';

export interface GpPackageItemCounts {
  datasets: number;
  dashboards: number;
  reports: number;
}

export interface GpPackageMetadata {
  id: string;
  name: string;
  description?: string;
  exportedAt: string;
  exportedBy?: string;
  organization?: string;
  environment?: 'development' | 'staging' | 'production' | string;
  checksum?: string;
  tags?: string[];
  itemCounts?: GpPackageItemCounts;
}

export interface GpPackageThemeConfig {
  primaryColor?: string;
  mode?: 'light' | 'dark' | 'auto';
  themeId?: string;
}

export interface GpAnalyticsPackage {
  $schema?: string;
  format: 'gp-analytics-package';
  version: string; // e.g. '1.0.0'
  metadata: GpPackageMetadata;
  datasets: Dataset[];
  dashboards: GpDashboardConfig[];
  reports: GpReportConfig[];
  theme?: GpPackageThemeConfig;
  extensions?: Record<string, unknown>;
}

export interface GpPackageValidationResult {
  isValid: boolean;
  formatMatch: boolean;
  version: string;
  errors: string[];
  warnings: string[];
  itemCounts: GpPackageItemCounts;
  metadata?: GpPackageMetadata;
}

export interface GpDistributionPayload {
  packageId: string;
  name: string;
  version: string;
  payloadSizeBytes: number;
  checksum: string;
  exportedAt: string;
  targetEndpoint?: string;
  package: GpAnalyticsPackage;
}

export function computePackageChecksum(data: unknown): string {
  const str = typeof data === 'string' ? data : JSON.stringify(data);
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

export function createEmptyPackage(name = 'Analytics Distribution Package'): GpAnalyticsPackage {
  const timestamp = new Date().toISOString();
  const id = `pkg_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
  return {
    $schema: 'https://generatedpixel.dev/schemas/gp-analytics-package.v1.json',
    format: 'gp-analytics-package',
    version: '1.0.0',
    metadata: {
      id,
      name,
      exportedAt: timestamp,
      exportedBy: 'gp-analytics',
      environment: 'production',
      itemCounts: {
        datasets: 0,
        dashboards: 0,
        reports: 0,
      },
    },
    datasets: [],
    dashboards: [],
    reports: [],
  };
}
