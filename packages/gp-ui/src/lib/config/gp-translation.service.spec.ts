import { TestBed } from '@angular/core/testing';
import { GpTranslationService } from './gp-config.service';
import { GP_SPANISH_TRANSLATION } from './gp-translations.presets';

describe('GpTranslationService', () => {
  let service: GpTranslationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GpTranslationService);
  });

  it('should be created with English defaults', () => {
    expect(service).toBeTruthy();
    expect(service.get('accept')).toBe('Yes');
    expect(service.get('reject')).toBe('No');
  });

  it('should switch translation bundle at runtime', () => {
    service.setTranslation(GP_SPANISH_TRANSLATION);
    expect(service.get('accept')).toBe('Sí');
    expect(service.get('reject')).toBe('No');
  });
});
