import {
  Component,
  input,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GpIconComponent } from '../../../icons/icon.component';
import { GpMenubarItem } from '../menubar/menubar.component';
import { GpMenuBaseComponent } from '../../../base/gp-menu-base.component';

@Component({
  selector: 'gp-panel-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './panel-menu.component.html',
  styleUrl: './panel-menu.component.scss'
})
export class GpPanelMenuComponent extends GpMenuBaseComponent<GpMenubarItem> {
  public multiple = input<boolean>(true);

  protected expandedItems = signal<Set<GpMenubarItem>>(new Set());

  public isExpanded(item: GpMenubarItem): boolean {
    return this.expandedItems().has(item);
  }

  public override toggle(itemOrEvent: any, event?: MouseEvent): void {
    if (itemOrEvent && typeof itemOrEvent === 'object' && ('label' in itemOrEvent || 'items' in itemOrEvent)) {
      this.toggleItem(itemOrEvent as GpMenubarItem, event);
    } else {
      super.toggle(itemOrEvent);
    }
  }

  public toggleItem(item: GpMenubarItem, event?: MouseEvent): void {
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

  public onItemClick(item: GpMenubarItem, event: MouseEvent): void {
    if (item.disabled) {
      return;
    }
    if (item.items && item.items.length > 0) {
      this.toggleItem(item, event);
      return;
    }
    this.handleMenuItemClick(item, event);
  }
}
