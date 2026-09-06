import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpPackageManager } from './package-manager';
import { GpExportImportService } from '../../services/export-import.service';
import { Dataset } from '../../models/dataset.model';
import { GpDashboardConfig, createDefaultDashboardConfig } from '../../models/dashboard.model';
import { GpReportConfig, createReportConfig } from '../../models/report.model';
import { createDatasetField } from '../../models/dataset-field.model';
import { Field } from '../../models/field.model';

describe('GpPackageManager', () => {
  let component: GpPackageManager;
  let fixture: ComponentFixture<GpPackageManager>;
  let service: GpExportImportService;

  const mockBaseField: Field = {
    fieldId: 'total',
    tableId: 'invoices',
    fieldGroupingId: 'fg1',
    fieldName: 'total',
    fieldDisplayName: { value: 'total', displayValue: { en: 'Total Amount' } },
    dataType: 'number',
    visible: true,
    isPrimaryKey: false,
    isIndex: false,
    isJoinField: false,
    usableInReports: true,
    filterable: true,
    sortable: true,
    groupable: false,
  };

  const mockDataset: Dataset = {
    datasetId: 'ds_1',
    name: 'Sales Invoices',
    fields: [createDatasetField(mockBaseField, 'df_1')],
  };

  const mockDashboard: GpDashboardConfig = createDefaultDashboardConfig();

  const mockReport: GpReportConfig = createReportConfig('chart', 'Revenue Trend', {
    title: 'Revenue Trend',
    chartType: 'bar',
    dimension: 'region',
    measure: { fieldId: 'total', aggregation: 'sum' },
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpPackageManager],
      providers: [GpExportImportService],
    }).compileComponents();

    fixture = TestBed.createComponent(GpPackageManager);
    component = fixture.componentInstance;
    service = TestBed.inject(GpExportImportService);

    fixture.componentRef.setInput('visible', true);
    fixture.componentRef.setInput('datasets', [mockDataset]);
    fixture.componentRef.setInput('dashboards', [mockDashboard]);
    fixture.componentRef.setInput('reports', [mockReport]);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should default to export tab and calculate currentExportPackage', () => {
    expect(component.activeTab()).toBe('export');
    const pkg = component.currentExportPackage();
    expect(pkg.format).toBe('gp-analytics-package');
    expect(pkg.metadata.itemCounts).toEqual({
      datasets: 1,
      dashboards: 1,
      reports: 1,
    });
  });

  it('should switch tabs between export, import, and distribution', () => {
    component.setTab('import');
    expect(component.activeTab()).toBe('import');

    component.setTab('distribution');
    expect(component.activeTab()).toBe('distribution');

    component.setTab('export');
    expect(component.activeTab()).toBe('export');
  });

  it('should emit visibleChange(false) on close()', () => {
    let closed = false;
    component.visibleChange.subscribe((v) => (closed = !v));
    component.close();
    expect(closed).toBe(true);
  });

  it('should update export package when toggling inclusions', () => {
    component.includeAllReports.set(false);
    fixture.detectChanges();

    const pkg = component.currentExportPackage();
    expect(pkg.metadata.itemCounts?.reports).toBe(0);
    expect(pkg.reports.length).toBe(0);
  });

  it('should validate JSON input in import tab', () => {
    component.setTab('import');
    expect(component.validationResult()).toBeNull();

    component.importJsonBuffer.set('{ invalid json }');
    expect(component.validationResult()?.isValid).toBe(false);

    const validPkg = service.createPackage({
      name: 'Valid Pkg',
      datasets: [mockDataset],
    });
    component.importJsonBuffer.set(service.exportPackageToJson(validPkg));
    expect(component.validationResult()?.isValid).toBe(true);
    expect(component.validationResult()?.itemCounts.datasets).toBe(1);
  });

  it('should emit packageImported event when applyImport() is called with valid payload', () => {
    let importedPayload: any = null;
    component.packageImported.subscribe((evt) => (importedPayload = evt));

    const validPkg = service.createPackage({
      name: 'Import Me',
      datasets: [mockDataset],
    });
    component.importJsonBuffer.set(service.exportPackageToJson(validPkg));
    component.importMode.set('merge');
    component.applyImport();

    expect(importedPayload).toBeTruthy();
    expect(importedPayload.package.metadata.name).toBe('Import Me');
    expect(importedPayload.mode).toBe('merge');
  });

  it('should support selective cherry-picking of assets during import', () => {
    let importedPayload: any = null;
    component.packageImported.subscribe((evt) => (importedPayload = evt));

    const extraDs: Dataset = { datasetId: 'ds_2', name: 'Support Tickets', fields: [] };
    const validPkg = service.createPackage({
      name: 'Multi Asset Pkg',
      datasets: [mockDataset, extraDs],
      dashboards: [mockDashboard],
      reports: [mockReport],
    });

    component.importJsonBuffer.set(service.exportPackageToJson(validPkg));

    // Deselect all datasets, then cherry-pick only 'ds_2'
    component.toggleImportAllDatasets();
    component.toggleImportDataset('ds_2');

    component.applyImport();

    expect(importedPayload).toBeTruthy();
    expect(importedPayload.package.datasets.length).toBe(1);
    expect(importedPayload.package.datasets[0].datasetId).toBe('ds_2');
  });

  it('should transmit distribution payload and emit packageDistributed', () => {
    vi.useFakeTimers();
    try {
      let distributedEvent: any = null;
      component.packageDistributed.subscribe((evt) => (distributedEvent = evt));

      component.setTab('distribution');
      component.transmitToRemoteApi();

      expect(component.isTransmitting()).toBe(true);
      vi.advanceTimersByTime(1000);

      expect(component.isTransmitting()).toBe(false);
      expect(component.transmissionResponse()?.status).toBe(200);
      expect(distributedEvent).toBeTruthy();
      expect(distributedEvent.endpoint).toBe(component.targetEndpoint());
    } finally {
      vi.useRealTimers();
    }
  });
});
