import { TestBed } from '@angular/core/testing';

import { GpIconService } from './gp-icon.service';

describe('GpIconService', () => {
  let service: GpIconService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GpIconService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a SafeHtml value for every registered icon name', () => {
    service.getAllNames().forEach((name) => {
      const result = service.getSvg(name);
      // SafeHtml is an object wrapping the HTML string – it should be truthy
      expect(result).toBeTruthy();
    });
  });

  it('should return consistent results for repeated lookups of the same name', () => {
    const first = service.getSvg('artifact-tabular');
    const second = service.getSvg('artifact-tabular');
    expect(first).toBe(second);
  });

  it('should cache all icons on construction (same reference each call)', () => {
    const a = service.getSvg('graph-pie');
    const b = service.getSvg('graph-pie');
    expect(a).toBe(b);
  });

  it('should return SafeHtml for every artifact type icon', () => {
    service.getNamesForGroup('artifact').forEach((name) => {
      expect(service.getSvg(name)).toBeTruthy();
    });
  });

  it('should return SafeHtml for every graph type icon', () => {
    service.getNamesForGroup('graph').forEach((name) => {
      expect(service.getSvg(name)).toBeTruthy();
    });
  });

  it('should return SafeHtml for every field type icon', () => {
    service.getNamesForGroup('type').forEach((name) => {
      expect(service.getSvg(name)).toBeTruthy();
    });
  });

  it('should return SafeHtml for every aggregation icon', () => {
    service.getNamesForGroup('aggregation').forEach((name) => {
      expect(service.getSvg(name)).toBeTruthy();
    });
  });

  it('should return SafeHtml for every field role icon', () => {
    service.getNamesForGroup('role').forEach((name) => {
      expect(service.getSvg(name)).toBeTruthy();
    });
  });

  it('should return SafeHtml for every sort icon', () => {
    service.getNamesForGroup('sort').forEach((name) => {
      expect(service.getSvg(name)).toBeTruthy();
    });
  });

  it('should return SafeHtml for general UI icons', () => {
    service.getNamesForGroup('general').forEach((name) => {
      expect(service.getSvg(name)).toBeTruthy();
    });
  });

  it('should include all icon names across groups without loss', () => {
    const groupedCount =
      service.getNamesForGroup('artifact').length +
      service.getNamesForGroup('graph').length +
      service.getNamesForGroup('type').length +
      service.getNamesForGroup('aggregation').length +
      service.getNamesForGroup('role').length +
      service.getNamesForGroup('sort').length +
      service.getNamesForGroup('general').length;

    expect(groupedCount).toBe(service.getAllNames().length);
  });
});
