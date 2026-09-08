import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpReportDashboard } from './report-dashboard';
import { GpRoleSecurityService } from '../../../services/role-security.service';
import { GpWidgetLibraryService } from '../../../services/widget-library.service';
import { GpDataEngineService } from '../../../services/data-engine.service';
import { createDefaultReportDashboardConfig } from '../../../models/report-dashboard.model';
import { GpFilterCondition } from '../../../models/query.model';

const MOCK_RECORDS = [
  { customer_name: 'Acme Corp', region: 'AMER', status: 'Completed', total: 10000, quantity: 10 },
  { customer_name: 'Acme Corp', region: 'AMER', status: 'Pending', total: 5000, quantity: 5 },
  { customer_name: 'Beta LLC', region: 'EMEA', status: 'Completed', total: 20000, quantity: 20 },
  { customer_name: 'Gamma Inc', region: 'APAC', status: 'Delivered', total: 15000, quantity: 15 }
];

describe('GpReportDashboard', () => {
  let component: GpReportDashboard;
  let fixture: ComponentFixture<GpReportDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpReportDashboard],
      providers: [GpRoleSecurityService, GpWidgetLibraryService, GpDataEngineService]
    }).compileComponents();

    fixture = TestBed.createComponent(GpReportDashboard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('records', MOCK_RECORDS);
    fixture.detectChanges();
  });

  it('initializes with default 1-report dashboard configuration and derived widgets', () => {
    expect(component).toBeTruthy();
    const cfg = component.config();
    expect(cfg.reportConfig).toBeTruthy();
    expect(cfg.reportConfig.type).toBe('tabular');
    expect(cfg.derivedWidgets.length).toBeGreaterThan(0);
    expect(component.reportDimensions()).toContain('customer_name');
    expect(component.reportMeasures().length).toBeGreaterThan(0);
  });

  describe('5-Tier User Role System', () => {
    it('Admin: has all capabilities enabled', () => {
      fixture.componentRef.setInput('role', 'admin');
      fixture.detectChanges();

      const perms = component.permissions();
      expect(perms.canManageDatasets).toBe(true);
      expect(perms.canManageReports).toBe(true);
      expect(perms.canManageDashboards).toBe(true);
      expect(perms.canShareDashboards).toBe(true);
      expect(perms.canManageLibraries).toBe(true);
      expect(perms.canCreateDerivedWidgets).toBe(true);
      expect(perms.canConfigureGlobalSorting).toBe(true);
      expect(perms.canCustomizeLayout).toBe(true);
      expect(perms.isRestrictedToBasicFilters).toBe(false);
      expect(component.roleBadge().label).toBe('Admin');
    });

    it('Dataset Designer: can manage datasets, data, reports, and dashboards', () => {
      fixture.componentRef.setInput('role', 'dataset-designer');
      fixture.detectChanges();

      const perms = component.permissions();
      expect(perms.canManageDatasets).toBe(true);
      expect(perms.canManageReports).toBe(true);
      expect(perms.canManageDashboards).toBe(true);
      expect(perms.canManageLibraries).toBe(true);
      expect(perms.canCreateDerivedWidgets).toBe(true);
      expect(component.roleBadge().label).toBe('Dataset Designer');
    });

    it('Dashboard Designer: cannot manage raw datasets, but can author dashboards, reports, and libraries', () => {
      fixture.componentRef.setInput('role', 'dashboard-designer');
      fixture.detectChanges();

      const perms = component.permissions();
      expect(perms.canManageDatasets).toBe(false);
      expect(perms.canManageReports).toBe(true);
      expect(perms.canManageDashboards).toBe(true);
      expect(perms.canManageLibraries).toBe(true);
      expect(perms.canCreateDerivedWidgets).toBe(true);
      expect(perms.canConfigureGlobalSorting).toBe(true);
      expect(component.roleBadge().label).toBe('Dashboard Designer');
    });

    it('Manager: can create custom dashboards from libraries and add filters, but cannot edit raw datasets or publish shared libraries', () => {
      fixture.componentRef.setInput('role', 'manager');
      fixture.detectChanges();

      const perms = component.permissions();
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
      expect(component.roleBadge().label).toBe('Manager');
    });

    it('Regular User: read-only consumption, cannot customize layout or create widgets, restricted to basic filters', () => {
      fixture.componentRef.setInput('role', 'regular');
      fixture.detectChanges();

      const perms = component.permissions();
      expect(perms.canManageDatasets).toBe(false);
      expect(perms.canManageReports).toBe(false);
      expect(perms.canManageDashboards).toBe(false);
      expect(perms.canManageLibraries).toBe(false);
      expect(perms.canCreateCustomDashboards).toBe(false);
      expect(perms.canCreateDerivedWidgets).toBe(false);
      expect(perms.canConfigureGlobalSorting).toBe(false);
      expect(perms.canCustomizeLayout).toBe(false);
      expect(perms.isRestrictedToBasicFilters).toBe(true);
      expect(component.roleBadge().label).toBe('Regular User');
      expect(component.isGridReadonly()).toBe(true);
    });
  });

  describe('Derived KPIs and Graphs off Anchored Report', () => {
    it('computes KPI scorecard metrics dynamically off report data', () => {
      const kpiMetrics = component.kpiMetricsMap();
      expect(kpiMetrics.size).toBeGreaterThan(0);
      const revMetric = component.getKpiMetric('kpi-rev');
      expect(revMetric).toBeDefined();
      expect(revMetric?.currentValue).toBe(50000); // 10000 + 5000 + 20000 + 15000
    });

    it('computes Chart categorical data dynamically off report dimensions and measures', () => {
      const chartData = component.getChartData('chart-rev-customer');
      expect(chartData).toBeDefined();
      expect(chartData?.categories).toContain('Beta LLC');
      expect(chartData?.categories).toContain('Acme Corp');
    });

    it('allows permitted user to create a new derived KPI off the report', () => {
      fixture.componentRef.setInput('role', 'manager');
      fixture.detectChanges();

      const initialCount = component.config().derivedWidgets.length;
      component.openAddDerivedModal('kpi');
      expect(component.isDerivedModalOpen()).toBe(true);

      component.draftKpiTitle.set('Average Order Value Derived');
      component.draftKpiField.set('total');
      component.draftKpiAggregation.set('avg');
      component.createDerivedWidget();

      expect(component.isDerivedModalOpen()).toBe(false);
      expect(component.config().derivedWidgets.length).toBe(initialCount + 1);
      expect(component.config().isCustom).toBe(true);
      expect(component.config().derivedWidgets[0].title).toBe('Average Order Value Derived');
    });

    it('allows permitted user to create a new derived Chart off the report', () => {
      fixture.componentRef.setInput('role', 'dashboard-designer');
      fixture.detectChanges();

      const initialCount = component.config().derivedWidgets.length;
      component.openAddDerivedModal('chart');
      component.draftChartTitle.set('Quantity by Region');
      component.draftChartDimension.set('region');
      component.draftChartField.set('quantity');
      component.draftChartAggregation.set('sum');
      component.createDerivedWidget();

      expect(component.config().derivedWidgets.length).toBe(initialCount + 1);
      expect(component.config().derivedWidgets[0].type).toBe('chart');
    });

    it('allows deleting a derived widget', () => {
      fixture.componentRef.setInput('role', 'admin');
      fixture.detectChanges();

      const widgetToDelete = component.config().derivedWidgets[0].id;
      const initialCount = component.config().derivedWidgets.length;

      component.deleteWidget(widgetToDelete);
      expect(component.config().derivedWidgets.length).toBe(initialCount - 1);
      expect(component.config().derivedWidgets.some((w) => w.id === widgetToDelete)).toBe(false);
    });
  });

  describe('Global Filtering', () => {
    it('applies global filters across both report records and derived widgets', () => {
      const filter: GpFilterCondition = {
        fieldId: 'region',
        operator: 'eq',
        value: 'AMER'
      };

      component.onFiltersChange([filter]);
      fixture.detectChanges();

      expect(component.filters().length).toBe(1);
      const filtered = component.processedRecords();
      expect(filtered.length).toBe(2);
      expect(filtered.every((r) => r['region'] === 'AMER')).toBe(true);

      // Derived KPI recalculates based on filtered records
      const revMetric = component.getKpiMetric('kpi-rev');
      expect(revMetric?.currentValue).toBe(15000); // 10000 + 5000
    });
  });

  describe('Global Sorting', () => {
    it('allows selecting a field for global sorting and toggling order', () => {
      component.onSelectGlobalSort('total');
      fixture.detectChanges();

      expect(component.globalSort().activeFieldId).toBe('total');
      expect(component.globalSort().activeOrder).toBe('desc');

      // Top record should have highest total (Beta LLC: 20000)
      let records = component.processedRecords();
      expect(records[0]['total']).toBe(20000);

      // Toggle order to asc
      component.toggleGlobalSortOrder();
      fixture.detectChanges();
      expect(component.globalSort().activeOrder).toBe('asc');

      // Top record should now have lowest total (Acme Corp: 5000)
      records = component.processedRecords();
      expect(records[0]['total']).toBe(5000);
    });

    it('allows designers and admins to configure available global sort fields', () => {
      fixture.componentRef.setInput('role', 'dashboard-designer');
      fixture.detectChanges();

      component.openGlobalSortModal();
      expect(component.isGlobalSortModalOpen()).toBe(true);

      // Keep only 'total' and 'customer_name'
      component.draftSortFieldIds.set(new Set(['total', 'customer_name']));
      component.saveGlobalSortConfiguration();

      expect(component.isGlobalSortModalOpen()).toBe(false);
      const available = component.globalSort().availableFields;
      expect(available.length).toBe(2);
      expect(available.map((f) => f.fieldId)).toEqual(['customer_name', 'total']);
    });
  });

  describe('Widget Library Integration', () => {
    it('allows dashboard designer / admin to save a widget to the library', () => {
      fixture.componentRef.setInput('role', 'admin');
      fixture.detectChanges();

      const libService = TestBed.inject(GpWidgetLibraryService);
      const initialCount = libService.widgetLibrary().length;

      const widget = component.config().derivedWidgets[0];
      component.saveWidgetToLibrary(widget);

      expect(libService.widgetLibrary().length).toBe(initialCount + 1);
    });

    it('allows manager to pick a widget from library into the dashboard', () => {
      fixture.componentRef.setInput('role', 'manager');
      fixture.detectChanges();

      const libService = TestBed.inject(GpWidgetLibraryService);
      const sampleItem = libService.widgetLibrary()[0];

      const initialCount = component.config().derivedWidgets.length;
      component.addLibraryWidgetToDashboard(sampleItem);

      expect(component.config().derivedWidgets.length).toBe(initialCount + 1);
      expect(component.config().isCustom).toBe(true);
    });
  });
});
