import { GpFilterOperator } from '../types/gp-filter-operator.type';

export interface GpFilterCondition {
  fieldId: string;
  operator: GpFilterOperator;
  value: any;
  secondValue?: any;
  valueTo?: any;
}
