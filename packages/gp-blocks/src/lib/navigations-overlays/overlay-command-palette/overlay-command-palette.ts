import {
  Component,
  input,
  output,
  signal,
  computed,
  TemplateRef,
  contentChild,
  ChangeDetectionStrategy,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButton, GpDialog, GpIcon, GpInputText } from '@generatedpixel/gp-ui';

export interface GpPaletteCommandItem {
  id: string;
  icon?: string;
  label: string;
  subLabel?: string;
  shortcut?: string;
  active?: boolean;
}

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'gp-overlay-command-palette',
  standalone: true,
  imports: [CommonModule, GpButton, GpDialog, GpIcon, GpInputText],
  templateUrl: './overlay-command-palette.html',
  styleUrl: './overlay-command-palette.scss'
})
export class GpOverlayCommandPalette {
  public placeholder = input<string>('Search or jump to...');
  public groupLabel = input<string>('');
  public commands = input<GpPaletteCommandItem[]>([]);

  public searchQuery = signal<string>('');
  public visible = signal<boolean>(false);
  public activeIndex = signal<number>(0);
  public filteredCommands = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    return query
      ? this.commands().filter((command) => `${command.label} ${command.subLabel || ''}`.toLowerCase().includes(query))
      : this.commands();
  });

  public searchChange = output<string>();
  public selectCommand = output<GpPaletteCommandItem>();
  public close = output<void>();

  public searchTemplate = input<TemplateRef<any> | undefined>(undefined);
  public commandTemplate = input<TemplateRef<{ $implicit: GpPaletteCommandItem }> | undefined>(undefined);
  public contentTemplate = input<TemplateRef<any> | undefined>(undefined);

  public contentSearch = contentChild<TemplateRef<any>>('search');
  public contentCommandTemplate = contentChild<TemplateRef<{ $implicit: GpPaletteCommandItem }>>('commandTemplate');
  public contentArea = contentChild<TemplateRef<any>>('content');

  public effectiveSearch = computed(() => this.searchTemplate() || this.contentSearch());

  public effectiveCommandTemplate = computed(() => this.commandTemplate() || this.contentCommandTemplate());

  public effectiveContent = computed(() => this.contentTemplate() || this.contentArea());

  public onInput(e: Event): void {
    const val = (e.target as HTMLInputElement).value;
    this.searchQuery.set(val);
    this.activeIndex.set(0);
    this.searchChange.emit(val);
  }

  public open(): void {
    this.searchQuery.set('');
    this.activeIndex.set(0);
    this.visible.set(true);
  }

  public onVisibleChange(visible: boolean): void {
    this.visible.set(visible);
    if (!visible) {
      this.close.emit();
    }
  }

  public onKeyDown(event: KeyboardEvent): void {
    const commands = this.filteredCommands();
    if (event.key === 'ArrowDown' && commands.length) {
      event.preventDefault();
      this.activeIndex.update((index) => (index + 1) % commands.length);
    } else if (event.key === 'ArrowUp' && commands.length) {
      event.preventDefault();
      this.activeIndex.update((index) => (index - 1 + commands.length) % commands.length);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const command = commands[this.activeIndex()];
      if (command) {
        this.chooseCommand(command);
      }
    }
  }

  public chooseCommand(command: GpPaletteCommandItem): void {
    this.selectCommand.emit(command);
    this.visible.set(false);
  }
}
