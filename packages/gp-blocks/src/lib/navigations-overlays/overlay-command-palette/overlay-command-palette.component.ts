import { Component, input, output, signal, Input, TemplateRef, ContentChild } from '@angular/core';
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

  @Input() public searchTemplate?: TemplateRef<any>;
  @Input() public commandTemplate?: TemplateRef<{ $implicit: GpPaletteCommandItem }>;
  @Input() public contentTemplate?: TemplateRef<any>;

  @ContentChild('search') public contentSearch?: TemplateRef<any>;
  @ContentChild('commandTemplate') public contentCommandTemplate?: TemplateRef<{ $implicit: GpPaletteCommandItem }>;
  @ContentChild('content') public contentArea?: TemplateRef<any>;

  public get effectiveSearch(): TemplateRef<any> | undefined {
    return this.searchTemplate || this.contentSearch;
  }

  public get effectiveCommandTemplate(): TemplateRef<{ $implicit: GpPaletteCommandItem }> | undefined {
    return this.commandTemplate || this.contentCommandTemplate;
  }

  public get effectiveContent(): TemplateRef<any> | undefined {
    return this.contentTemplate || this.contentArea;
  }

  public onInput(e: Event): void {
    const val = (e.target as HTMLInputElement).value;
    this.searchQuery.set(val);
    this.searchChange.emit(val);
  }
}
