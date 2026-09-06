import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { GpDatasetDataLoaderService } from './dataset-data-loader.service';
import { createDatasetField, DatasetField } from '../models/dataset-field.model';
import { DataType } from '../models/data-type.model';
import { Field } from '../models/field.model';

describe('GpDatasetDataLoaderService', () => {
  let service: GpDatasetDataLoaderService;

  const sampleField1: Field = {
    fieldId: 'customer_name',
    tableId: 'tbl_customers',
    fieldGroupingId: 'fg1',
    fieldName: 'customer_name',
    fieldDisplayName: { value: 'Customer Name', displayValue: { en: 'Customer Name' } },
    dataType: DataType.String,
    visible: true,
    isPrimaryKey: false,
    isIndex: false,
    isJoinField: false,
    usableInReports: true,
    filterable: true,
    sortable: true,
    groupable: true
  };

  const sampleField2: Field = {
    fieldId: 'order_total',
    tableId: 'tbl_orders',
    fieldGroupingId: 'fg1',
    fieldName: 'order_total',
    fieldDisplayName: { value: 'Order Total', displayValue: { en: 'Order Total' } },
    dataType: DataType.Decimal,
    visible: true,
    isPrimaryKey: false,
    isIndex: false,
    isJoinField: false,
    usableInReports: true,
    filterable: true,
    sortable: true,
    groupable: false
  };

  const sampleField3: Field = {
    fieldId: 'status',
    tableId: 'tbl_orders',
    fieldGroupingId: 'fg1',
    fieldName: 'status',
    fieldDisplayName: { value: 'Status', displayValue: { en: 'Status' } },
    dataType: DataType.String,
    visible: true,
    isPrimaryKey: false,
    isIndex: false,
    isJoinField: false,
    usableInReports: true,
    filterable: true,
    sortable: true,
    groupable: true
  };

  const mockFields: DatasetField[] = [
    createDatasetField(sampleField1, 'df_customer_name_123'),
    createDatasetField(sampleField2, 'df_order_total_456'),
    createDatasetField(sampleField3, 'df_status_789')
  ];

  beforeEach(() => {
    service = new GpDatasetDataLoaderService();
  });

  describe('parseJson', () => {
    it('returns empty array when input is empty or blank', () => {
      expect(service.parseJson('')).toEqual([]);
      expect(service.parseJson('   ')).toEqual([]);
    });

    it('parses a direct JSON array of objects', () => {
      const json = JSON.stringify([
        { customer_name: 'Acme Corp', order_total: 1200 },
        { customer_name: 'Global Tech', order_total: 450 }
      ]);
      const result = service.parseJson(json);
      expect(result).toHaveLength(2);
      expect(result[0]['customer_name']).toBe('Acme Corp');
    });

    it('extracts records using explicit dot-path navigation', () => {
      const json = JSON.stringify({
        response: {
          payload: {
            items: [
              { id: 1, name: 'Item 1' },
              { id: 2, name: 'Item 2' }
            ]
          }
        }
      });
      const result = service.parseJson(json, 'response.payload.items');
      expect(result).toHaveLength(2);
      expect(result[0]['name']).toBe('Item 1');
    });

    it('throws error if specified dataPath is not found', () => {
      const json = JSON.stringify({ data: [1, 2, 3] });
      expect(() => service.parseJson(json, 'invalid.path')).toThrow("Data path 'invalid.path' not found in payload");
    });

    it('auto-detects common nested list keys (value, items, data, results, records)', () => {
      const odataPayload = JSON.stringify({
        '@odata.context': '...',
        value: [{ customer_name: 'Alice' }, { customer_name: 'Bob' }]
      });
      expect(service.parseJson(odataPayload)).toHaveLength(2);

      const itemsPayload = JSON.stringify({
        items: [{ customer_name: 'Charlie' }]
      });
      expect(service.parseJson(itemsPayload)).toHaveLength(1);
    });

    it('throws error on invalid JSON string', () => {
      expect(() => service.parseJson('{ invalid json: true }')).toThrow('Invalid JSON:');
    });
  });

  describe('mapRecordsToDatasetFields', () => {
    it('maps records using exact fieldName matches', () => {
      const rawRecords = [{ customer_name: 'Wayne Enterprises', order_total: 99000, status: 'Shipped' }];
      const mapped = service.mapRecordsToDatasetFields(rawRecords, mockFields);

      expect(mapped).toHaveLength(1);
      expect(mapped[0]['df_customer_name_123']).toBe('Wayne Enterprises');
      expect(mapped[0]['df_order_total_456']).toBe(99000);
      expect(mapped[0]['df_status_789']).toBe('Shipped');
      expect(mapped[0]['_id']).toBeDefined();
    });

    it('maps records using normalized and camelCase / display name matching', () => {
      const rawRecords = [
        {
          CustomerName: 'Stark Industries',
          'Order Total': 150000,
          status: 'Delivered'
        }
      ];
      const mapped = service.mapRecordsToDatasetFields(rawRecords, mockFields);

      expect(mapped[0]['df_customer_name_123']).toBe('Stark Industries');
      expect(mapped[0]['df_order_total_456']).toBe(150000);
      expect(mapped[0]['df_status_789']).toBe('Delivered');
    });

    it('preserves existing properties and leaves missing fields as null', () => {
      const rawRecords = [{ customer_name: 'Wonka Inc', customExtra: 'secret' }];
      const mapped = service.mapRecordsToDatasetFields(rawRecords, mockFields);

      expect(mapped[0]['df_customer_name_123']).toBe('Wonka Inc');
      expect(mapped[0]['df_order_total_456']).toBeNull();
      expect(mapped[0]['customExtra']).toBe('secret');
    });
  });

  describe('analyzeFieldMatching', () => {
    it('detects matched and unmatched fields based on first sample record', () => {
      const records = [{ customer_name: 'Acme', status: 'Pending' }];
      const analysis = service.analyzeFieldMatching(records, mockFields);

      expect(analysis.matchedFields).toContain('customer_name');
      expect(analysis.matchedFields).toContain('status');
      expect(analysis.unmatchedFields).toContain('order_total');
    });

    it('reports all as unmatched when records is empty', () => {
      const analysis = service.analyzeFieldMatching([], mockFields);
      expect(analysis.matchedFields).toHaveLength(0);
      expect(analysis.unmatchedFields).toHaveLength(3);
    });
  });

  describe('loadData', () => {
    it('loads and maps data from raw JSON config', async () => {
      const config = {
        type: 'json' as const,
        rawJson: JSON.stringify([
          { customer_name: 'Alpha Corp', order_total: 500, status: 'Active' },
          { customer_name: 'Beta LLC', order_total: 750, status: 'Pending' }
        ])
      };

      const result = await service.loadData(config, mockFields);
      expect(result.sourceType).toBe('json');
      expect(result.totalRecords).toBe(2);
      expect(result.records[0]['df_customer_name_123']).toBe('Alpha Corp');
      expect(result.matchedFields).toEqual(expect.arrayContaining(['customer_name', 'order_total', 'status']));
    });

    it('loads and maps data from File config', async () => {
      const blob = new Blob([JSON.stringify([{ customer_name: 'File Corp', order_total: 100 }])], {
        type: 'application/json'
      });
      const file = new File([blob], 'sample.json', { type: 'application/json' });

      const config = {
        type: 'file' as const,
        file,
        fileName: 'sample.json'
      };

      const result = await service.loadData(config, mockFields);
      expect(result.sourceType).toBe('file');
      expect(result.sourceName).toBe('sample.json');
      expect(result.totalRecords).toBe(1);
      expect(result.records[0]['df_customer_name_123']).toBe('File Corp');
    });

    it('loads and maps data from API config using fetch', async () => {
      const mockApiResponse = [{ customer_name: 'API Cloud', order_total: 3000, status: 'Completed' }];

      const originalFetch = globalThis.fetch;
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockApiResponse
      } as any);

      try {
        const config = {
          type: 'api' as const,
          url: 'https://api.example.com/dataset'
        };

        const result = await service.loadData(config, mockFields);
        expect(result.sourceType).toBe('api');
        expect(result.sourceName).toBe('https://api.example.com/dataset');
        expect(result.totalRecords).toBe(1);
        expect(result.records[0]['df_customer_name_123']).toBe('API Cloud');
      } finally {
        globalThis.fetch = originalFetch;
      }
    });

    it('handles API fetch errors gracefully', async () => {
      const originalFetch = globalThis.fetch;
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      } as any);

      try {
        const config = {
          type: 'api' as const,
          url: 'https://api.example.com/not-found'
        };

        await expect(service.loadData(config, mockFields)).rejects.toThrow('HTTP 404: Not Found');
      } finally {
        globalThis.fetch = originalFetch;
      }
    });
  });
});
