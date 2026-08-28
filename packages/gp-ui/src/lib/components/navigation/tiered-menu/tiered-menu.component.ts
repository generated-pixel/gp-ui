import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GpIconComponent } from '../../../icons/icon.component';
import { GpMenubarItem } from '../menubar/menubar.component';
import { GpMenuItem } from '../../button/split-button/split-button.component';
import { GpMenuBaseComponent } from '../../../base/gp-menu-base.component';

@Component({
  selector: 'gp-tiered-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './tiered-menu.component.html',
  styleUrl: './tiered-menu.component.scss'
})
export class GpTieredMenuComponent extends GpMenuBaseComponent<GpMenubarItem> {
  protected activeSubItem = signal<GpMenubarItem | null>(null);

  public onItemMouseEnter(item: GpMenubarItem): void {
    if (item.items && item.items.length > 0) {
      this.activeItem.set(item);
    } else {
      this.activeItem.set(null);
      this.activeSubItem.set(null);
    }
  }

  public onSubItemMouseEnter(sub: GpMenubarItem): void {
    if (sub.items && sub.items.length > 0) {
      this.activeSubItem.set(sub);
    } else {
      this.activeSubItem.set(null);
    }
  }

  public override hide(): void {
    super.hide();
    this.activeSubItem.set(null);
  }

  public onItemClick(item: GpMenuItem, event: MouseEvent): void {
    this.handleMenuItemClick(item as GpMenubarItem, event);
  }
}
