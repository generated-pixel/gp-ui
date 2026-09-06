export interface LocalizedValue<T = unknown> {
  value: T;
  displayValue: Record<string, string>;
}
