import { TestBed } from '@angular/core/testing';
import { GpToastService } from './toast.service';

import { firstValueFrom } from 'rxjs';

describe('GpToastService', () => {
  let service: GpToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GpToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit toast messages on success()', async () => {
    const promise = firstValueFrom(service.message$);
    service.success('Operation Done', 'Saved successfully');
    const msg = await promise;
    expect(msg.severity).toBe('success');
    expect(msg.summary).toBe('Operation Done');
    expect(msg.detail).toBe('Saved successfully');
  });
});
