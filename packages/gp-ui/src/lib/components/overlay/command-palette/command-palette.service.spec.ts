import { TestBed } from '@angular/core/testing';
import { GpCommandPaletteService } from './command-palette.service';
import { GpCommandItem } from './command-palette.interface';

describe('GpCommandPaletteService', () => {
  let service: GpCommandPaletteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GpCommandPaletteService);
  });

  it('should register and unregister command items', () => {
    const item: GpCommandItem = {
      id: 'custom-cmd',
      title: 'Custom Action',
      category: 'Tools'
    };

    service.register(item);
    expect(service.registeredCommands().length).toBe(1);
    expect(service.registeredCommands()[0].id).toBe('custom-cmd');

    service.unregister('custom-cmd');
    expect(service.registeredCommands().length).toBe(0);
  });
});
