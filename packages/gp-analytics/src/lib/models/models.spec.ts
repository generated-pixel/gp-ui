import { describe, expect, it } from 'vitest';
import { Grouping, Relationship, FieldValue } from './index';

describe('metadata models', () => {
  it('supports grouped tables and localized field values', () => {
    const grouping: Grouping = {
      groupingId: 'group-a',
      groupingName: 'Commerce',
      tables: [],
    };
    const value: FieldValue<string> = {
      value: 'customer-001',
      displayValue: { en: 'Customer', fr: 'Client' },
    };

    expect(grouping.groupingName).toBe('Commerce');
    expect(value.value).toBe('customer-001');
    expect(value.displayValue['fr']).toBe('Client');
  });

  it('supports one-to-many join relationships', () => {
    const relationship: Relationship = {
      relationshipId: 'customer-orders',
      name: 'Customer orders',
      sourceTableId: 'customers',
      sourceFieldId: 'customer-id',
      targetTableId: 'orders',
      targetFieldId: 'order-customer-id',
      cardinality: 'one-to-many',
    };

    expect(relationship.cardinality).toBe('one-to-many');
  });
});