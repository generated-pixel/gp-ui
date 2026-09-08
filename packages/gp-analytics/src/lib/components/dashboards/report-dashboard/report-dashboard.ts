import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  model,
  output,
  signal
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GpAnalyticsComponent } from '../../base/gp-analytics-component';
import { GpDataEngineService } from '../../../services/data-engine.service';
import { GpRoleSecurityService } from '../../../services/role-security.service';
import { GpWidgetLibraryService } from '../../../services/widget-library.service';
import { GpGrid, GpGridItem, GpGridChangeEvent } from '@generatedpixel/gp-grid';
import { GpButton, GpTag } from '@generatedpixel/gp-ui';
import { GpKpiCard } from '../../widgets/kpi-card/kpi-card';
import { GpAnalyticalChart } from '../../widgets/analytical-chart/analytical-chart';
import { GpFilterBar } from '../../widgets/filter-bar/filter-bar';
import { GpTabularReport } from '../../reports/tabular-report/tabular-report';
import { GpPivotGrid } from '../../reports/pivot-grid/pivot-grid';
import {
  GpFilterCondition,
  GpAnalyticalQuerySpec,
  GpCategoricalChartData,
  GpKpiMetricResult,
  GpMeasureQuery
} from '../../../models/query.model';
import {
  GpDashboardWidgetConfig,
  GpKpiWidgetConfig,
  GpChartWidgetConfig
} from '../../../models/dashboard.model';
import {
  GpReportDashboardConfig,
  createDefaultReportDashboardConfig,
  createDerivedKpiConfig,
  createDerivedChartConfig
} from '../../../models/report-dashboard.model';
import { GpUserRole } from '../../../types/user-role.type';
import { GpRolePermissions } from '../../../interfaces/user-permission.interface';
import { GpGlobalSortConfig } from '../../../interfaces/global-sort-config.interface';
import { GpWidgetLibraryItem } from '../../../interfaces/widget-library.interface';
import { GpTabularReportConfig } from '../../../interfaces/gp-tabular-report-config.interface';
import { GpPivotReportConfig } from '../../../interfaces/gp-pivot-report-config.interface';
import { UniqueId } from '../../../utils/unique-id';

