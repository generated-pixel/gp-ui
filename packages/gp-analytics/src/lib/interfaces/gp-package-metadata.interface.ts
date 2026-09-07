import { GpPackageItemCounts } from './gp-package-item-counts.interface';

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
