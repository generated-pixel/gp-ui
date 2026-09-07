import { GpTimeGrain } from '../types/gp-time-grain.type';
import { GpFilterCondition } from './gp-filter-condition.interface';
import { GpMeasureQuery } from './gp-measure-query.interface';
import { GpSortSpec } from './gp-sort-spec.interface';
import { GpCalculatedField } from './gp-calculated-field.interface';

export interface GpAnalyticalQuerySpec {
  datasetId?: string;
  dimensions: string[];
  measures: GpMeasureQuery[];
  filters?: GpFilterCondition[];
  sorts?: GpSortSpec[];
  limit?: number;
  offset?: number;
  timeDimension?: string;
  timeFieldId?: string;
  timeGrain?: GpTimeGrain;
  calculatedFields?: GpCalculatedField[];
  pagination?: {
    page: number;
    pageSize: number;
  };
  pivot?: {
    rowDimensions: string[];
    colDimensions: string[];
    valueMeasures: string[];
  };
  comparison?: {
    type: 'previous-period' | 'previous-year' | 'target';
    targetValue?: number;
  };
}
