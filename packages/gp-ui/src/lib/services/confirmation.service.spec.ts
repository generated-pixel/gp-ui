import { TestBed } from '@angular/core/testing';
import { GpConfirmationService } from './confirmation.service';

describe('GpConfirmationService', () => {
  let service: GpConfirmationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GpConfirmationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit confirmation on confirm()', (done) => {
    service.requireConfirmation$.subscribe(conf => {
      expect(conf.message).toBe('Delete this item?');
      done();
    });

    service.confirm({ message: 'Delete this item?' });
  });
});
