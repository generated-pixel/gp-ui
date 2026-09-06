import { describe, expect, it } from 'vitest';
import { Grouping, Relationship, FieldValue, JoinType, FieldType, DataType, RelationshipCardinality } from './index';

describe('metadata models', () => {
  it('supports grouped tables and localized field values', () => {
    const grouping: Grouping = {
      groupingId: 'group-a',
      groupingName: 'Commerce',
      tables: []
    };
    const value: FieldValue<string> = {
      value: 'customer-001',
      displayValue: { en: 'Customer', fr: 'Client' }
    };

    expect(grouping.groupingName).toBe('Commerce');
    expect(value.value).toBe('customer-001');
    expect(value.displayValue['fr']).toBe('Client');
  });

  it('supports one-to-many join relationships with JoinType and RelationshipCardinality enums', () => {
    const relationship: Relationship = {
      relationshipId: 'customer-orders',
      name: 'Customer orders',
      sourceTableId: 'customers',
      sourceFieldId: 'customer-id',
      targetTableId: 'orders',
      targetFieldId: 'order-customer-id',
      cardinality: RelationshipCardinality.OneToMany,
      joinType: JoinType.Inner
    };

    expect(relationship.cardinality).toBe('one-to-many');
    expect(relationship.joinType).toBe('inner');
    expect(JoinType.Left).toBe('left');
    expect(JoinType.Right).toBe('right');
    expect(JoinType.Full).toBe('full');
    expect(JoinType.Cross).toBe('cross');
  });

  it('supports FieldType and DataType enums', () => {
    expect(FieldType.String).toBe('string');
    expect(FieldType.Integer).toBe('integer');
    expect(FieldType.Decimal).toBe('decimal');
    expect(FieldType.Number).toBe('number');
    expect(FieldType.Currency).toBe('currency');
    expect(FieldType.Boolean).toBe('boolean');
    expect(FieldType.Date).toBe('date');
    expect(FieldType.Time).toBe('time');
    expect(FieldType.DateTime).toBe('datetime');
    expect(FieldType.Guid).toBe('guid');
    expect(FieldType.Json).toBe('json');

    expect(DataType.String).toBe('string');
    expect(DataType.Currency).toBe('currency');
  });
});
