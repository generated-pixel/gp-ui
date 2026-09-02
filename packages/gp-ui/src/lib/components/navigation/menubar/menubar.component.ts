import { Component, ChangeDetectionStrategy, ViewEncapsulation, HostListener, signal } from '@angular/core';

import { RouterModule } from '@angular/router';
import { GpIconComponent } from '../../../icons/icon.component';
import { GpMenuItem } from '../../button/split-button/split-button.component';
import { GpMenuBaseComponent } from '../../../base/gp-menu-base.component';

export interface GpMenubarItem extends GpMenuItem {
  items?: GpMenubarItem[];
  active?: boolean;
}

@Component({
  selector: 'gp-menubar',
  standalone: true,
  imports: [RouterModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './menubar.component.html',
  styleUrl: './menubar.component.scss'
})
export class GpMenubarComponent extends GpMenuBaseComponent<GpMenubarItem> {
  public activeSubItem = signal<GpMenubarItem | null>(null);

  @HostListener('document:click', ['$event'])
  override onDocumentClick(event: MouseEvent): void {
    if (this.menuHostEl?.nativeElement && !this.menuHostEl.nativeElement.contains(event.target)) {
      this.close();
    }
  }

  @HostListener('document:keydown.escape')
  override onEscape(): void {
    this.close();
  }

  public onItemMouseEnter(item: GpMenubarItem): void {
    if (this.activeItem() !== null || (item.items && item.items.length > 0)) {
      this.activeItem.set(item);
      this.activeSubItem.set(null);
    }
  }

  public onSubItemMouseEnter(subItem: GpMenubarItem): void {
    if (subItem.items && subItem.items.length > 0) {
      this.activeSubItem.set(subItem);
    } else {
      this.activeSubItem.set(null);
    }
  }

  public onRootItemClick(item: GpMenubarItem, event: MouseEvent): void {
    if (item.disabled) {
      return;
    }
    if (item.items && item.items.length > 0) {
      event.preventDefault();
      event.stopPropagation();
      this.activeItem.set(item);
      this.activeSubItem.set(null);
    } else {
      this.onItemClick(item, event);
    }
  }

  public onItemClick(item: GpMenuItem, event: MouseEvent): void {
    this.handleMenuItemClick(item as GpMenubarItem, event);
    this.close();
  }

  public close(): void {
    this.activeItem.set(null);
    this.activeSubItem.set(null);
  }
}
