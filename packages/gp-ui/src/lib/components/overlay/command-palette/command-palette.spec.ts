import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpCommandPalette } from './command-palette';
import { GpCommandPaletteService } from './command-palette.service';
import { GpHotkeyService } from '../../../services/hotkey.service';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [GpCommandPalette],
  template: ' <gp-command-palette [items]="commands" [visible]="isOpen" /> '
})
class TestHostComponent {
  isOpen = false;
  commands = [
    { id: '1', title: 'Open Settings', category: 'General' },
    { id: '2', title: 'Toggle Theme', category: 'Preferences' }
  ];
}

describe('GpCommandPalette', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;
  let paletteService: GpCommandPaletteService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, GpCommandPalette],
      providers: [GpCommandPaletteService, GpHotkeyService]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    paletteService = TestBed.inject(GpCommandPaletteService);
    fixture.detectChanges();
  });

  it('should filter commands based on search query', () => {
    const palette = fixture.debugElement.children[0].componentInstance as GpCommandPalette;
    palette.searchQuery.set('Theme');
    expect(palette.filteredItems().length).toBe(1);
    expect(palette.filteredItems()[0].title).toBe('Toggle Theme');
  });
});
