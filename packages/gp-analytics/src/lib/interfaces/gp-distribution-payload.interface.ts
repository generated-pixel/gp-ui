import { GpAnalyticsPackage } from './gp-analytics-package.interface';

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
