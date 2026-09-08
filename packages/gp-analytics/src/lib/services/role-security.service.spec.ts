import { TestBed } from '@angular/core/testing';
import { GpRoleSecurityService } from './role-security.service';
import { GpUserRole } from '../types/user-role.type';

describe('GpRoleSecurityService', () => {
  let service: GpRoleSecurityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GpRoleSecurityService]
    });
    service = TestBed.inject(GpRoleSecurityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('admin role', () => {
    const role: GpUserRole = 'admin';

    it('has all permissions enabled', () => {
      const perms = service.getPermissions(role);
      expect(perms.canManageDatasets).toBe(true);
      expect(perms.canManageReports).toBe(true);
      expect(perms.canManageDashboards).toBe(true);
      expect(perms.canShareDashboards).toBe(true);
      expect(perms.canManageLibraries).toBe(true);
      expect(perms.canCreateCustomDashboards).toBe(true);
      expect(perms.canCreateDerivedWidgets).toBe(true);
      expect(perms.canConfigureGlobalSorting).toBe(true);
      expect(perms.canConfigureGlobalFilters).toBe(true);
      expect(perms.canAddFilters).toBe(true);
      expect(perms.isRestrictedToBasicFilters).toBe(false);
      expect(perms.canCustomizeLayout).toBe(true);
    });
  });

  describe('dataset-designer role', () => {
    const role: GpUserRole = 'dataset-designer';

    it('can manage datasets, data, reports, and dashboards', () => {
      const perms = service.getPermissions(role);
      expect(perms.canManageDatasets).toBe(true);
      expect(perms.canManageReports).toBe(true);
      expect(perms.canManageDashboards).toBe(true);
      expect(perms.canShareDashboards).toBe(true);
      expect(perms.canManageLibraries).toBe(true);
      expect(perms.canCreateDerivedWidgets).toBe(true);
    });
  });

  describe('dashboard-designer role', () => {
    const role: GpUserRole = 'dashboard-designer';

    it('CANNOT manage datasets, but CAN create dashboards, reports, and libraries', () => {
      const perms = service.getPermissions(role);
      expect(perms.canManageDatasets).toBe(false);
      expect(perms.canManageReports).toBe(true);
      expect(perms.canManageDashboards).toBe(true);
      expect(perms.canShareDashboards).toBe(true);
      expect(perms.canManageLibraries).toBe(true);
      expect(perms.canCreateDerivedWidgets).toBe(true);
      expect(perms.canConfigureGlobalSorting).toBe(true);
    });
  });

  describe('manager role', () => {
    const role: GpUserRole = 'manager';

    it('can consume dashboards and create custom dashboards from libraries, but cannot manage datasets or publish to shared libraries', () => {
      const perms = service.getPermissions(role);
      expect(perms.canManageDatasets).toBe(false);
      expect(perms.canManageReports).toBe(false);
      expect(perms.canManageDashboards).toBe(false);
      expect(perms.canManageLibraries).toBe(false);
      expect(perms.canCreateCustomDashboards).toBe(true);
      expect(perms.canCreateDerivedWidgets).toBe(true);
      expect(perms.canConfigureGlobalSorting).toBe(false);
      expect(perms.canAddFilters).toBe(true);
      expect(perms.isRestrictedToBasicFilters).toBe(false);
      expect(perms.canCustomizeLayout).toBe(true);
    });
  });

  describe('regular role', () => {
    const role: GpUserRole = 'regular';

    it('can only consume dashboards and reports with basic filtering only', () => {
      const perms = service.getPermissions(role);
      expect(perms.canManageDatasets).toBe(false);
      expect(perms.canManageReports).toBe(false);
      expect(perms.canManageDashboards).toBe(false);
      expect(perms.canShareDashboards).toBe(false);
      expect(perms.canManageLibraries).toBe(false);
      expect(perms.canCreateCustomDashboards).toBe(false);
      expect(perms.canCreateDerivedWidgets).toBe(false);
      expect(perms.canConfigureGlobalSorting).toBe(false);
      expect(perms.canConfigureGlobalFilters).toBe(false);
      expect(perms.canAddFilters).toBe(true);
      expect(perms.isRestrictedToBasicFilters).toBe(true);
      expect(perms.canCustomizeLayout).toBe(false);
    });
  });

  describe('permission overrides', () => {
    it('applies overrides to the base role permissions', () => {
      const perms = service.getPermissions('regular', { canCustomizeLayout: true });
      expect(perms.canCustomizeLayout).toBe(true);
      expect(perms.canManageDatasets).toBe(false);
    });
  });

  describe('descriptions and badges', () => {
    it('provides role descriptions and badges', () => {
      expect(service.getRoleDescription('admin')).toContain('Superuser');
      expect(service.getRoleDescription('regular')).toContain('Operational users');
      expect(service.getRoleBadge('admin').label).toBe('Admin');
      expect(service.getRoleBadge('manager').label).toBe('Manager');
    });
  });

  describe('User-Defined Custom Roles and Available Permissions', () => {
    it('provides the complete catalog of available permissions with categories and descriptions', () => {
      const permsList = service.getAvailablePermissions();
      expect(permsList.length).toBeGreaterThan(5);

      const datasetPerm = permsList.find((p) => p.key === 'canManageDatasets');
      expect(datasetPerm).toBeDefined();
      expect(datasetPerm?.category).toBe('Datasets');
      expect(datasetPerm?.label).toBe('Manage Datasets');
      expect(datasetPerm?.description).toBeTruthy();

      const sortPerm = permsList.find((p) => p.key === 'canConfigureGlobalSorting');
      expect(sortPerm).toBeDefined();
      expect(sortPerm?.category).toBe('Filtering & Sorting');
    });

    it('allows users to define and register their own custom roles', () => {
      const customRole = service.defineCustomRole(
        'Financial Auditor',
        'Can view and sort dashboards and add filters, but cannot edit or move layout',
        {
          canAddFilters: true,
          canConfigureGlobalSorting: false,
          canCustomizeLayout: false,
          canManageDatasets: false,
          canManageReports: false
        },
        'warning',
        'role-auditor'
      );

      expect(customRole.id).toBe('role-auditor');
      expect(customRole.name).toBe('Financial Auditor');
      expect(customRole.isBuiltIn).toBe(false);

      // Verify permissions via service
      const auditorPerms = service.getPermissions('role-auditor');
      expect(auditorPerms.canAddFilters).toBe(true);
      expect(auditorPerms.canCustomizeLayout).toBe(false);
      expect(auditorPerms.canManageDatasets).toBe(false);

      // Verify badge and description
      expect(service.getRoleBadge('role-auditor').label).toBe('Financial Auditor');
      expect(service.getRoleBadge('role-auditor').severity).toBe('warning');
      expect(service.getRoleDescription('role-auditor')).toContain('Financial Auditor');

      // Verify unregistration
      expect(service.unregisterRole('role-auditor')).toBe(true);
      expect(service.getRoleDefinition('role-auditor')).toBeUndefined();
    });

    it('prevents unregistering built-in roles', () => {
      expect(service.unregisterRole('admin')).toBe(false);
      expect(service.getRoleDefinition('admin')).toBeDefined();
    });
  });
});
