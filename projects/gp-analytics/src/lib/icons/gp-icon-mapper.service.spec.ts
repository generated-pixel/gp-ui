import { TestBed } from '@angular/core/testing';

import { GpIconMapperService } from './gp-icon-mapper.service';

describe('GpIconMapperService', () => {
  let service: GpIconMapperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GpIconMapperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should map artifact types to icon names', () => {
    expect(service.artifact('tabular')).toBe('artifact-tabular');
    expect(service.artifact('graph')).toBe('artifact-graph');
    expect(service.artifact('kpi')).toBe('artifact-kpi');
  });

  it('should map graph types to icon names', () => {
    expect(service.graphType('pie')).toBe('graph-pie');
    expect(service.graphType('bar')).toBe('graph-bar');
    expect(service.graphType('stacked-bar')).toBe('graph-stacked-bar');
    expect(service.graphType('column')).toBe('graph-column');
    expect(service.graphType('stacked-column')).toBe('graph-stacked-column');
    expect(service.graphType('radial')).toBe('graph-radial');
  });

  it('should map field data types to icon names', () => {
    expect(service.fieldType('string')).toBe('type-string');
    expect(service.fieldType('number')).toBe('type-number');
    expect(service.fieldType('integer')).toBe('type-integer');
    expect(service.fieldType('boolean')).toBe('type-boolean');
    expect(service.fieldType('date')).toBe('type-date');
    expect(service.fieldType('datetime')).toBe('type-datetime');
    expect(service.fieldType('time')).toBe('type-time');
  });

  it('should map aggregation types to icon names', () => {
    expect(service.aggregation('none')).toBe('agg-none');
    expect(service.aggregation('sum')).toBe('agg-sum');
    expect(service.aggregation('avg')).toBe('agg-avg');
    expect(service.aggregation('min')).toBe('agg-min');
    expect(service.aggregation('max')).toBe('agg-max');
    expect(service.aggregation('count')).toBe('agg-count');
    expect(service.aggregation('countDistinct')).toBe('agg-count-distinct');
  });

  it('should map graph roles to icon names', () => {
    expect(service.graphRole('x-axis')).toBe('role-x-axis');
    expect(service.graphRole('y-axis')).toBe('role-y-axis');
    expect(service.graphRole('series')).toBe('role-series');
    expect(service.graphRole('tooltip')).toBe('role-tooltip');
  });

  it('should map sort direction to sort icons', () => {
    expect(service.sortDirection('asc')).toBe('sort-asc');
    expect(service.sortDirection('desc')).toBe('sort-desc');
    expect(service.sortDirection(undefined)).toBe('sort-none');
  });
});
