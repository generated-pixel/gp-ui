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
      expect(service.getRoleDescription('admin')).toContain('Administrator');
      expect(service.getRoleDescription('regular')).toContain('Regular User');
      expect(service.getRoleBadge('admin').label).toBe('Admin');
      expect(service.getRoleBadge('manager').label).toBe('Manager');
    });
  });
});
