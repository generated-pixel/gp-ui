import { Component, ChangeDetectionStrategy, ViewEncapsulation, signal, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GpIcon } from '../../../icons/icon';
import { GpMenubarItem } from '../menubar/menubar';
import { GpMenuItem } from '../../button/split-button/split-button';
import { GpMenuBase } from '../../../base/gp-menu-base';
import { GpAppendToDirective } from '../../../overlay/append-to.directive';
import { GpAppendToTarget } from '../../../overlay/append-to.interface';

@Component({
  selector: 'gp-tiered-menu',
  standalone: true,
  imports: [RouterModule, GpIcon, GpAppendToDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './tiered-menu.html',
  styleUrl: './tiered-menu.scss'
})
export class GpTieredMenu extends GpMenuBase<GpMenubarItem> {
  public appendTo = input<GpAppendToTarget>('body');
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
