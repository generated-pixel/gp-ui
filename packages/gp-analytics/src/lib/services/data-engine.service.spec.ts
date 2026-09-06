import { describe, expect, it, beforeEach } from 'vitest';
import { GpDataEngineService } from './data-engine.service';
import { GpAnalyticalQuerySpec } from '../models/query.model';

describe('GpDataEngineService', () => {
  let service: GpDataEngineService;

  const mockRecords = [
    { customer: 'Northwind', region: 'EMEA', total: 1000, quantity: 5, date: '2026-01-01' },
    { customer: 'Northwind', region: 'EMEA', total: 2000, quantity: 10, date: '2026-01-02' },
    { customer: 'Acme Corp', region: 'AMER', total: 3000, quantity: 15, date: '2026-01-03' },
    { customer: 'Acme Corp', region: 'AMER', total: 1500, quantity: 8, date: '2026-01-04' },
    { customer: 'Starlight', region: 'APAC', total: 500, quantity: 2, date: '2026-01-05' },
  ];

  beforeEach(() => {
    service = new GpDataEngineService();
  });

  describe('executeQuery', () => {
    it('groups by single dimension and computes SUM and COUNT aggregations', () => {
      const spec: GpAnalyticalQuerySpec = {
        dimensions: ['customer'],
        measures: [
          { fieldId: 'total', aggregation: 'sum', alias: 'total_revenue' },
          { fieldId: 'total', aggregation: 'count', alias: 'order_count' },
        ],
      };

      const result = service.executeQuery(mockRecords, spec);
      expect(result.totalCount).toBe(3); // Northwind, Acme Corp, Starlight
      expect(result.rows).toHaveLength(3);

      const northwind = result.rows.find((r) => r['customer'] === 'Northwind');
      expect(northwind).toBeDefined();
      expect(northwind!['total_revenue']).toBe(3000);
      expect(northwind!['order_count']).toBe(2);

      const acme = result.rows.find((r) => r['customer'] === 'Acme Corp');
      expect(acme!['total_revenue']).toBe(4500);
      expect(acme!['order_count']).toBe(2);

      // Grand total check
      expect(result.grandTotal?.['total_revenue']).toBe(8000);
      expect(result.grandTotal?.['order_count']).toBe(5);
    });

    it('filters records using operators before aggregation', () => {
      const spec: GpAnalyticalQuerySpec = {
        dimensions: ['customer'],
        measures: [{ fieldId: 'total', aggregation: 'sum', alias: 'rev' }],
        filters: [
          { fieldId: 'region', operator: 'eq', value: 'AMER' },
        ],
      };

      const result = service.executeQuery(mockRecords, spec);
      expect(result.totalCount).toBe(1);
      expect(result.rows[0]['customer']).toBe('Acme Corp');
      expect(result.rows[0]['rev']).toBe(4500);
    });

    it('evaluates advanced filter operators (between, in, not_in, startsWith, endsWith)', () => {
      // Between: total between 1200 and 2500 -> Northwind (2000), Acme Corp (1500)
      const betweenSpec: GpAnalyticalQuerySpec = {
        dimensions: ['customer'],
        measures: [{ fieldId: 'total', aggregation: 'count', alias: 'cnt' }],
        filters: [{ fieldId: 'total', operator: 'between', value: 1200, secondValue: 2500 }],
      };
      const bRes = service.executeQuery(mockRecords, betweenSpec);
      expect(bRes.totalCount).toBe(2);

      // In: region in ['EMEA', 'APAC'] -> Northwind (2), Starlight (1)
      const inSpec: GpAnalyticalQuerySpec = {
        dimensions: ['customer'],
        measures: [{ fieldId: 'total', aggregation: 'count', alias: 'cnt' }],
        filters: [{ fieldId: 'region', operator: 'in', value: ['EMEA', 'APAC'] }],
      };
      const inRes = service.executeQuery(mockRecords, inSpec);
      expect(inRes.totalCount).toBe(2);

      // Not in: region not in ['EMEA', 'APAC'] -> Acme Corp
      const notInSpec: GpAnalyticalQuerySpec = {
        dimensions: ['customer'],
        measures: [{ fieldId: 'total', aggregation: 'count', alias: 'cnt' }],
        filters: [{ fieldId: 'region', operator: 'not_in', value: ['EMEA', 'APAC'] }],
      };
      const notInRes = service.executeQuery(mockRecords, notInSpec);
      expect(notInRes.totalCount).toBe(1);
      expect(notInRes.rows[0]['customer']).toBe('Acme Corp');

      // StartsWith: customer starts with 'North'
      const startsSpec: GpAnalyticalQuerySpec = {
        dimensions: ['customer'],
        measures: [{ fieldId: 'total', aggregation: 'count', alias: 'cnt' }],
        filters: [{ fieldId: 'customer', operator: 'startsWith', value: 'North' }],
      };
      const startsRes = service.executeQuery(mockRecords, startsSpec);
      expect(startsRes.totalCount).toBe(1);
      expect(startsRes.rows[0]['customer']).toBe('Northwind');

      // EndsWith: customer ends with 'Corp'
      const endsSpec: GpAnalyticalQuerySpec = {
        dimensions: ['customer'],
        measures: [{ fieldId: 'total', aggregation: 'count', alias: 'cnt' }],
        filters: [{ fieldId: 'customer', operator: 'endsWith', value: 'Corp' }],
      };
      const endsRes = service.executeQuery(mockRecords, endsSpec);
      expect(endsRes.totalCount).toBe(1);
      expect(endsRes.rows[0]['customer']).toBe('Acme Corp');
    });

    it('sorts aggregated rows by measure descending', () => {
      const spec: GpAnalyticalQuerySpec = {
        dimensions: ['customer'],
        measures: [{ fieldId: 'total', aggregation: 'sum', alias: 'rev' }],
        sorts: [{ fieldId: 'rev', order: 'desc' }],
      };

      const result = service.executeQuery(mockRecords, spec);
      expect(result.rows[0]['customer']).toBe('Acme Corp'); // 4500
      expect(result.rows[1]['customer']).toBe('Northwind'); // 3000
      expect(result.rows[2]['customer']).toBe('Starlight'); // 500
    });

    it('computes subtotals when multi-dimensional grouping is requested', () => {
      const spec: GpAnalyticalQuerySpec = {
        dimensions: ['region', 'customer'],
        measures: [{ fieldId: 'total', aggregation: 'sum', alias: 'rev' }],
      };

      const result = service.executeQuery(mockRecords, spec);
      expect(result.subtotals).toBeDefined();
      expect(result.subtotals!.length).toBe(3); // EMEA, AMER, APAC

      const amerSubtotal = result.subtotals!.find((s) => s['region'] === 'AMER');
      expect(amerSubtotal!['rev']).toBe(4500);
    });

    it('computes median, variance, and stddev statistical aggregations', () => {
      // mock totals: [1000, 2000, 3000, 1500, 500] -> sorted: [500, 1000, 1500, 2000, 3000]
      // median = 1500
      // mean = 8000 / 5 = 1600
      // diffs: [-1100, -600, -100, 400, 1400]
      // squared: [1210000, 360000, 10000, 160000, 1960000] = 3700000 / 5 = 740000
      // variance = 740000, stddev = sqrt(740000) = 860.23
      const spec: GpAnalyticalQuerySpec = {
        dimensions: [],
        measures: [
          { fieldId: 'total', aggregation: 'median', alias: 'med' },
          { fieldId: 'total', aggregation: 'variance', alias: 'var' },
          { fieldId: 'total', aggregation: 'stddev', alias: 'std' },
        ],
      };

      const result = service.executeQuery(mockRecords, spec);
      expect(result.rows[0]['med']).toBe(1500);
      expect(result.rows[0]['var']).toBe(740000);
      expect(result.rows[0]['std']).toBe(860.23);
    });

    it('evaluates calculated formula fields dynamically across records', () => {
      // records: { total: 1000, quantity: 5 } -> unit_price = 1000 / 5 = 200
      // { total: 2000, quantity: 10 } -> 200
      // { total: 3000, quantity: 15 } -> 200
      // { total: 1500, quantity: 8 } -> 187.5
      // { total: 500, quantity: 2 } -> 250
      const spec: GpAnalyticalQuerySpec = {
        dimensions: ['customer'],
        calculatedFields: [
          { id: 'unit_price', expression: 'total / quantity' },
        ],
        measures: [
          { fieldId: 'unit_price', aggregation: 'avg', alias: 'avg_unit_price' },
        ],
      };

      const result = service.executeQuery(mockRecords, spec);
      const northwind = result.rows.find((r) => r['customer'] === 'Northwind');
      expect(northwind!['avg_unit_price']).toBe(200);

      const starlight = result.rows.find((r) => r['customer'] === 'Starlight');
      expect(starlight!['avg_unit_price']).toBe(250);
    });

    it('groups records using temporal date-grain rollups (month & quarter)', () => {
      // dates in mockRecords:
      // '2026-01-01', '2026-01-02', '2026-01-03', '2026-01-04', '2026-01-05'
      // all in month '2026-01' and quarter '2026-Q1'
      const monthlySpec: GpAnalyticalQuerySpec = {
        dimensions: ['date'],
        timeGrain: 'month',
        timeFieldId: 'date',
        measures: [{ fieldId: 'total', aggregation: 'sum', alias: 'month_total' }],
      };

      const monthResult = service.executeQuery(mockRecords, monthlySpec);
      expect(monthResult.rows).toHaveLength(1);
      expect(monthResult.rows[0]['date']).toBe('2026-01');
      expect(monthResult.rows[0]['month_total']).toBe(8000);

      const quarterSpec: GpAnalyticalQuerySpec = {
        dimensions: ['date'],
        timeGrain: 'quarter',
        timeFieldId: 'date',
        measures: [{ fieldId: 'total', aggregation: 'sum', alias: 'q_total' }],
      };
      const qResult = service.executeQuery(mockRecords, quarterSpec);
      expect(qResult.rows[0]['date']).toBe('2026-Q1');
      expect(qResult.rows[0]['q_total']).toBe(8000);
    });
  });

  describe('computeKpiMetric', () => {
    it('computes current metric value, variance, and trend direction', () => {
      const previousRecords = [
        { total: 800 },
        { total: 1200 },
      ]; // previous sum = 2000

      const kpi = service.computeKpiMetric(
        mockRecords, // current sum = 8000
        { fieldId: 'total', aggregation: 'sum' },
        'Total Revenue',
        {
          previousRecords,
          targetValue: 10000,
          formatCurrency: true,
        },
      );

      expect(kpi.title).toBe('Total Revenue');
      expect(kpi.currentValue).toBe(8000);
      expect(kpi.previousValue).toBe(2000);
      expect(kpi.varianceAbsolute).toBe(6000);
      expect(kpi.variancePercentage).toBe(300);
      expect(kpi.trend).toBe('up');
      expect(kpi.trendSeverity).toBe('success');
      expect(kpi.targetProgressPercentage).toBe(80);
      expect(kpi.formattedCurrentValue).toBe('$8,000.00');
      expect(kpi.sparklinePoints.length).toBeGreaterThanOrEqual(5);
    });
  });

  describe('buildPivotMatrix', () => {
    it('generates a 2D cross-tabulation matrix with row and column totals', () => {
      const matrix = service.buildPivotMatrix(
        mockRecords,
        'customer',
        'region',
        { fieldId: 'total', aggregation: 'sum' },
      );

      expect(matrix.rowHeaders).toEqual(['Acme Corp', 'Northwind', 'Starlight']);
      expect(matrix.colHeaders).toEqual(['AMER', 'APAC', 'EMEA']);

      // Acme Corp in AMER = 4500
      const acmeRowIdx = matrix.rowHeaders.indexOf('Acme Corp');
      const amerColIdx = matrix.colHeaders.indexOf('AMER');
      expect(matrix.matrix[acmeRowIdx][amerColIdx]).toBe(4500);

      // Row totals
      expect(matrix.rowTotals[acmeRowIdx]).toBe(4500);
      expect(matrix.grandTotal).toBe(8000);
    });
  });

  describe('generateSql', () => {
    it('generates valid ANSI SQL query string from query spec', () => {
      const spec: GpAnalyticalQuerySpec = {
        dimensions: ['customer', 'region'],
        measures: [{ fieldId: 'total', aggregation: 'sum', alias: 'revenue' }],
        filters: [{ fieldId: 'total', operator: 'gt', value: 100 }],
        sorts: [{ fieldId: 'revenue', order: 'desc' }],
        pagination: { page: 1, pageSize: 20 },
      };

      const sql = service.generateSql(spec, 'orders');
      expect(sql).toContain('SELECT');
      expect(sql).toContain('SUM( "total") AS "revenue"');
      expect(sql).toContain('FROM "orders"');
      expect(sql).toContain('WHERE\n  "total" > 100');
      expect(sql).toContain('GROUP BY\n  "customer", "region"');
      expect(sql).toContain('ORDER BY\n  "revenue" DESC');
      expect(sql).toContain('LIMIT 20 OFFSET 0');
    });
  });
});
