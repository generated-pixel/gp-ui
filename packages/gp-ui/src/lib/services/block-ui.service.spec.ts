import { TestBed } from '@angular/core/testing';
import { GpBlockUIService } from './block-ui.service';

describe('GpBlockUIService', () => {
  let service: GpBlockUIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GpBlockUIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(service.isGlobalBlocked()).toBe(false);
  });

  it('should block and unblock the global document viewport', () => {
    expect(service.isBlocked()).toBe(false);
    expect(service.isGlobalBlocked()).toBe(false);

    service.block();
    expect(service.isBlocked()).toBe(true);
    expect(service.isGlobalBlocked()).toBe(true);

    service.unblock();
    expect(service.isBlocked()).toBe(false);
    expect(service.isGlobalBlocked()).toBe(false);
  });

  it('should block and unblock specific named targets', () => {
    const targetA = 'ordersTable';
    const targetB = 'analyticsPanel';

    expect(service.isBlocked(targetA)).toBe(false);
    expect(service.isBlocked(targetB)).toBe(false);

    service.block(targetA, { message: 'Loading orders...' });
    expect(service.isBlocked(targetA)).toBe(true);
    expect(service.isBlocked(targetB)).toBe(false);
    expect(service.isGlobalBlocked()).toBe(false);
    expect(service.getOptions(targetA)?.message).toBe('Loading orders...');

    service.block(targetB, { blur: true });
    expect(service.isBlocked(targetA)).toBe(true);
    expect(service.isBlocked(targetB)).toBe(true);
    expect(service.getOptions(targetB)?.blur).toBe(true);

    service.unblock(targetA);
    expect(service.isBlocked(targetA)).toBe(false);
    expect(service.isBlocked(targetB)).toBe(true);

    service.unblock(targetB);
    expect(service.isBlocked(targetB)).toBe(false);
  });

  it('should support passing "document" and "body" as global target aliases', () => {
    service.block('document', { message: 'Full screen sync' });
    expect(service.isGlobalBlocked()).toBe(true);
    expect(service.isBlocked('document')).toBe(true);
    expect(service.isBlocked('body')).toBe(true);
    expect(service.getOptions('document')?.message).toBe('Full screen sync');

    service.unblock('body');
    expect(service.isGlobalBlocked()).toBe(false);
  });
});
