import { GpAnalyticsPackage } from './gp-analytics-package.interface';
import { GpPackageImportMode } from '../types/gp-package-import-mode.type';

export interface PackageImportEvent {
  package: GpAnalyticsPackage;
  mode: GpPackageImportMode;
}
