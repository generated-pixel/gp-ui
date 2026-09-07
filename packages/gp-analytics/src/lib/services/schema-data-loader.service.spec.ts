import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GpSchemaDataLoaderService } from './schema-data-loader.service';

describe('GpSchemaDataLoaderService', () => {
  let service: GpSchemaDataLoaderService;

  beforeEach(() => {
    service = new GpSchemaDataLoaderService();
  });

  it('should list built-in schema presets', () => {
    const presets = service.getPresetSchemas();
    expect(presets.length).toBeGreaterThanOrEqual(4);
    expect(presets.map((p) => p.id)).toContain('healthcare');
    expect(presets.map((p) => p.id)).toContain('commerce');
    expect(presets.map((p) => p.id)).toContain('logistics');
    expect(presets.map((p) => p.id)).toContain('saas');
  });

  it('should parse a complete Grouping[] JSON payload', () => {
    const json = JSON.stringify([
      {
        groupingId: 'grp-test',
        groupingName: 'Test Group',
        tables: [
          {
            tableId: 'tbl-test',
            tableName: 'Test Table',
            fields: [
              {
                fieldGroupingId: 'fg-1',
                fieldGroupingName: 'FG 1',
                fields: [
                  {
                    fieldId: 'f1',
                    fieldName: 'field_one',
                    fieldDisplayName: { value: 'Field One', displayValue: { en: 'Field One' } },
                    dataType: 'string',
                    visible: true,
                    isPrimaryKey: true
                  }
                ]
              }
            ]
          }
        ]
      }
    ]);

    const result = service.parseJson(json);
    expect(result.groupings.length).toBe(1);
    expect(result.groupings[0].groupingId).toBe('grp-test');
    expect(result.groupings[0].tables[0].tableId).toBe('tbl-test');
    expect(result.groupings[0].tables[0].fields[0].fields[0].fieldId).toBe('f1');
    expect(result.groupings[0].tables[0].fields[0].fields[0].isPrimaryKey).toBe(true);
  });

  it('should auto-wrap a flat array of tables into a default grouping', () => {
    const json = JSON.stringify([
      {
        tableId: 'users',
        tableName: 'App Users',
        fields: [
          {
            fieldId: 'user_id',
            displayName: 'User ID',
            type: 'string',
            primaryKey: true
          },
          {
            fieldId: 'email',
            displayName: 'Email Address',
            type: 'string'
          }
        ]
      }
    ]);

    const result = service.parseJson(json);
    expect(result.groupings.length).toBe(1);
    expect(result.groupings[0].tables.length).toBe(1);
    expect(result.groupings[0].tables[0].tableName).toBe('App Users');

    const fields = result.groupings[0].tables[0].fields[0].fields;
    expect(fields.length).toBe(2);
    expect(fields[0].fieldDisplayName.value).toBe('User ID');
    expect(fields[0].fieldDisplayName.displayValue['en']).toBe('User ID');
    expect(fields[0].isPrimaryKey).toBe(true);
    expect(fields[1].fieldDisplayName.value).toBe('Email Address');
  });

  it('should support dot-delimited dataPath navigation', () => {
    const json = JSON.stringify({
      status: 'success',
      metadata: {
        catalogue: {
          tables: [
            {
              tableId: 'accounts',
              name: 'Accounts',
              fields: [{ id: 'acc_id', name: 'Account ID' }]
            }
          ]
        }
      }
    });

    const result = service.parseJson(json, 'metadata.catalogue');
    expect(result.groupings.length).toBe(1);
    expect(result.groupings[0].tables[0].tableId).toBe('accounts');
  });

  it('should load preset schema via loadSchema', async () => {
    const res = await service.loadSchema({
      type: 'preset',
      presetId: 'healthcare'
    });

    expect(res.sourceType).toBe('preset');
    expect(res.sourceName).toBe('Healthcare & Clinical');
    expect(res.totalTables).toBe(3);
    expect(res.totalFields).toBe(11);
    expect(res.groupings[0].tables.map((t) => t.tableId)).toEqual(['patients', 'encounters', 'diagnoses']);
  });

  it('should load raw JSON via loadSchema', async () => {
    const raw = JSON.stringify({
      groups: [
        {
          id: 'grp-inv',
          name: 'Inventory Group',
          tables: [
            {
              id: 'items',
              name: 'Inventory Items',
              fields: [{ id: 'item_code', label: 'Item Code', type: 'string' }]
            }
          ]
        }
      ]
    });

    const res = await service.loadSchema({
      type: 'json',
      rawJson: raw
    });

    expect(res.sourceType).toBe('json');
    expect(res.totalTables).toBe(1);
    expect(res.totalFields).toBe(1);
    expect(res.groupings[0].groupingId).toBe('grp-inv');
  });

  it('should throw clear error on invalid JSON', () => {
    expect(() => service.parseJson('{ bad json')).toThrow('Invalid schema JSON');
  });

  it('should throw clear error on empty payload', () => {
    expect(() => service.parseJson('   ')).toThrow('Empty schema payload');
  });

  it('should fetch schema from URL via fetchFromUrl', async () => {
    const mockData = [
      {
        tableId: 'remote_table',
        tableName: 'Remote Table',
        fields: [{ fieldId: 'r1', fieldName: 'remote_field' }]
      }
    ];

    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    } as any);

    const res = await service.fetchFromUrl('https://api.example.com/schema');
    expect(fetchSpy).toHaveBeenCalled();
    expect(res.groupings[0].tables[0].tableId).toBe('remote_table');

    fetchSpy.mockRestore();
  });
});
