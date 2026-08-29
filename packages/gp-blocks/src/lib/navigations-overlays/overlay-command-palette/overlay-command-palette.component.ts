import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '@generatedpixel/gp-ui';

export interface GpPaletteCommandItem {
  id: string;
  icon?: string;
  label: string;
  subLabel?: string;
  shortcut?: string;
  active?: boolean;
}

@Component({
  selector: 'gp-overlay-command-palette',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  templateUrl: './overlay-command-palette.component.html',
  styleUrl: './overlay-command-palette.component.scss'
})
export class GpOverlayCommandPaletteComponent {
  public placeholder = input<string>('Search or jump to...');
  public groupLabel = input<string>('');
  public commands = input<GpPaletteCommandItem[]>([]);

  public searchQuery = signal<string>('');

  public searchChange = output<string>();
  public selectCommand = output<GpPaletteCommandItem>();
  public close = output<void>();

  public onInput(e: Event): void {
    const val = (e.target as HTMLInputElement).value;
    this.searchQuery.set(val);
    this.searchChange.emit(val);
  }
}
