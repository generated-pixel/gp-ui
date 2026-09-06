import { GpFilterOperator } from '../types/gp-filter-operator.type';

export interface GpDashboardFilterField {
  fieldId: string;
  label: string;
  operator?: GpFilterOperator;
  defaultValue?: any;
  options?: { label: string; value: any }[];
}
