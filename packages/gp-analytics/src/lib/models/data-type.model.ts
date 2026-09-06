import { FieldType } from './field-type.model';

export { FieldType };

/**
 * DataType enum matching FieldType values.
 */
export enum DataType {
  String = 'string',
  Integer = 'integer',
  Decimal = 'decimal',
  Number = 'number',
  Currency = 'currency',
  Boolean = 'boolean',
  Date = 'date',
  Time = 'time',
  DateTime = 'datetime',
  Guid = 'guid',
  Json = 'json'
}
