import { GpPackageItemCounts } from './gp-package-item-counts.interface';
import { GpPackageMetadata } from './gp-package-metadata.interface';

export interface GpPackageValidationResult {
  isValid: boolean;
  formatMatch: boolean;
  version: string;
  errors: string[];
  warnings: string[];
  itemCounts: GpPackageItemCounts;
  metadata?: GpPackageMetadata;
}
