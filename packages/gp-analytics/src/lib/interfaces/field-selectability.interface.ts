export interface FieldSelectability {
  selectable: boolean;
  reason?: 'not-visible' | 'not-usable-in-reports' | 'table-not-related';
  message?: string;
}
