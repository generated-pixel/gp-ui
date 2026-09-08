import { Injectable } from '@angular/core';
import { GpUserRole } from '../types/user-role.type';
import { GpRolePermissions, GP_ROLE_PERMISSIONS_MAP } from '../interfaces/user-permission.interface';

@Injectable({
  providedIn: 'root'
})
export class GpRoleSecurityService {
  /**
   * Retrieves the permission set for the specified role.
   */
  getPermissions(role: GpUserRole, overrides?: Partial<GpRolePermissions>): GpRolePermissions {
    const base = GP_ROLE_PERMISSIONS_MAP[role] ?? GP_ROLE_PERMISSIONS_MAP.regular;
    if (!overrides) {
      return { ...base };
    }
    return { ...base, ...overrides };
  }

  /**
   * Checks whether a given role has a specific permission.
   */
  hasPermission(
    role: GpUserRole,
    permission: keyof GpRolePermissions,
    overrides?: Partial<GpRolePermissions>
  ): boolean {
    const perms = this.getPermissions(role, overrides);
    return Boolean(perms[permission]);
  }

  /**
   * Human readable description of each role for UI tooltips & indicators.
   */
  getRoleDescription(role: GpUserRole): string {
    switch (role) {
      case 'admin':
        return 'Administrator: Unrestricted access to manage datasets, reports, dashboards, libraries, and global configurations.';
      case 'dataset-designer':
        return 'Dataset Designer: Can create and edit datasets, data structures, reports, and dashboards.';
      case 'dashboard-designer':
        return 'Dashboard Designer: Can create, edit, and share dashboards, reports, and widget/report libraries from existing datasets.';
      case 'manager':
        return 'Manager User: Can consume dashboards, build personal dashboards from curated libraries, and filter on available fields.';
      case 'regular':
        return 'Regular User: Read-only access to consume dashboards and reports with basic filtering.';
    }
  }

  /**
   * Badge variant / label helper for UI.
   */
  getRoleBadge(role: GpUserRole): {
    label: string;
    severity: 'primary' | 'secondary' | 'success' | 'info' | 'warning';
  } {
    switch (role) {
      case 'admin':
        return { label: 'Admin', severity: 'warning' };
      case 'dataset-designer':
        return { label: 'Dataset Designer', severity: 'info' };
      case 'dashboard-designer':
        return { label: 'Dashboard Designer', severity: 'primary' };
      case 'manager':
        return { label: 'Manager', severity: 'success' };
      case 'regular':
        return { label: 'Regular User', severity: 'secondary' };
    }
  }
}
