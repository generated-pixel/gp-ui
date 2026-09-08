import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { GpBadge, GpToast, GpToastService, GpButton, GpTag } from 'gp-ui';
import {
  GpReportDashboard,
  GpReportDashboardConfig,
  GpUserRole,
  GpFilterCondition,
  GpGlobalSortConfig,
  GpDashboardWidgetConfig,
  GpWidgetLibraryItem,
  createDefaultReportDashboardConfig
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
}

@Component({
  selector: 'app-report-dashboard-demo',
  standalone: true,
  imports: [GpBadge, GpToast, GpTag, GpReportDashboard, DocApiTable, DocCode],
  templateUrl: './report-dashboard-demo.html',
  styleUrl: './report-dashboard-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportDashboardDemo {
  private readonly toastService = inject(GpToastService);

  protected readonly activeRole = signal<GpUserRole>('admin');
  protected readonly config = signal<GpReportDashboardConfig>(createDefaultReportDashboardConfig());
  protected readonly records = signal<Record<string, any>[]>(ANALYTICS_SAMPLE_RECORDS);
  protected readonly filters = signal<GpFilterCondition[]>([]);

  protected readonly roleOptions: RoleOption[] = [
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

  protected selectRole(role: GpUserRole): void {
    this.activeRole.set(role);
    this.toastService.add({
      severity: 'info',
      summary: 'Switched User Persona',
      detail: `Role set to ${role}. Permissions and controls updated.`
    });
  }

  protected getActiveRoleOption(): RoleOption {
    return this.roleOptions.find((r) => r.role === this.activeRole()) || this.roleOptions[0];
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

  protected readonly usageCode = `<gp-report-dashboard
  [role]="'manager'"
  [config]="dashboardConfig"
  [records]="datasetRecords"
  [(filters)]="activeFilters"
  (saveDashboard)="onSave($event)"
  (shareDashboard)="onShare($event)"
  (widgetCreated)="onWidgetCreated($event)"
  (sortChanged)="onSortChanged($event)"
/>`;

  protected readonly properties: DocApiProperty[] = [
    {
      name: 'role',
      type: "input<GpUserRole>('admin')",
      default: "'admin'",
      description:
        "User role: 'admin' | 'dataset-designer' | 'dashboard-designer' | 'manager' | 'regular'. Dictates exact UI controls and capabilities."
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
