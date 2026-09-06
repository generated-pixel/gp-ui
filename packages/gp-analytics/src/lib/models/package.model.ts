export * from '../types/gp-package-import-mode.type';
export * from '../interfaces/gp-package-item-counts.interface';
export * from '../interfaces/gp-package-metadata.interface';
export * from '../interfaces/gp-package-theme-config.interface';
export * from '../interfaces/gp-analytics-package.interface';
export * from '../interfaces/gp-package-validation-result.interface';
export * from '../interfaces/gp-distribution-payload.interface';

import { GpAnalyticsPackage } from '../interfaces/gp-analytics-package.interface';

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
        reports: 0
      }
    },
    datasets: [],
    dashboards: [],
    reports: []
  };
}
