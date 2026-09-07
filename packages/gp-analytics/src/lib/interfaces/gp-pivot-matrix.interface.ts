export interface GpPivotMatrix {
  rowHeaders: string[];
  colHeaders: string[];
  matrix: (number | string | null)[][];
  rowTotals: (number | null)[];
  colTotals: (number | null)[];
  grandTotal: number | null;
  rowValues?: string[];
  colValues?: string[];
}
