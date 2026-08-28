import { GpBaseComponent } from '../../../base/gp-base.component';
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

@Component({
  selector: 'gp-panel-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './panel-menu.component.html',
  styleUrl: './panel-menu.component.scss'
})
export class GpPanelMenuComponent extends GpBaseComponent {
  public model = input<GpMenubarItem[]>([]);
  public multiple = input<boolean>(true);

  protected expandedItems = signal<Set<GpMenubarItem>>(new Set());

  public isExpanded(item: GpMenubarItem): boolean {
    return this.expandedItems().has(item);
  }

  public toggle(item: GpMenubarItem, event?: MouseEvent): void {
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
      this.toggle(item, event);
      return;
    }
    if (item.command) {
      item.command({ originalEvent: event, item });
    }
  }
}
