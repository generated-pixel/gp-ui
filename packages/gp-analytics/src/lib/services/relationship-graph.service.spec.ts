import { describe, expect, it } from 'vitest';
import { GpRelationshipGraphService } from './relationship-graph.service';
import { Field, Grouping, Relationship } from '../models';

describe('GpRelationshipGraphService', () => {
  const service = new GpRelationshipGraphService();

  const mockRelationships: Relationship[] = [
    {
      relationshipId: 'rel-customers-orders',
      name: 'Customers to Orders',
      sourceTableId: 'table-customers',
      sourceFieldId: 'customer-id',
      targetTableId: 'table-orders',
      targetFieldId: 'order-customer-id',
      cardinality: 'one-to-many'
    },
    {
      relationshipId: 'rel-orders-items',
      name: 'Orders to Items',
      sourceTableId: 'table-orders',
      sourceFieldId: 'order-id',
      targetTableId: 'table-order-items',
      targetFieldId: 'item-order-id',
      cardinality: 'one-to-many'
    }
  ];

  it('allows all tables when active dataset tables are empty', () => {
    const eligible = service.getEligibleTableIds([], mockRelationships);
    expect(eligible).toBeNull(); // Wildcard / all allowed

    expect(service.isTableEligible('table-customers', [], mockRelationships)).toBe(true);
    expect(service.isTableEligible('table-unrelated', [], mockRelationships)).toBe(true);
  });

  it('disables unrelated tables and enables current + directly related tables', () => {
    // When fields from table-customers are in dataset:
    const active = new Set(['table-customers']);
    const eligible = service.getEligibleTableIds(active, mockRelationships);

    expect(eligible).not.toBeNull();
    // Current table is eligible
    expect(eligible?.has('table-customers')).toBe(true);
    // Directly linked table-orders is eligible
    expect(eligible?.has('table-orders')).toBe(true);
    // table-order-items is 2 hops away, not directly linked to customers: not eligible
    expect(eligible?.has('table-order-items')).toBe(false);
    // Completely unrelated table is not eligible
    expect(eligible?.has('table-employees')).toBe(false);
  });

  it('supports bidirectional relationship navigation', () => {
    // If active table is table-orders, both table-customers (source) and table-order-items (target) are directly linked!
    const active = new Set(['table-orders']);
    const eligible = service.getEligibleTableIds(active, mockRelationships);

    expect(eligible?.has('table-orders')).toBe(true);
    expect(eligible?.has('table-customers')).toBe(true);
    expect(eligible?.has('table-order-items')).toBe(true);
    expect(eligible?.has('table-unrelated')).toBe(false);
  });

  it('validates field selectability based on visibility, reporting, and relationships', () => {
    const validField: Field = {
      fieldId: 'f1',
      tableId: 'table-customers',
      fieldGroupingId: 'fg1',
      fieldName: 'name',
      fieldDisplayName: { value: 'Name', displayValue: { en: 'Name' } },
      dataType: 'string',
      visible: true,
      isPrimaryKey: false,
      isIndex: false,
      isJoinField: false,
      usableInReports: true,
      filterable: true,
      sortable: true,
      groupable: true
    };

    // When empty dataset, valid field is selectable
    const check1 = service.checkFieldSelectability(validField, [], mockRelationships);
    expect(check1.selectable).toBe(true);

    // If invisible
    const hiddenField: Field = { ...validField, visible: false };
    const checkHidden = service.checkFieldSelectability(hiddenField, [], mockRelationships);
    expect(checkHidden.selectable).toBe(false);
    expect(checkHidden.reason).toBe('not-visible');

    // If not usable in reports
    const internalField: Field = { ...validField, usableInReports: false };
    const checkInternal = service.checkFieldSelectability(internalField, [], mockRelationships);
    expect(checkInternal.selectable).toBe(false);
    expect(checkInternal.reason).toBe('not-usable-in-reports');

    // If table is unrelated
    const activeOrders = new Set(['table-orders']);
    const unrelatedField: Field = { ...validField, tableId: 'table-employees' };
    const checkUnrelated = service.checkFieldSelectability(unrelatedField, activeOrders, mockRelationships);
    expect(checkUnrelated.selectable).toBe(false);
    expect(checkUnrelated.reason).toBe('table-not-related');
  });

  it('collects relationships across groupings', () => {
    const groupings: Grouping[] = [
      {
        groupingId: 'g1',
        groupingName: 'Group 1',
        tables: [],
        relationships: [mockRelationships[0]]
      },
      {
        groupingId: 'g2',
        groupingName: 'Group 2',
        tables: [],
        relationships: [mockRelationships[1]]
      }
    ];

    const collected = service.collectRelationships(groupings);
    expect(collected.length).toBe(2);
    expect(collected[0].relationshipId).toBe('rel-customers-orders');
    expect(collected[1].relationshipId).toBe('rel-orders-items');
  });
});
