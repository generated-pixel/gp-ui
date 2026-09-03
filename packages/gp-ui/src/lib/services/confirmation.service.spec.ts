import { TestBed } from '@angular/core/testing';
import { GpConfirmationService } from './confirmation.service';

import { firstValueFrom } from 'rxjs';

describe('GpConfirmationService', () => {
  let service: GpConfirmationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GpConfirmationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit confirmation on confirm()', async () => {
    const promise = firstValueFrom(service.requireConfirmation$);
    service.confirm({ message: 'Delete this item?' });
    const conf = await promise;
    expect(conf.message).toBe('Delete this item?');
  });
});
