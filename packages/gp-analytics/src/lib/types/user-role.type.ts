/**
 * Built-in role identifiers.
 */
export type GpBuiltInRole = 'admin' | 'dataset-designer' | 'dashboard-designer' | 'manager' | 'regular';

/**
 * User roles within gp-analytics. Can be one of the built-in roles
 * or any custom user-defined role identifier.
 */
export type GpUserRole = GpBuiltInRole | (string & {});
