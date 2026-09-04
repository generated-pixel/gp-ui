import { TestBed } from '@angular/core/testing';
import { ReportGeneratorService } from './report-generator.service';
import { DesignerSelectionState } from '../models/designer.models';

describe('ReportGeneratorService', () => {
  let service: ReportGeneratorService;

  const mockData: Record<string, unknown>[] = [
    { region: 'North America', category: 'Software', sales: 12000, margin: 0.25, units: 10 },
    { region: 'North America', category: 'Hardware', sales: 8000, margin: 0.15, units: 20 },
    { region: 'Europe', category: 'Software', sales: 15000, margin: 0.30, units: 12 },
    { region: 'Europe', category: 'Hardware', sales: 5000, margin: 0.10, units: 15 },
    { region: 'Asia Pacific', category: 'Software', sales: 18000, margin: 0.35, units: 25 },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReportGeneratorService],
    });
    service = TestBed.inject(ReportGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should generate a tabular report grouping by region with sales sum', () => {
    const state: DesignerSelectionState = {
      title: 'Sales by Region',
      artifactType: 'tabular',
      fields: [
        {
          field: { name: 'region', label: 'Region', dataType: 'string', folderId: 'geo' },
          aggregation: 'none',
          groupBy: true,
        },
        {
          field: { name: 'sales', label: 'Total Revenue', dataType: 'number', folderId: 'financials' },
          aggregation: 'sum',
          groupBy: false,
          columnFormat: 'currency',
        },
      ],
    };

    const report = service.generateReport(state, mockData);

    expect(report.title).toBe('Sales by Region');
    expect(report.artifactType).toBe('tabular');
    expect(report.columns.length).toBe(2);
    expect(report.rows.length).toBe(3); // North America, Europe, Asia Pacific

    const naRow = report.rows.find((r) => r['region'] === 'North America');
    expect(naRow).toBeDefined();
    expect(naRow?.['sales']).toBe(20000); // 12000 + 8000

    const euRow = report.rows.find((r) => r['region'] === 'Europe');
    expect(euRow?.['sales']).toBe(20000); // 15000 + 5000

    const apacRow = report.rows.find((r) => r['region'] === 'Asia Pacific');
    expect(apacRow?.['sales']).toBe(18000);
  });

  it('should compute average and distinct count aggregations', () => {
    const state: DesignerSelectionState = {
      title: 'Category Metrics',
      artifactType: 'tabular',
      fields: [
        {
          field: { name: 'category', label: 'Category', dataType: 'string', folderId: 'prod' },
          aggregation: 'none',
          groupBy: true,
        },
        {
          field: { name: 'sales', label: 'Avg Sales', dataType: 'number', folderId: 'fin' },
          aggregation: 'avg',
          groupBy: false,
        },
        {
          field: { name: 'region', label: 'Distinct Regions', dataType: 'string', folderId: 'geo' },
          aggregation: 'countDistinct',
          groupBy: false,
        },
      ],
    };

    const report = service.generateReport(state, mockData);
    expect(report.rows.length).toBe(2); // Software, Hardware

    const sw = report.rows.find((r) => r['category'] === 'Software');
    expect(sw).toBeDefined();
    // Software sales: 12000, 15000, 18000 -> avg = 15000
    expect(sw?.['sales']).toBe(15000);
    expect(sw?.['region']).toBe(3); // NA, EU, APAC

    const hw = report.rows.find((r) => r['category'] === 'Hardware');
    // Hardware sales: 8000, 5000 -> avg = 6500
    expect(hw?.['sales']).toBe(6500);
    expect(hw?.['region']).toBe(2); // NA, EU
  });

  it('should generate a graph report with dataPoints and colors', () => {
    const state: DesignerSelectionState = {
      title: 'Revenue Bar Chart',
      artifactType: 'graph',
      graphType: 'bar',
      fields: [
        {
          field: { name: 'region', label: 'Region', dataType: 'string', folderId: 'geo' },
          aggregation: 'none',
          groupBy: true,
        },
        {
          field: { name: 'sales', label: 'Sales', dataType: 'number', folderId: 'fin' },
          aggregation: 'sum',
          groupBy: false,
          columnFormat: 'currency',
        },
      ],
    };

    const report = service.generateReport(state, mockData);
    expect(report.artifactType).toBe('graph');
    expect(report.dataPoints.length).toBe(3);
    expect(report.dataPoints[0].color).toBeDefined();
    expect(report.dataPoints[0].formattedValue).toContain('$');
  });

  it('should generate an executive KPI report with primary data point and summary metrics', () => {
    const state: DesignerSelectionState = {
      title: 'Total Gross Revenue',
      artifactType: 'kpi',
      fields: [
        {
          field: { name: 'sales', label: 'Total Revenue', dataType: 'number', folderId: 'fin' },
          aggregation: 'sum',
          groupBy: false,
          columnFormat: 'currency',
        },
      ],
    };

    const report = service.generateReport(state, mockData);
    expect(report.artifactType).toBe('kpi');
    expect(report.dataPoints.length).toBe(1);
    expect(report.dataPoints[0].value).toBe(58000); // 12000+8000+15000+5000+18000
    expect(report.dataPoints[0].formattedValue).toBe('$58,000.00');
  });

  it('should export reports to valid CSV and JSON format', () => {
    const state: DesignerSelectionState = {
      title: 'Export Test',
      artifactType: 'tabular',
      fields: [
        {
          field: { name: 'category', label: 'Category', dataType: 'string', folderId: 'prod' },
          aggregation: 'none',
          groupBy: true,
        },
        {
          field: { name: 'sales', label: 'Sales', dataType: 'number', folderId: 'fin' },
          aggregation: 'sum',
          groupBy: false,
        },
      ],
    };

    const report = service.generateReport(state, mockData);
    const csv = service.exportToCsv(report);
    expect(csv).toContain('"Category","Sales"');
    expect(csv).toContain('"Software","45,000"');
    expect(csv).toContain('"Hardware","13,000"');

    const json = service.exportToJson(report);
    const parsed = JSON.parse(json);
    expect(parsed.title).toBe('Export Test');
    expect(parsed.rows.length).toBe(2);
    expect(parsed.columns.length).toBe(2);
  });
});