@Component({
  selector: 'gp-report-dashboard',
  standalone: true,
  imports: [
    DatePipe,
    FormsModule,
    GpGrid,
    GpButton,
    GpTag,
    GpKpiCard,
    GpAnalyticalChart,
    GpFilterBar,
    GpTabularReport,
    GpPivotGrid
  ],
  templateUrl: './report-dashboard.html',
  styleUrl: './report-dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GpReportDashboard extends GpAnalyticsComponent {
  protected readonly engine = inject(GpDataEngineService);
  protected readonly roleSecurity = inject(GpRoleSecurityService);
  protected readonly libraryService = inject(GpWidgetLibraryService);

  /**
   * Current active user role:
   * 1) admin - manages everything
   * 2) dataset-designer - creates/edits data, creates reports/dashboards
   * 3) dashboard-designer - creates/edits/shares dashboards and reports from existing datasets; creates libraries
   * 4) manager - consumes dashboards/widgets, builds personal dashboards from libraries, adds filters on available data
   * 5) regular - consumes dashboards/reports with basic filtering
   */
  readonly role = input<GpUserRole>('admin');

  /**
   * Optional permission overrides for fine-grained authorization policies.
   */
  readonly permissionOverrides = input<Partial<GpRolePermissions> | null>(null);

  /**
   * Report dashboard configuration model (two-way bound).
   */
  readonly config = model<GpReportDashboardConfig>(createDefaultReportDashboardConfig());

  /**
   * Raw dataset records that feed into the report and derived widgets.
   */
  readonly records = input<Record<string, any>[]>([]);

  /**
   * Title and subtitle overrides.
   */
  readonly title = input<string>('');
  readonly subtitle = input<string>('');

  /**
   * Force designer mode / edit controls on or off.
   */
  readonly editable = input<boolean>(false);

  /**
   * Active global filters applied across the entire report dashboard.
   */
  readonly filters = model<GpFilterCondition[]>([]);

  // Outputs
  readonly saveDashboard = output<GpReportDashboardConfig>();
  readonly shareDashboard = output<GpReportDashboardConfig>();
  readonly widgetCreated = output<GpDashboardWidgetConfig>();
  readonly widgetDeleted = output<string>();
  readonly libraryItemAdded = output<GpWidgetLibraryItem>();
  readonly sortChanged = output<GpGlobalSortConfig>();

  // Internal reactive signals
  readonly selectedWidgetId = signal<string | null>(null);
  readonly isDerivedModalOpen = signal<boolean>(false);
  readonly isGlobalSortModalOpen = signal<boolean>(false);
  readonly isLibraryDrawerOpen = signal<boolean>(false);
  readonly isSavingCustom = signal<boolean>(false);
  readonly lastRefreshedAt = signal<number>(Date.now());

  // Derived widget builder draft form state
  readonly derivedType = signal<'kpi' | 'chart'>('kpi');
  readonly draftKpiTitle = signal<string>('New KPI Metric');
  readonly draftKpiField = signal<string>('');
  readonly draftKpiAggregation = signal<'sum' | 'avg' | 'count' | 'min' | 'max'>('sum');
  readonly draftKpiTarget = signal<number | null>(null);
  readonly draftKpiFormatCurrency = signal<boolean>(true);
  readonly draftKpiSeverity = signal<'success' | 'info' | 'warning' | 'danger'>('success');
  readonly draftKpiIcon = signal<string>('💰');

  readonly draftChartTitle = signal<string>('New Analytical Graph');
  readonly draftChartSubtitle = signal<string>('Breakdown off report');
  readonly draftChartType = signal<'bar' | 'donut' | 'line'>('bar');
  readonly draftChartDimension = signal<string>('');
  readonly draftChartField = signal<string>('');
  readonly draftChartAggregation = signal<'sum' | 'avg' | 'count' | 'min' | 'max'>('sum');
  readonly draftChartSort = signal<'desc' | 'asc'>('desc');
  readonly draftChartLimit = signal<number>(6);

  // Global sort modal draft state
  readonly draftSortFieldIds = signal<Set<string>>(new Set());

  /**
   * Dynamic gp-grid Layout items synchronized with configuration.
   */
  readonly gridItems = signal<GpGridItem[]>([]);

  /**
   * Computed effective permissions for the current user and role.
   */
  readonly permissions = computed<GpRolePermissions>(() => {
    return this.roleSecurity.getPermissions(this.role(), this.permissionOverrides() || undefined);
  });

  /**
   * Effective title & subtitle.
   */
  readonly effectiveTitle = computed(() => {
    return this.title() || this.config().title || 'Report Dashboard';
  });

  readonly effectiveSubtitle = computed(() => {
    return this.subtitle() || this.config().subtitle || 'Analytical cockpit derived off report';
  });

  /**
   * Extract dimensions and measures from the central report config.
   */
  readonly reportDimensions = computed<string[]>(() => {
    const rpt = this.config().reportConfig;
    if (rpt.type === 'tabular') {
      const cfg = rpt.config as GpTabularReportConfig;
      return cfg.dimensions || [];
    }
    if (rpt.type === 'pivot') {
      const cfg = rpt.config as GpPivotReportConfig;
      return [cfg.rowDimension, cfg.colDimension].filter(Boolean);
    }
    return [];
  });

  readonly reportMeasures = computed<GpMeasureQuery[]>(() => {
    const rpt = this.config().reportConfig;
    if (rpt.type === 'tabular') {
      const cfg = rpt.config as GpTabularReportConfig;
      return cfg.measures || [];
    }
    if (rpt.type === 'pivot') {
      const cfg = rpt.config as GpPivotReportConfig;
      return cfg.measure ? [cfg.measure] : [];
    }
    return [];
  });

  /**
   * Available fields for global sorting & filtering (combining dimensions and measures).
   */
  readonly allReportFieldOptions = computed<{ fieldId: string; label: string; type: 'string' | 'number' }[]>(() => {
    const list: { fieldId: string; label: string; type: 'string' | 'number' }[] = [];
    const seen = new Set<string>();

    for (const dim of this.reportDimensions()) {
      if (!seen.has(dim)) {
        seen.add(dim);
        list.push({ fieldId: dim, label: this.formatHeader(dim), type: 'string' });
      }
    }

    for (const m of this.reportMeasures()) {
      if (!seen.has(m.fieldId)) {
        seen.add(m.fieldId);
        list.push({ fieldId: m.fieldId, label: this.formatHeader(m.fieldId), type: 'number' });
      }
    }

    return list;
  });

  /**
   * Global sort configuration options and active selection.
   */
  readonly globalSort = computed<GpGlobalSortConfig>(() => {
    return (
      this.config().globalSort || {
        availableFields: this.allReportFieldOptions(),
        activeFieldId: null,
        activeOrder: 'desc'
      }
    );
  });

  /**
   * Filter fields available for the filter bar.
   * If user is regular, they only see basic filter fields.
   */
  readonly filterFields = computed(() => {
    const all = this.allReportFieldOptions();
    if (this.permissions().isRestrictedToBasicFilters) {
      // Regular users are restricted to basic pre-configured dimensions only
      return all.filter((f) => f.type === 'string').slice(0, 3);
    }
    return all;
  });

  /**
   * Filtered & sorted records reacting to global filters and global sort.
   */
  readonly processedRecords = computed(() => {
    let list = this.records();
    const f = this.filters();

    if (f && f.length > 0) {
      list = this.engine.applyFilters(list, f);
    }

    const sortConfig = this.globalSort();
    if (sortConfig.activeFieldId) {
      const field = sortConfig.activeFieldId;
      const order = sortConfig.activeOrder;
      list = [...list].sort((a, b) => {
        const valA = a[field];
        const valB = b[field];
        if (valA == null && valB == null) return 0;
        if (valA == null) return order === 'asc' ? -1 : 1;
        if (valB == null) return order === 'asc' ? 1 : -1;
        if (typeof valA === 'number' && typeof valB === 'number') {
          return order === 'asc' ? valA - valB : valB - valA;
        }
        const strA = String(valA).toLowerCase();
        const strB = String(valB).toLowerCase();
        return order === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA);
      });
    }

    return list;
  });

  /**
   * Layout settings.
   */
  readonly columns = computed(() => this.config().columns ?? 12);
  readonly rowHeight = computed(() => this.config().rowHeight ?? 95);
  readonly gap = computed(() => this.config().gap ?? 16);
  readonly compactType = computed(() => this.config().compactType ?? 'vertical');

  readonly isGridReadonly = computed(() => {
    if (this.editable()) return false;
    return !this.permissions().canCustomizeLayout;
  });

  /**
   * Derived widgets map for template binding.
   */
  readonly widgetsMap = computed(() => {
    const map = new Map<string, GpDashboardWidgetConfig>();
    for (const w of this.config().derivedWidgets) {
      map.set(w.id, w);
    }
    return map;
  });

  /**
   * Precomputed KPI metrics derived from processed records.
   */
  readonly kpiMetricsMap = computed(() => {
    const records = this.processedRecords();
    const map = new Map<string, GpKpiMetricResult>();

    for (const w of this.config().derivedWidgets) {
      if (w.type === 'kpi') {
        const kpi = w as GpKpiWidgetConfig;
        const prev = kpi.comparePrevious
          ? records.slice(0, Math.max(1, Math.floor(records.length / 2)))
          : undefined;
        const metric = this.engine.computeKpiMetric(records, kpi.measure, kpi.title, {
          previousRecords: prev,
          targetValue: kpi.targetValue,
          formatCurrency: kpi.formatCurrency
        });
        if (kpi.severity) {
          metric.trendSeverity = kpi.severity;
        }
        map.set(w.id, metric);
      }
    }

    return map;
  });

  /**
   * Precomputed Chart categorical data derived from processed records.
   */
  readonly chartsDataMap = computed(() => {
    const records = this.processedRecords();
    const map = new Map<string, GpCategoricalChartData>();

    for (const w of this.config().derivedWidgets) {
      if (w.type === 'chart') {
        const chart = w as GpChartWidgetConfig;
        const measureKey =
          chart.measure.alias || `${chart.measure.fieldId}_${chart.measure.aggregation}`;
        const spec: GpAnalyticalQuerySpec = {
          dimensions: [chart.dimension],
          measures: [chart.measure],
          sorts: [{ fieldId: measureKey, order: chart.sortOrder || 'desc' }]
        };
        const res = this.engine.executeQuery(records, spec);
        const limit = chart.limit ?? 10;
        const rows = res.rows.slice(0, limit);

        map.set(w.id, {
          categories: rows.map((r) => String(r[chart.dimension] ?? 'Unknown')),
          series: [
            {
              name: chart.title,
              data: rows.map((r) => Number(r[measureKey] ?? 0))
            }
          ]
        });
      }
    }

    return map;
  });

  /**
   * Role badge details.
   */
  readonly roleBadge = computed(() => this.roleSecurity.getRoleBadge(this.role()));
  readonly roleDescription = computed(() => this.roleSecurity.getRoleDescription(this.role()));

  constructor() {
    super();

    // Default draft field initializers
    const measures = this.reportMeasures();
    if (measures.length > 0) {
      this.draftKpiField.set(measures[0].fieldId);
      this.draftChartField.set(measures[0].fieldId);
    }
    const dims = this.reportDimensions();
    if (dims.length > 0) {
      this.draftChartDimension.set(dims[0]);
    }

    // Synchronize grid items whenever config changes
    effect(() => {
      const c = this.config();
      const editable = this.editable() || this.permissions().canCustomizeLayout;
      const items: GpGridItem[] = [];

      // Derived widgets
      for (const w of c.derivedWidgets) {
        items.push({
          id: w.id,
          x: w.grid.x,
          y: w.grid.y,
          w: w.grid.w,
          h: w.grid.h,
          minW: w.grid.minW ?? 2,
          minH: w.grid.minH ?? 2,
          draggable: editable,
          resizable: editable
        });
      }

      // Anchoring report container (placed below derived widgets or at configured coordinates)
      const maxY = c.derivedWidgets.reduce((acc, w) => Math.max(acc, w.grid.y + w.grid.h), 0);
      items.push({
        id: 'anchored-primary-report',
        x: 0,
        y: maxY,
        w: 12,
        h: 6,
        minW: 6,
        minH: 4,
        draggable: editable,
        resizable: editable
      });

      this.gridItems.set(items);
    });
  }

  // Widget accessor helpers
  getWidget(id: string): GpDashboardWidgetConfig | undefined {
    return this.widgetsMap().get(id);
  }

  asKpi(w: GpDashboardWidgetConfig | undefined): GpKpiWidgetConfig | null {
    return w?.type === 'kpi' ? (w as GpKpiWidgetConfig) : null;
  }

  asChart(w: GpDashboardWidgetConfig | undefined): GpChartWidgetConfig | null {
    return w?.type === 'chart' ? (w as GpChartWidgetConfig) : null;
  }

  getKpiMetric(id: string): GpKpiMetricResult | undefined {
    return this.kpiMetricsMap().get(id);
  }

  getChartData(id: string): GpCategoricalChartData | undefined {
    return this.chartsDataMap().get(id);
  }

  // Global Filter Events
  onFiltersChange(newFilters: GpFilterCondition[]): void {
    this.filters.set(newFilters);
  }

  // Global Sort Events
  onSelectGlobalSort(fieldId: string): void {
    const current = this.globalSort();
    const updated: GpGlobalSortConfig = {
      ...current,
      activeFieldId: fieldId === 'none' ? null : fieldId
    };
    this.updateGlobalSort(updated);
  }

  toggleGlobalSortOrder(): void {
    const current = this.globalSort();
    const nextOrder = current.activeOrder === 'asc' ? 'desc' : 'asc';
    const updated: GpGlobalSortConfig = {
      ...current,
      activeOrder: nextOrder
    };
    this.updateGlobalSort(updated);
  }

  private updateGlobalSort(updated: GpGlobalSortConfig): void {
    this.config.update((c) => ({
      ...c,
      globalSort: updated
    }));
    this.sortChanged.emit(updated);
  }

  // Global Sort Configuration Modal
  openGlobalSortModal(): void {
    if (!this.permissions().canConfigureGlobalSorting) return;
    const available = this.globalSort().availableFields.map((f) => f.fieldId);
    this.draftSortFieldIds.set(new Set(available));
    this.isGlobalSortModalOpen.set(true);
  }

  closeGlobalSortModal(): void {
    this.isGlobalSortModalOpen.set(false);
  }

  toggleDraftSortField(fieldId: string): void {
    this.draftSortFieldIds.update((set) => {
      const next = new Set(set);
      if (next.has(fieldId)) {
        next.delete(fieldId);
      } else {
        next.add(fieldId);
      }
      return next;
    });
  }

  saveGlobalSortConfiguration(): void {
    const selectedIds = this.draftSortFieldIds();
    const allOptions = this.allReportFieldOptions();
    const filteredAvailable = allOptions.filter((opt) => selectedIds.has(opt.fieldId));

    const current = this.globalSort();
    let nextActive = current.activeFieldId;
    if (nextActive && !selectedIds.has(nextActive)) {
      nextActive = filteredAvailable.length > 0 ? filteredAvailable[0].fieldId : null;
    }

    const updated: GpGlobalSortConfig = {
      availableFields: filteredAvailable,
      activeFieldId: nextActive,
      activeOrder: current.activeOrder
    };

    this.updateGlobalSort(updated);
    this.closeGlobalSortModal();
  }

  // Derived Widget Creation
  openAddDerivedModal(type: 'kpi' | 'chart' = 'kpi'): void {
    if (!this.permissions().canCreateDerivedWidgets) return;
    this.derivedType.set(type);

    const measures = this.reportMeasures();
    if (measures.length > 0 && !this.draftKpiField()) {
      this.draftKpiField.set(measures[0].fieldId);
      this.draftChartField.set(measures[0].fieldId);
    }
    const dims = this.reportDimensions();
    if (dims.length > 0 && !this.draftChartDimension()) {
      this.draftChartDimension.set(dims[0]);
    }

    this.isDerivedModalOpen.set(true);
  }

  closeDerivedModal(): void {
    this.isDerivedModalOpen.set(false);
  }

  createDerivedWidget(): void {
    if (!this.permissions().canCreateDerivedWidgets) return;

    let newWidget: GpDashboardWidgetConfig;

    if (this.derivedType() === 'kpi') {
      newWidget = createDerivedKpiConfig({
        title: this.draftKpiTitle(),
        fieldId: this.draftKpiField() || 'total',
        aggregation: this.draftKpiAggregation(),
        targetValue: this.draftKpiTarget() ?? undefined,
        formatCurrency: this.draftKpiFormatCurrency(),
        severity: this.draftKpiSeverity(),
        icon: this.draftKpiIcon()
      });
    } else {
      newWidget = createDerivedChartConfig({
        title: this.draftChartTitle(),
        subtitle: this.draftChartSubtitle(),
        chartType: this.draftChartType(),
        dimension: this.draftChartDimension() || this.reportDimensions()[0] || 'customer_name',
        fieldId: this.draftChartField() || 'total',
        aggregation: this.draftChartAggregation(),
        sortOrder: this.draftChartSort(),
        limit: this.draftChartLimit()
      });
    }

    // Place at top or next available slot
    this.config.update((c) => ({
      ...c,
      derivedWidgets: [newWidget, ...c.derivedWidgets],
      isCustom: true
    }));

    this.widgetCreated.emit(newWidget);
    this.closeDerivedModal();
  }

  // Delete Derived Widget
  deleteWidget(widgetId: string, event?: MouseEvent): void {
    if (event) event.stopPropagation();
    if (!this.permissions().canCustomizeLayout && !this.permissions().canCreateDerivedWidgets) return;

    this.config.update((c) => ({
      ...c,
      derivedWidgets: c.derivedWidgets.filter((w) => w.id !== widgetId),
      isCustom: true
    }));
    this.widgetDeleted.emit(widgetId);
  }

  // Save Widget to Library (Designers / Admins)
  saveWidgetToLibrary(widget: GpDashboardWidgetConfig, event?: MouseEvent): void {
    if (event) event.stopPropagation();
    if (!this.permissions().canManageLibraries) return;

    const added = this.libraryService.addWidget({
      name: widget.title,
      description: `Reusable template based on ${widget.title}`,
      category: widget.type as any,
      icon: (widget as any).icon || '📊',
      tags: ['Custom', widget.type],
      createdBy: `${this.role()} user`,
      widgetConfig: { ...widget }
    });

    this.libraryItemAdded.emit(added);
  }

  // Library Drawer & Picking
  openLibraryDrawer(): void {
    this.isLibraryDrawerOpen.set(true);
  }

  closeLibraryDrawer(): void {
    this.isLibraryDrawerOpen.set(false);
  }

  addLibraryWidgetToDashboard(item: GpWidgetLibraryItem): void {
    if (!this.permissions().canCreateCustomDashboards && !this.permissions().canManageDashboards) return;

    const newWidget: GpDashboardWidgetConfig = {
      ...(item.widgetConfig as any),
      id: UniqueId.generate(`derived-${item.category}-`),
      grid: { x: 0, y: 0, w: (item.widgetConfig as any).grid?.w || 3, h: (item.widgetConfig as any).grid?.h || 2 }
    };

    this.config.update((c) => ({
      ...c,
      derivedWidgets: [newWidget, ...c.derivedWidgets],
      isCustom: true
    }));

    this.widgetCreated.emit(newWidget);
    this.closeLibraryDrawer();
  }

  // Layout changes from gp-grid
  onLayoutChanged(items: GpGridItem[]): void {
    if (!this.permissions().canCustomizeLayout) return;

    const itemMap = new Map<string, GpGridItem>();
    for (const item of items) {
      itemMap.set(item.id, item);
    }

    this.config.update((c) => {
      const updatedWidgets = c.derivedWidgets.map((w) => {
        const item = itemMap.get(w.id);
        if (item) {
          return {
            ...w,
            grid: {
              ...w.grid,
              x: item.x,
              y: item.y,
              w: item.w,
              h: item.h
            }
          };
        }
        return w;
      });

      return {
        ...c,
        derivedWidgets: updatedWidgets
      };
    });
  }

  onGridItemChange(_event: GpGridChangeEvent): void {
    // Handled in layoutChanged
  }

  // Save / Share Dashboard
  onSaveDashboard(): void {
    const current = this.config();
    this.saveDashboard.emit(current);
  }

  onShareDashboard(): void {
    if (!this.permissions().canShareDashboards) return;
    const current = this.config();
    this.shareDashboard.emit(current);
  }

  refreshAll(): void {
    this.lastRefreshedAt.set(Date.now());
  }

  private formatHeader(key: string): string {
    return key
      .split('_')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }
}
