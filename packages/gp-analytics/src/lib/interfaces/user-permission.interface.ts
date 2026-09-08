import { GpUserRole } from '../types/user-role.type';

/**
 * Granular permissions governing capabilities across datasets,
 * reports, dashboards, libraries, global filtering, and sorting.
 */
export interface GpRolePermissions {
  /** Can create, modify, or delete raw datasets and schemas */
  canManageDatasets: boolean;
  /** Can create, modify, or delete primary report definitions */
  canManageReports: boolean;
  /** Can create, modify, or delete primary dashboard definitions */
  canManageDashboards: boolean;
  /** Can share dashboards and reports with other users or teams */
  canShareDashboards: boolean;
  /** Can publish widgets or reports to the shared organization library */
  canManageLibraries: boolean;
  /** Can create custom/personal dashboards using library templates or derived items */
  canCreateCustomDashboards: boolean;
  /** Can author derived graphs (charts) and KPIs off of an anchored report */
  canCreateDerivedWidgets: boolean;
  /** Can configure which fields are exposed for global sorting */
  canConfigureGlobalSorting: boolean;
  /** Can configure advanced global filters and presets */
  canConfigureGlobalFilters: boolean;
  /** Can apply filters (manager / designer / admin) */
  canAddFilters: boolean;
  /** Restricted strictly to basic pre-configured filters */
  isRestrictedToBasicFilters: boolean;
  /** Allowed to rearrange/resize grid items in the dashboard */
  canCustomizeLayout: boolean;
}

/**
 * Standard permissions preset lookup for each built-in role.
 */
export const GP_ROLE_PERMISSIONS_MAP: Record<GpUserRole, GpRolePermissions> = {
  admin: {
    canManageDatasets: true,
    canManageReports: true,
    canManageDashboards: true,
    canShareDashboards: true,
    canManageLibraries: true,
    canCreateCustomDashboards: true,
    canCreateDerivedWidgets: true,
    canConfigureGlobalSorting: true,
    canConfigureGlobalFilters: true,
    canAddFilters: true,
    isRestrictedToBasicFilters: false,
    canCustomizeLayout: true
  },
  'dataset-designer': {
    canManageDatasets: true,
    canManageReports: true,
    canManageDashboards: true,
    canShareDashboards: true,
    canManageLibraries: true,
    canCreateCustomDashboards: true,
    canCreateDerivedWidgets: true,
    canConfigureGlobalSorting: true,
    canConfigureGlobalFilters: true,
    canAddFilters: true,
    isRestrictedToBasicFilters: false,
    canCustomizeLayout: true
  },
  'dashboard-designer': {
    canManageDatasets: false, // Cannot create or edit raw datasets
    canManageReports: true,
    canManageDashboards: true,
    canShareDashboards: true,
    canManageLibraries: true, // Can create libraries of widgets / reports
    canCreateCustomDashboards: true,
    canCreateDerivedWidgets: true,
    canConfigureGlobalSorting: true,
    canConfigureGlobalFilters: true,
    canAddFilters: true,
    isRestrictedToBasicFilters: false,
    canCustomizeLayout: true
  },
  manager: {
    canManageDatasets: false,
    canManageReports: false,
    canManageDashboards: false,
    canShareDashboards: false,
    canManageLibraries: false, // Cannot publish to shared library
    canCreateCustomDashboards: true, // Can create own dashboards from libraries
    canCreateDerivedWidgets: true, // Can create personal derived KPIs/graphs
    canConfigureGlobalSorting: false, // Can sort only by available fields
    canConfigureGlobalFilters: false,
    canAddFilters: true, // Can add filters but restricted to available fields
    isRestrictedToBasicFilters: false,
    canCustomizeLayout: true
  },
  regular: {
    canManageDatasets: false,
    canManageReports: false,
    canManageDashboards: false,
    canShareDashboards: false,
    canManageLibraries: false,
    canCreateCustomDashboards: false,
    canCreateDerivedWidgets: false,
    canConfigureGlobalSorting: false,
    canConfigureGlobalFilters: false,
    canAddFilters: true,
    isRestrictedToBasicFilters: true, // Can only add basic filters
    canCustomizeLayout: false
  }
};
