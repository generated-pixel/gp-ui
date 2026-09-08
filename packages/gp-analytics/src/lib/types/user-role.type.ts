/**
 * User roles within gp-analytics that govern permissions for datasets,
 * dashboards, reports, libraries, global filtering, and global sorting.
 */
export type GpUserRole =
  | 'admin'
  | 'dataset-designer'
  | 'dashboard-designer'
  | 'manager'
  | 'regular';
