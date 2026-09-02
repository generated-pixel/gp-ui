import {
  Component,
  ElementRef,
  viewChild,
  effect,
  inject,
  computed,
  signal,
  input,
  model,
  output,
  ChangeDetectionStrategy,
  ViewEncapsulation
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { GpBase } from '../../../base/gp-base';
import { GpCommandItem, GpCommandGroup } from './command-palette.interface';
import { GpCommandPaletteService } from './command-palette.service';
import { GpHotkeyService } from '../../../services/hotkey.service';
import { GpIcon } from '../../../icons/icon';
import { GpBadge } from '../../feedback/badge/badge';
import { GpAppendToDirective } from '../../../overlay/append-to.directive';
import { GpAppendToTarget } from '../../../overlay/append-to.interface';

@Component({
  selector: 'gp-command-palette',
  standalone: true,
  imports: [FormsModule, GpIcon, GpBadge, GpAppendToDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './command-palette.html',
  styleUrl: './command-palette.scss'
})
export class GpCommandPalette extends GpBase {
  public appendTo = input<GpAppendToTarget>('body');
  public items = input<GpCommandItem[]>([]);
  public shortcut = input<string>('meta.k, ctrl.k');
  public placeholder = input<string>('Type a command or search...');
  public emptyMessage = input<string>('No matching commands found.');

  public visible = model<boolean>(false);
  public onSelect = output<GpCommandItem>();

  public searchInputEl = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  private commandService = inject(GpCommandPaletteService);
  private hotkeyService = inject(GpHotkeyService);
  private unregisterHotkey?: () => void;

  public internalVisible = signal(false);
  public searchQuery = signal('');
  public activeItemId = signal<string | null>(null);
  public activeParent = signal<GpCommandItem | null>(null);

  public isVisible = computed(() => {
    return this.visible() || this.internalVisible() || this.commandService.isOpen();
  });

  // Merge items passed via input with items registered in service
  public allItems = computed<GpCommandItem[]>(() => {
    const parent = this.activeParent();
    if (parent && parent.children) {
      return parent.children;
    }
    return [...this.items(), ...this.commandService.registeredCommands()];
  });

  public filteredItems = computed<GpCommandItem[]>(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const list = this.allItems();

    if (!query) {
      return list;
    }

    return list.filter((item) => {
      const matchTitle = item.title.toLowerCase().includes(query);
      const matchDesc = item.description ? item.description.toLowerCase().includes(query) : false;
      const matchKeywords = item.keywords ? item.keywords.some((k) => k.toLowerCase().includes(query)) : false;
      const matchCategory = item.category ? item.category.toLowerCase().includes(query) : false;
      return matchTitle || matchDesc || matchKeywords || matchCategory;
    });
  });

  public groupedItems = computed<GpCommandGroup[]>(() => {
    const items = this.filteredItems();
    const groupsMap = new Map<string, GpCommandItem[]>();

    items.forEach((item) => {
      const groupName = item.category || 'General';
      if (!groupsMap.has(groupName)) {
        groupsMap.set(groupName, []);
      }
      groupsMap.get(groupName)!.push(item);
    });

    const groups: GpCommandGroup[] = [];
    groupsMap.forEach((groupItems, name) => {
      groups.push({ name, items: groupItems });
    });

    return groups;
  });

  constructor() {
    super();
    effect(() => {
      if (this.isVisible()) {
        setTimeout(() => {
          this.searchInputEl()?.nativeElement?.focus();
          const first = this.filteredItems()[0];
          if (first) {
            this.activeItemId.set(first.id);
          }
        }, 50);
      } else {
        this.searchQuery.set('');
        this.activeParent.set(null);
      }
    });
  }

  override onInit(): void {
    const sc = this.shortcut();
    if (sc) {
      const combos = sc
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean);
      const unregs = combos.map((combo) => this.hotkeyService.register(combo, () => this.toggle()));
      this.unregisterHotkey = () => unregs.forEach((u) => u());
    }
  }

  override onDestroy(): void {
    if (this.unregisterHotkey) {
      this.unregisterHotkey();
    }
  }

  public open(): void {
    this.internalVisible.set(true);
    this.visible.set(true);
    this.commandService.open();
  }

  public close(): void {
    this.internalVisible.set(false);
    this.visible.set(false);
    this.commandService.close();
  }

  public toggle(): void {
    if (this.isVisible()) {
      this.close();
    } else {
      this.open();
    }
  }

  public onBackdropClick(event: MouseEvent): void {
    this.close();
  }

  public onSearchChange(val: string): void {
    this.searchQuery.set(val);
    const first = this.filteredItems()[0];
    this.activeItemId.set(first ? first.id : null);
  }

  public setActiveItem(id: string): void {
    this.activeItemId.set(id);
  }

  public selectItem(item: GpCommandItem): void {
    if (item.disabled) {
      return;
    }

    if (item.children && item.children.length > 0) {
      this.activeParent.set(item);
      this.searchQuery.set('');
      return;
    }

    if (item.action) {
      item.action();
    }

    this.onSelect.emit(item);
    this.close();
  }

  public navigateBack(): void {
    this.activeParent.set(null);
    this.searchQuery.set('');
  }

  public onKeyDown(event: KeyboardEvent): void {
    const items = this.filteredItems();
    if (items.length === 0) {
      if (event.key === 'Escape') {
        this.close();
      }
      return;
    }

    const currentIndex = items.findIndex((i) => i.id === this.activeItemId());

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
      this.activeItemId.set(items[nextIndex].id);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
      this.activeItemId.set(items[prevIndex].id);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const selected = items.find((i) => i.id === this.activeItemId()) || items[0];
      if (selected) {
        this.selectItem(selected);
      }
    } else if (event.key === 'Escape') {
      event.preventDefault();
      if (this.activeParent()) {
        this.navigateBack();
      } else {
        this.close();
      }
    } else if (event.key === 'Backspace' && !this.searchQuery() && this.activeParent()) {
      event.preventDefault();
      this.navigateBack();
    }
  }
}
