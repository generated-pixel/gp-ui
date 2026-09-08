import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GpBadge, GpToast, GpToastService, GpTag, GpButton } from 'gp-ui';
import {
  GpReportDashboard,
  GpReportDashboardConfig,
  GpUserRole,
  GpFilterCondition,
  GpGlobalSortConfig,
  GpDashboardWidgetConfig,
  GpWidgetLibraryItem,
  GpRoleSecurityService,
  GpPermissionDescriptor,
  GpRolePermissions,
  GpRoleDefinition,
  createDefaultReportDashboardConfig,
  createEmptyPermissions
} from 'gp-analytics';
import { DocApiTable, DocApiProperty } from '../../../shared/doc-api-table';
import { DocCode } from '../../../shared/doc-code';
import { ANALYTICS_SAMPLE_RECORDS } from '../analytics-demo-data';

interface RoleOption {
  role: GpUserRole;
  label: string;
  badgeSeverity: 'primary' | 'secondary' | 'success' | 'info' | 'warning';
  description: string;
  capabilities: string[];
  restrictions: string[];
  isCustom?: boolean;
}

@Component({
  selector: 'app-report-dashboard-demo',
  standalone: true,
  imports: [FormsModule, GpBadge, GpToast, GpTag, GpButton, GpReportDashboard, DocApiTable, DocCode],
  templateUrl: './report-dashboard-demo.html',
  styleUrl: './report-dashboard-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportDashboardDemo {
  private readonly toastService = inject(GpToastService);
  protected readonly roleSecurity = inject(GpRoleSecurityService);

  protected readonly activeRole = signal<GpUserRole>('admin');
  protected readonly config = signal<GpReportDashboardConfig>(createDefaultReportDashboardConfig());
  protected readonly records = signal<Record<string, any>[]>(ANALYTICS_SAMPLE_RECORDS);
  protected readonly filters = signal<GpFilterCondition[]>([]);

  // List of all granular permissions provided by gp-analytics
  protected readonly availablePermissions = this.roleSecurity.getAvailablePermissions();

  // Custom roles reactive signal
  protected readonly customRoles = signal<RoleOption[]>([]);

  // Modal draft state for defining a custom role
  protected readonly isCustomRoleModalOpen = signal<boolean>(false);
  protected readonly draftRoleName = signal<string>('Senior Financial Analyst');
  protected readonly draftRoleDesc = signal<string>(
    'Can create derived graphs and add filters, but cannot edit raw data schemas'
  );

  protected readonly draftRoleSeverity = signal<'primary' | 'secondary' | 'success' | 'info' | 'warning'>('success');
  protected readonly draftRolePermissions = signal<Record<string, boolean>>({
    canCreateDerivedWidgets: true,
    canCustomizeLayout: true,
    canAddFilters: true,
    canConfigureGlobalSorting: true
  });

  protected readonly builtInRoles: RoleOption[] = [
    {
      role: 'admin',
      label: 'Admin',
      badgeSeverity: 'warning',
      description:
        'Superusers who can manage datasets, create reports, edit dashboards, configure global sorts, and administer libraries.',
      capabilities: [
        'Full access to all datasets and schema design',
        'Create, edit, and share dashboards and reports',
        'Publish and manage shared widget & report libraries',
        'Configure available fields for global sorting',
        'Add advanced filters and create derived KPIs/graphs'
      ],
      restrictions: ['No restrictions']
    },
    {
      role: 'dataset-designer',
      label: 'Dataset Designer',
      badgeSeverity: 'info',
      description: 'Data architects who can create and edit raw data schemas, datasets, reports, and dashboards.',
      capabilities: [
        'Create and edit underlying datasets and tables',
        'Create reports and dashboards',
        'Add derived graphs and KPI scorecards',
        'Configure global sorting options and filters'
      ],
      restrictions: ['Focused on data engineering and dataset creation']
    },
    {
      role: 'dashboard-designer',
      label: 'Dashboard Designer',
      badgeSeverity: 'primary',
      description:
        'Analytical authors who build, edit, and share dashboards and reports from created datasets, and create widget libraries.',
      capabilities: [
        'Create, edit, and share dashboards and reports',
        'Create and publish libraries of widgets & reports for others',
        'Add derived KPIs and graphs off anchored reports',
        'Configure global sorting fields and global filters'
      ],
      restrictions: ['Cannot create or edit raw datasets or underlying database tables']
    },
    {
      role: 'manager',
      label: 'Manager User',
      badgeSeverity: 'success',
      description:
        'Business leaders who consume dashboards, build personal dashboards using curated libraries, and filter available data.',
      capabilities: [
        'Consume reports and dashboards',
        'Build custom personal dashboards using the widget library',
        'Add derived KPIs and graphs for personal analysis',
        'Filter data on available dimensions and measures'
      ],
      restrictions: [
        'Cannot edit raw datasets',
        'Cannot publish items to the organization-wide shared library',
        'Cannot modify the global sort field whitelist'
      ]
    },
    {
      role: 'regular',
      label: 'Regular User',
      badgeSeverity: 'secondary',
      description: 'Operational users who consume pre-built dashboards and reports with basic filtering.',
      capabilities: [
        'Consume published dashboards and anchored reports',
        'Apply basic filters on pre-configured fields',
        'Sort data using allowed global sort fields'
      ],
      restrictions: [
        'Read-only view mode',
        'Cannot move or resize widgets (layout locked)',
        'Cannot create new widgets or edit dashboards',
        'Restricted strictly to basic filters'
      ]
    }
  ];

  /**
   * Combined list of built-in + user-defined roles.
   */
  protected readonly allRoles = computed<RoleOption[]>(() => {
    return [...this.builtInRoles, ...this.customRoles()];
  });

  /**
   * Permissions grouped by category for the permission selection dialog.
   */
  protected readonly permissionsByCategory = computed(() => {
    const map = new Map<string, GpPermissionDescriptor[]>();
    for (const perm of this.availablePermissions) {
      if (!map.has(perm.category)) {
        map.set(perm.category, []);
      }
      map.get(perm.category)!.push(perm);
    }
    return Array.from(map.entries()).map(([category, items]) => ({ category, items }));
  });

  protected selectRole(role: GpUserRole): void {
    this.activeRole.set(role);
    this.toastService.add({
      severity: 'info',
      summary: 'Switched User Persona',
      detail: `Role set to ${role}. Permissions and controls updated.`
    });
  }

  protected getActiveRoleOption(): RoleOption {
    return this.allRoles().find((r) => r.role === this.activeRole()) || this.builtInRoles[0];
  }

  // Custom Role Modal Handlers
  protected openCustomRoleModal(): void {
    this.isCustomRoleModalOpen.set(true);
  }

  protected closeCustomRoleModal(): void {
    this.isCustomRoleModalOpen.set(false);
  }

  protected togglePermission(key: string): void {
    this.draftRolePermissions.update((current) => ({
      ...current,
      [key]: !current[key]
    }));
  }

  protected isDraftPermissionChecked(key: string): boolean {
    return Boolean(this.draftRolePermissions()[key]);
  }

  protected saveCustomRole(): void {
    const name = this.draftRoleName().trim();
    if (!name) {
      return;
    }

    const id = `role-custom-${Date.now()}`;
    const desc = this.draftRoleDesc().trim() || `User-defined role: ${name}`;
    const severity = this.draftRoleSeverity();
    const rawPerms = this.draftRolePermissions();

    const perms: Partial<GpRolePermissions> = {};
    for (const p of this.availablePermissions) {
      (perms as any)[p.key] = Boolean(rawPerms[p.key]);
    }

    // Register into GpRoleSecurityService
    this.roleSecurity.defineCustomRole(name, desc, perms, severity, id);

    // Extract active capabilities and restrictions
    const capabilities: string[] = [];
    const restrictions: string[] = [];

    for (const p of this.availablePermissions) {
      if ((perms as any)[p.key]) {
        capabilities.push(p.label);
      } else {
        restrictions.push(`No ${p.label.toLowerCase()} permission`);
      }
    }

    const newRoleOpt: RoleOption = {
      role: id,
      label: name,
      badgeSeverity: severity,
      description: desc,
      capabilities: capabilities.length > 0 ? capabilities : ['Minimal permissions'],
      restrictions: restrictions.length > 0 ? restrictions : ['No restrictions'],
      isCustom: true
    };

    this.customRoles.update((list) => [...list, newRoleOpt]);
    this.activeRole.set(id);

    this.toastService.add({
      severity: 'success',
      summary: 'Custom Role Created',
      detail: `Created role "${name}" and activated it on the Report Dashboard.`
    });

    this.closeCustomRoleModal();
  }

  protected onSaveDashboard(cfg: GpReportDashboardConfig): void {
    this.toastService.add({
      severity: 'success',
      summary: 'Dashboard Saved',
      detail: `Saved "${cfg.title}" with ${cfg.derivedWidgets.length} derived widgets.`
    });
  }

  protected onShareDashboard(cfg: GpReportDashboardConfig): void {
    this.toastService.add({
      severity: 'info',
      summary: 'Dashboard Shared',
      detail: `Share link created for "${cfg.title}".`
    });
  }

  protected onWidgetCreated(widget: GpDashboardWidgetConfig): void {
    this.toastService.add({
      severity: 'success',
      summary: 'Derived Widget Created',
      detail: `Added "${widget.title}" (${widget.type.toUpperCase()}) to the dashboard canvas.`
    });
  }

  protected onWidgetDeleted(id: string): void {
    this.toastService.add({
      severity: 'warning',
      summary: 'Widget Removed',
      detail: `Removed widget ${id} from dashboard.`
    });
  }

  protected onLibraryItemAdded(item: GpWidgetLibraryItem): void {
    this.toastService.add({
      severity: 'success',
      summary: 'Published to Library',
      detail: `"${item.name}" is now available in the organization widget library.`
    });
  }

  protected onSortChanged(sort: GpGlobalSortConfig): void {
    this.toastService.add({
      severity: 'info',
      summary: 'Global Sort Updated',
      detail: sort.activeFieldId
        ? `Sorting by ${sort.activeFieldId} (${sort.activeOrder.toUpperCase()})`
        : 'Global sort cleared'
    });
  }

  protected readonly usageCode = `// 1. You can define your own custom roles with any subset of permissions:
const customRole = roleSecurityService.defineCustomRole(
  'Financial Auditor',
  'Can view and sort dashboards and add filters, but cannot edit raw schemas',
  {
    canAddFilters: true,
    canConfigureGlobalSorting: true,
    canCustomizeLayout: false,
    canManageDatasets: false
  },
  'warning',
  'financial-auditor'
);

// 2. Or pass any custom role ID or built-in role to gp-report-dashboard:
<gp-report-dashboard
  [role]="'financial-auditor'"
  [config]="dashboardConfig"
  [records]="datasetRecords"
  [(filters)]="activeFilters"
/>`;

  protected readonly properties: DocApiProperty[] = [
    {
      name: 'role',
      type: "input<GpUserRole>('admin')",
      default: "'admin'",
      description:
        "User role: can be built-in ('admin' | 'dataset-designer' | 'dashboard-designer' | 'manager' | 'regular') or ANY custom user-defined role ID. Dictates exact UI controls and capabilities."
    },
    {
      name: 'permissionOverrides',
      type: 'input<Partial<GpRolePermissions> | null>',
      default: 'null',
      description: 'Optional granular overrides for specific role permissions.'
    },
    {
      name: 'config',
      type: 'model<GpReportDashboardConfig>',
      default: 'createDefaultReportDashboardConfig()',
      kind: 'model',
      description: 'Report dashboard configuration containing the central reportConfig, derivedWidgets, and globalSort.'
    },
    {
      name: 'records',
      type: 'input<Record<string, any>[]>',
      default: '[]',
      description: 'Raw dataset records that feed into the report and derived widgets.'
    },
    {
      name: 'filters',
      type: 'model<GpFilterCondition[]>',
      default: '[]',
      kind: 'model',
      description: 'Active global filters applied across the entire report dashboard.'
    },
    {
      name: 'editable',
      type: 'input<boolean>',
      default: 'false',
      description: 'Forces designer mode if user permissions allow layout customization.'
    },
    {
      name: 'title',
      type: 'input<string>',
      default: "''",
      description: 'Optional dashboard title override.'
    },
    {
      name: 'subtitle',
      type: 'input<string>',
      default: "''",
      description: 'Optional dashboard subtitle override.'
    }
  ];

  protected readonly events: DocApiProperty[] = [
    {
      name: 'saveDashboard',
      type: 'output<GpReportDashboardConfig>',
      description: 'Emitted when user saves custom dashboard state.'
    },
    {
      name: 'shareDashboard',
      type: 'output<GpReportDashboardConfig>',
      description: 'Emitted when user shares dashboard.'
    },
    {
      name: 'widgetCreated',
      type: 'output<GpDashboardWidgetConfig>',
      description: 'Emitted when a derived KPI or Graph is created and placed.'
    },
    {
      name: 'widgetDeleted',
      type: 'output<string>',
      description: 'Emitted when a widget is deleted.'
    },
    {
      name: 'libraryItemAdded',
      type: 'output<GpWidgetLibraryItem>',
      description: 'Emitted when a widget is published to the organization library.'
    },
    {
      name: 'sortChanged',
      type: 'output<GpGlobalSortConfig>',
      description: 'Emitted when global sorting is changed or reconfigured.'
    }
  ];
}
