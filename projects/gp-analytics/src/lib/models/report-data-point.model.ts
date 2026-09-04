export interface ReportDataPoint {
  key: string;
  label: string;
  value: number | string | boolean | null;
  displayValue?: string;
  formattedValue: string;
  role?: string;
  color?: string;
}
