import { Injectable, signal } from '@angular/core';
import { GpUserRole } from '../types/user-role.type';
import {
  GpRolePermissions,
  GpPermissionDescriptor,
  GpRoleDefinition,
  GP_AVAILABLE_PERMISSIONS,
  GP_BUILT_IN_ROLES,
  createEmptyPermissions
} from '../interfaces/user-permission.interface';
import { UniqueId } from '../utils/unique-id';

@Injectable({
  providedIn: 'root'
})
export class GpRoleSecurityService {
  /**
   * Internal reactive map of registered roles (both built-in and user-defined).
   */
  private readonly rolesMap = signal<Map<string, GpRoleDefinition>>(this.initializeRolesMap());

  /**
   * Returns the list of all available granular permissions that can be granted.
   * Useful for permission pickers, matrices, and role authoring forms.
   */
  getAvailablePermissions(): GpPermissionDescriptor[] {
    return [...GP_AVAILABLE_PERMISSIONS];
  }

  /**
   * Returns all currently registered roles (built-in and custom user-defined roles).
   */
  getRegisteredRoles(): GpRoleDefinition[] {
    return Array.from(this.rolesMap().values());
  }

  /**
   * Retrieves the role definition for a given role ID.
   */
  getRoleDefinition(roleId: GpUserRole): GpRoleDefinition | undefined {
    return this.rolesMap().get(roleId);
  }

  /**
   * Registers a role definition (custom or overridden).
   */
  registerRole(roleDef: GpRoleDefinition): void {
    this.rolesMap.update((map) => {
      const next = new Map(map);
      next.set(roleDef.id, roleDef);
      return next;
    });
  }

  /**
   * Creates, registers, and returns a new user-defined custom role.
   */
  defineCustomRole(
    name: string,
    description: string,
    permissions: Partial<GpRolePermissions>,
    badgeSeverity: 'primary' | 'secondary' | 'success' | 'info' | 'warning' = 'info',
    customId?: string
  ): GpRoleDefinition {
    const id = customId || UniqueId.generate('role-custom-');
    const fullPermissions: GpRolePermissions = {
      ...createEmptyPermissions(),
      ...permissions
    };

    const newRole: GpRoleDefinition = {
      id,
      name,
      description,
      permissions: fullPermissions,
      isBuiltIn: false,
      badgeSeverity
    };

    this.registerRole(newRole);
    return newRole;
  }

  /**
   * Unregisters a user-defined custom role. Built-in roles cannot be removed.
   */
  unregisterRole(roleId: string): boolean {
    const existing = this.rolesMap().get(roleId);
    if (!existing || existing.isBuiltIn) {
      return false;
    }

    this.rolesMap.update((map) => {
      const next = new Map(map);
      next.delete(roleId);
      return next;
    });
    return true;
  }

  /**
   * Retrieves the active permission set for any role (built-in or user-defined).
   */
  getPermissions(role: GpUserRole, overrides?: Partial<GpRolePermissions>): GpRolePermissions {
    const def = this.rolesMap().get(role);
    const base = def ? def.permissions : createEmptyPermissions();

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
    const def = this.rolesMap().get(role);
    if (def) {
      return `${def.name} - ${def.description}`;
    }
    return `Custom User Role: ${role}`;
  }

  /**
   * Badge variant / label helper for UI.
   */
  getRoleBadge(role: GpUserRole): {
    label: string;
    severity: 'primary' | 'secondary' | 'success' | 'info' | 'warning';
  } {
    const def = this.rolesMap().get(role);
    if (def) {
      return {
        label: def.name,
        severity: def.badgeSeverity || 'info'
      };
    }
    return { label: String(role), severity: 'secondary' };
  }

  private initializeRolesMap(): Map<string, GpRoleDefinition> {
    const map = new Map<string, GpRoleDefinition>();
    for (const role of GP_BUILT_IN_ROLES) {
      map.set(role.id, role);
    }
    return map;
  }
}
