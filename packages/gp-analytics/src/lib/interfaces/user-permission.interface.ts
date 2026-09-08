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
 * Metadata descriptor for an available permission.
 */
export interface GpPermissionDescriptor {
  key: keyof GpRolePermissions;
  label: string;
  description: string;
  category: 'Datasets' | 'Dashboards & Reports' | 'Libraries' | 'Filtering & Sorting' | 'Layout';
}

/**
 * Full catalog of available permissions that users can pick from when defining their own custom roles.
 */
export const GP_AVAILABLE_PERMISSIONS: GpPermissionDescriptor[] = [
  {
    key: 'canManageDatasets',
    label: 'Manage Datasets',
    description: 'Create, modify, and delete raw analytical datasets and relational tables.',
    category: 'Datasets'
  },
  {
    key: 'canManageReports',
    label: 'Manage Reports',
    description: 'Author, edit, and configure primary analytical and tabular report definitions.',
    category: 'Dashboards & Reports'
  },
  {
    key: 'canManageDashboards',
    label: 'Manage Dashboards',
    description: 'Configure and publish organization-wide analytical dashboards.',
    category: 'Dashboards & Reports'
  },
  {
    key: 'canShareDashboards',
    label: 'Share Dashboards',
    description: 'Generate distribution links and share dashboards across teams.',
    category: 'Dashboards & Reports'
  },
  {
    key: 'canCreateDerivedWidgets',
    label: 'Create Derived Graphs & KPIs',
    description: 'Build custom analytical graphs and KPI scorecards derived directly off anchored reports.',
    category: 'Dashboards & Reports'
  },
  {
    key: 'canManageLibraries',
    label: 'Manage Libraries',
    description: 'Publish reusable widgets and reports to the organization-wide shared library.',
    category: 'Libraries'
  },
  {
    key: 'canCreateCustomDashboards',
    label: 'Create Custom Dashboards from Library',
    description: 'Pick templates from widget libraries to assemble and save personal dashboards.',
    category: 'Libraries'
  },
  {
    key: 'canConfigureGlobalSorting',
    label: 'Configure Global Sorting Fields',
    description: 'Define which dataset dimensions and measures are exposed in the global sort selector.',
    category: 'Filtering & Sorting'
  },
  {
    key: 'canConfigureGlobalFilters',
    label: 'Configure Global Filters',
    description: 'Author advanced multi-condition global filters across the dashboard.',
    category: 'Filtering & Sorting'
  },
  {
    key: 'canAddFilters',
    label: 'Add Filters',
    description: 'Apply ad-hoc filters to dashboard and report data.',
    category: 'Filtering & Sorting'
  },
  {
    key: 'isRestrictedToBasicFilters',
    label: 'Restricted to Basic Filters Only',
    description: 'Lock users to only pre-configured basic filters with simple values.',
    category: 'Filtering & Sorting'
  },
  {
    key: 'canCustomizeLayout',
    label: 'Customize Grid Layout',
    description: 'Drag to reposition and resize widgets within the responsive dashboard grid.',
    category: 'Layout'
  }
];

/**
 * Definition of a role (built-in or user-defined).
 */
export interface GpRoleDefinition {
  id: string;
  name: string;
  description: string;
  permissions: GpRolePermissions;
  isBuiltIn?: boolean;
  badgeSeverity?: 'primary' | 'secondary' | 'success' | 'info' | 'warning';
}

/**
 * Creates an empty/default permissions object with all permissions disabled.
 */
export function createEmptyPermissions(): GpRolePermissions {
  return {
    canManageDatasets: false,
    canManageReports: false,
    canManageDashboards: false,
    canShareDashboards: false,
    canManageLibraries: false,
    canCreateCustomDashboards: false,
    canCreateDerivedWidgets: false,
    canConfigureGlobalSorting: false,
    canConfigureGlobalFilters: false,
    canAddFilters: false,
    isRestrictedToBasicFilters: false,
    canCustomizeLayout: false
  };
}

/**
 * Standard permissions preset lookup for each built-in role.
 */
export const GP_ROLE_PERMISSIONS_MAP: Record<string, GpRolePermissions> = {
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

/**
 * Initial built-in role definitions list.
 */
export const GP_BUILT_IN_ROLES: GpRoleDefinition[] = [
  {
    id: 'admin',
    name: 'Admin',
    description:
      'Superusers who can manage datasets, create reports, edit dashboards, configure global sorts, and administer libraries.',
    permissions: GP_ROLE_PERMISSIONS_MAP['admin'],
    isBuiltIn: true,
    badgeSeverity: 'warning'
  },
  {
    id: 'dataset-designer',
    name: 'Dataset Designer',
    description: 'Data architects who can create and edit raw data schemas, datasets, reports, and dashboards.',
    permissions: GP_ROLE_PERMISSIONS_MAP['dataset-designer'],
    isBuiltIn: true,
    badgeSeverity: 'info'
  },
  {
    id: 'dashboard-designer',
    name: 'Dashboard Designer',
    description:
      'Analytical authors who build, edit, and share dashboards and reports from created datasets, and create widget libraries.',
    permissions: GP_ROLE_PERMISSIONS_MAP['dashboard-designer'],
    isBuiltIn: true,
    badgeSeverity: 'primary'
  },
  {
    id: 'manager',
    name: 'Manager',
    description:
      'Business leaders who consume dashboards, build personal dashboards using curated libraries, and filter available data.',
    permissions: GP_ROLE_PERMISSIONS_MAP['manager'],
    isBuiltIn: true,
    badgeSeverity: 'success'
  },
  {
    id: 'regular',
    name: 'Regular User',
    description: 'Operational users who consume pre-built dashboards and reports with basic filtering.',
    permissions: GP_ROLE_PERMISSIONS_MAP['regular'],
    isBuiltIn: true,
    badgeSeverity: 'secondary'
  }
];
