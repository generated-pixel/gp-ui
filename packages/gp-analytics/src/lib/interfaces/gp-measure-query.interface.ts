import { GpAggregationType } from '../types/gp-aggregation-type.type';

export interface GpMeasureQuery {
  fieldId: string;
  aggregation: GpAggregationType;
  alias?: string;
  label?: string;
  format?: string;
}
