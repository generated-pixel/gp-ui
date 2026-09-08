/**
 * Describes a field that can be selected for global sorting.
 */
export interface GpGlobalSortFieldOption {
  fieldId: string;
  label: string;
  type?: 'string' | 'number' | 'date' | 'boolean';
}

/**
 * Configuration for dashboard-wide global sorting.
 */
export interface GpGlobalSortConfig {
  /**
   * Allowed fields selected by designers/admins that users can sort by.
   */
  availableFields: GpGlobalSortFieldOption[];

  /**
   * Currently active field ID for global sorting, or null if no global sort is active.
   */
  activeFieldId: string | null;

  /**
   * Sort direction when global sorting is active.
   */
  activeOrder: 'asc' | 'desc';
}

/**
 * Creates default global sort configuration.
 */
export function createDefaultGlobalSortConfig(
  availableFields: GpGlobalSortFieldOption[] = [],
  defaultFieldId: string | null = null,
  order: 'asc' | 'desc' = 'desc'
): GpGlobalSortConfig {
  return {
    availableFields,
    activeFieldId: defaultFieldId,
    activeOrder: order
  };
}
