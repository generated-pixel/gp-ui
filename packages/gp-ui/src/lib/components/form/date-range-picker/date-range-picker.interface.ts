export interface GpDateRange {
  start: Date | null;
  end: Date | null;
}

export interface GpDateRangePreset {
  label: string;
  range: () => GpDateRange;
}
