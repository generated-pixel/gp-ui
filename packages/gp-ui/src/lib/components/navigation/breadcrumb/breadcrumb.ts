import { Component, input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

import { RouterModule } from '@angular/router';
import { GpIcon } from '../../../icons/icon';
import { GpMenuItem } from '../../button/split-button/split-button';
import { GpMenuBase } from '../../../base/gp-menu-base';

@Component({
  selector: 'gp-breadcrumb',
  standalone: true,
  imports: [RouterModule, GpIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './breadcrumb.html',
  styleUrl: './breadcrumb.scss'
})
export class GpBreadcrumb extends GpMenuBase<GpMenuItem> {
  public home = input<GpMenuItem | undefined>(undefined);
  public separatorIcon = input<string>('chevron-right');

  public onItemClick(item: GpMenuItem, event: MouseEvent): void {
    this.handleMenuItemClick(item, event);
  }
}
