import { TestBed } from '@angular/core/testing';
import { GpBottomSheetService } from './bottom-sheet.service';

describe('GpBottomSheetService', () => {
  let service: GpBottomSheetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GpBottomSheetService);
  });

  it('should toggle sheet open state', () => {
    expect(service.isOpen()).toBeFalse();
    service.open();
    expect(service.isOpen()).toBeTrue();
    service.toggle();
    expect(service.isOpen()).toBeFalse();
  });
});
