import { TestBed } from '@angular/core/testing';
import { GpToastService } from './toast.service';

describe('GpToastService', () => {
  let service: GpToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GpToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit toast messages on success()', (done) => {
    service.message$.subscribe((msg) => {
      expect(msg.severity).toBe('success');
      expect(msg.summary).toBe('Operation Done');
      expect(msg.detail).toBe('Saved successfully');
      done();
    });

    service.success('Operation Done', 'Saved successfully');
  });
});
