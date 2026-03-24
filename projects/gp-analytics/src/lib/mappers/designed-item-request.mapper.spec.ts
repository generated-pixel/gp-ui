import { buildDesignedItemRequest } from './designed-item-request.mapper';

describe('buildDesignedItemRequest', () => {
  it('should map selection to request payload', () => {
    const request = buildDesignedItemRequest(
      {
        artifactType: 'tabular',
        fields: [
          {
            field: { name: 'region', dataType: 'string' },
            aggregation: 'none',
            groupBy: true,
          },
        ],
      },
      {
        name: 'Regional table',
        requestedAt: '2026-03-24T00:00:00.000Z',
      },
    );

    expect(request.name).toBe('Regional table');
    expect(request.artifactType).toBe('tabular');
    expect(request.fields.length).toBe(1);
    expect(request.requestedAt).toBe('2026-03-24T00:00:00.000Z');
  });

  it('should use default name based on artifact type', () => {
    const graph = buildDesignedItemRequest({ artifactType: 'graph', graphType: 'pie', fields: [] });
    const kpi = buildDesignedItemRequest({ artifactType: 'kpi', fields: [] });
    const table = buildDesignedItemRequest({ artifactType: 'tabular', fields: [] });

    expect(graph.name).toBe('Graph item');
    expect(graph.graphType).toBe('pie');
    expect(kpi.name).toBe('KPI item');
    expect(table.name).toBe('Tabular item');
  });

  it('should include style overrides when provided', () => {
    const request = buildDesignedItemRequest(
      { artifactType: 'kpi', fields: [] },
      { style: { highlighted: true, tone: 'success' } },
    );

    expect(request.style?.highlighted).toBe(true);
    expect(request.style?.tone).toBe('success');
  });
});
