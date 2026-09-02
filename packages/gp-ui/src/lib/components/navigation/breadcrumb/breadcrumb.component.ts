import { Component, input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

import { RouterModule } from '@angular/router';
import { GpIconComponent } from '../../../icons/icon.component';
import { GpMenuItem } from '../../button/split-button/split-button.component';
import { GpMenuBaseComponent } from '../../../base/gp-menu-base.component';

@Component({
  selector: 'gp-breadcrumb',
  standalone: true,
  imports: [RouterModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss'
})
export class GpBreadcrumbComponent extends GpMenuBaseComponent<GpMenuItem> {
  public home = input<GpMenuItem | undefined>(undefined);
  public separatorIcon = input<string>('chevron-right');

  public onItemClick(item: GpMenuItem, event: MouseEvent): void {
    this.handleMenuItemClick(item, event);
  }
}
