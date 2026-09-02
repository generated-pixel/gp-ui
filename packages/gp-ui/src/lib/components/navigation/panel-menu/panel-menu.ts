import { Component, input, ChangeDetectionStrategy, ViewEncapsulation, signal } from '@angular/core';

import { RouterModule } from '@angular/router';
import { GpIcon } from '../../../icons/icon';
import { GpMenubarItem } from '../menubar/menubar';
import { GpMenuBase } from '../../../base/gp-menu-base';

@Component({
  selector: 'gp-panel-menu',
  standalone: true,
  imports: [RouterModule, GpIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './panel-menu.html',
  styleUrl: './panel-menu.scss'
})
export class GpPanelMenu extends GpMenuBase<GpMenubarItem> {
  public multiple = input<boolean>(true);

  protected expandedItems = signal<Set<GpMenubarItem>>(new Set());

  public isExpanded(item: GpMenubarItem): boolean {
    return this.expandedItems().has(item);
  }

  public override toggle(itemOrEvent: any, event?: Event): void {
    if (itemOrEvent && typeof itemOrEvent === 'object' && ('label' in itemOrEvent || 'items' in itemOrEvent)) {
      this.toggleItem(itemOrEvent as GpMenubarItem, event);
    } else {
      super.toggle(itemOrEvent);
    }
  }

  public toggleItem(item: GpMenubarItem, event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    if (item.disabled) {
      return;
    }

    this.expandedItems.update((current) => {
      const next = new Set(current);
      if (next.has(item)) {
        next.delete(item);
      } else {
        if (!this.multiple()) {
          next.clear();
        }
        next.add(item);
      }
      return next;
    });
  }

  public onItemClick(item: GpMenubarItem, event?: Event): void {
    if (item.disabled) {
      return;
    }
    if (item.items && item.items.length > 0) {
      this.toggleItem(item, event);
    } else if (item.command) {
      item.command({ originalEvent: event, item });
    }
  }
}
