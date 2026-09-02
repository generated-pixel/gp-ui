import { Component, input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GpIcon } from '../../../icons/icon';
import { GpMenuItem } from '../../button/split-button/split-button';
import { GpMenuBase } from '../../../base/gp-menu-base';
import { GpAppendToDirective } from '../../../overlay/append-to.directive';
import { GpAppendToTarget } from '../../../overlay/append-to.interface';

@Component({
  selector: 'gp-menu',
  standalone: true,
  imports: [RouterModule, GpIcon, GpAppendToDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './menu.html',
  styleUrl: './menu.scss'
})
export class GpMenu extends GpMenuBase<GpMenuItem> {
  public appendTo = input<GpAppendToTarget>('body');

  public onItemClick(item: GpMenuItem, event: MouseEvent): void {
    this.handleMenuItemClick(item, event);
  }
}
