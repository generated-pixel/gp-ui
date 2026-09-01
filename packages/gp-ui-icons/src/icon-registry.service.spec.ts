import { GpIconRegistryService } from './icon-registry.service';

describe('GpIconRegistryService', () => {
  let service: GpIconRegistryService;

  beforeEach(() => {
    service = new GpIconRegistryService();
  });

  it('should register and retrieve custom icon svg paths', () => {
    service.registerIcon('custom-star', '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>');
    const icon = service.getIcon('custom-star');
    expect(icon).toContain('polygon');
  });

  it('should return undefined for unregistered icons', () => {
    const icon = service.getIcon('non-existent-icon');
    expect(icon).toBeUndefined();
  });
});
