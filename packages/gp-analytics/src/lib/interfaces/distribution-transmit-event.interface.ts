import { GpDistributionPayload } from './gp-distribution-payload.interface';

export interface DistributionTransmitEvent {
  payload: GpDistributionPayload;
  endpoint: string;
  environment: string;
}
