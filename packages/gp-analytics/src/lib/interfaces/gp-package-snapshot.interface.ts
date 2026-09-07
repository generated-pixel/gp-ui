import { GpPackageItemCounts } from './gp-package-item-counts.interface';

export interface GpPackageSnapshot {
  id: string;
  timestamp: string;
  action: 'export' | 'import' | 'distribution';
  name: string;
  environment?: string;
  itemCounts: GpPackageItemCounts;
  jsonPayload: string;
}
