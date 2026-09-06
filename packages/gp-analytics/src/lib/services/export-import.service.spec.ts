import { TestBed } from '@angular/core/testing';
import { GpExportImportService } from './export-import.service';
import { Dataset } from '../models/dataset.model';
import { GpDashboardConfig, createDefaultDashboardConfig } from '../models/dashboard.model';
import { GpReportConfig, createReportConfig } from '../models/report.model';

import { createDatasetField } from '../models/dataset-field.model';
import { Field } from '../models/field.model';

describe('GpExportImportService', () => {
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
    datasetId: 'ds_test',
    name: 'Sales Invoices',
    description: 'Commercial invoice records',
    fields: [createDatasetField(mockBaseField, 'df_total_1')],
    filters: [],
  };

  const mockDashboard: GpDashboardConfig = createDefaultDashboardConfig();
  mockDashboard.title = 'Sales Cockpit';

  const mockReport: GpReportConfig = createReportConfig(
    'tabular',
    'Quarterly Sales Rollup',
    {
      title: 'Quarterly Sales',
      dimensions: ['region'],
      measures: [{ fieldId: 'total', aggregation: 'sum' }],
      showSubtotals: true,
      showGrandTotal: true,
    },
    'ds_test',
  );

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GpExportImportService],
    });
    service = TestBed.inject(GpExportImportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a valid package bundle with metadata and checksum', () => {
    const pkg = service.createPackage({
      name: 'Enterprise Bundle',
      description: 'Production package',
      exportedBy: 'Admin',
      datasets: [mockDataset],
      dashboards: [mockDashboard],
      reports: [mockReport],
    });

    expect(pkg.format).toBe('gp-analytics-package');
    expect(pkg.version).toBe('1.0.0');
    expect(pkg.metadata.name).toBe('Enterprise Bundle');
    expect(pkg.metadata.exportedBy).toBe('Admin');
    expect(pkg.metadata.itemCounts).toEqual({
      datasets: 1,
      dashboards: 1,
      reports: 1,
    });
    expect(pkg.metadata.checksum).toBeDefined();
    expect(pkg.metadata.checksum?.length).toBe(8);
  });

  it('should serialize package to valid JSON', () => {
    const pkg = service.createPackage({
      name: 'JSON Test',
      datasets: [mockDataset],
    });

    const json = service.exportPackageToJson(pkg, true);
    expect(typeof json).toBe('string');
    const parsed = JSON.parse(json);
    expect(parsed.format).toBe('gp-analytics-package');
    expect(parsed.datasets.length).toBe(1);
    expect(parsed.datasets[0].name).toBe('Sales Invoices');
  });

  it('should validate a valid package without errors', () => {
    const pkg = service.createPackage({
      name: 'Validation Test',
      datasets: [mockDataset],
      dashboards: [mockDashboard],
      reports: [mockReport],
    });

    const json = service.exportPackageToJson(pkg);
    const result = service.validatePackage(json);

    expect(result.isValid).toBe(true);
    expect(result.formatMatch).toBe(true);
    expect(result.errors.length).toBe(0);
    expect(result.itemCounts).toEqual({
      datasets: 1,
      dashboards: 1,
      reports: 1,
    });
  });

  it('should detect corrupted or invalid JSON', () => {
    const result = service.validatePackage('{ invalid json: true, ');
    expect(result.isValid).toBe(false);
    expect(result.errors[0]).toContain('Invalid JSON format');
  });

  it('should detect unrecognized package formats', () => {
    const invalidFormat = JSON.stringify({
      format: 'unknown-format',
      version: '1.0.0',
      metadata: { id: '123' },
    });

    const result = service.validatePackage(invalidFormat);
    expect(result.isValid).toBe(false);
    expect(result.errors.some((e) => e.includes('Unrecognized package format'))).toBe(true);
  });

  it('should warn on tampered checksum', () => {
    const pkg = service.createPackage({
      name: 'Tamper Test',
      datasets: [mockDataset],
    });

    // Alter content without updating checksum
    pkg.datasets[0].name = 'Tampered Name';
    const json = service.exportPackageToJson(pkg);
    const result = service.validatePackage(json);

    expect(result.warnings.some((w) => w.includes('checksum mismatch'))).toBe(true);
  });

  it('should import package in merge mode', () => {
    const pkg = service.createPackage({
      name: 'Merge Import',
      datasets: [mockDataset],
      dashboards: [mockDashboard],
    });

    const json = service.exportPackageToJson(pkg);
    const imported = service.importPackage(json, 'merge');

    expect(imported.metadata.id).toBe(pkg.metadata.id);
    expect(imported.datasets[0].datasetId).toBe(mockDataset.datasetId);
  });

  it('should import package in copy mode with regenerated IDs', () => {
    const pkg = service.createPackage({
      name: 'Copy Import',
      datasets: [mockDataset],
      dashboards: [mockDashboard],
      reports: [mockReport],
    });

    const json = service.exportPackageToJson(pkg);
    const imported = service.importPackage(json, 'copy');

    expect(imported.metadata.id).toContain('_copy_');
    expect(imported.metadata.name).toContain('(Copy)');
    expect(imported.datasets[0].datasetId).not.toBe(mockDataset.datasetId);
    expect(imported.dashboards[0].id).not.toBe(mockDashboard.id);
    expect(imported.reports[0].id).not.toBe(mockReport.id);
  });

  it('should prepare distribution payload for remote API transmission', () => {
    const pkg = service.createPackage({
      name: 'Remote Distribution Test',
      datasets: [mockDataset],
      dashboards: [mockDashboard],
    });

    const payload = service.prepareDistributionPayload(
      pkg,
      'https://api.enterprise.com/v1/analytics/distribution',
    );

    expect(payload.packageId).toBe(pkg.metadata.id);
    expect(payload.targetEndpoint).toBe('https://api.enterprise.com/v1/analytics/distribution');
    expect(payload.payloadSizeBytes).toBeGreaterThan(0);
    expect(payload.checksum).toBe(pkg.metadata.checksum);
    expect(payload.package.format).toBe('gp-analytics-package');
  });

  it('should export standalone single entities', () => {
    const dsJson = service.exportSingleDataset(mockDataset);
    const dashJson = service.exportSingleDashboard(mockDashboard);
    const rptJson = service.exportSingleReport(mockReport);

    expect(service.validatePackage(dsJson).isValid).toBe(true);
    expect(service.validatePackage(dashJson).isValid).toBe(true);
    expect(service.validatePackage(rptJson).isValid).toBe(true);
  });
});
