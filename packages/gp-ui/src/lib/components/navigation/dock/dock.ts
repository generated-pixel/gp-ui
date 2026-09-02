import { Component, input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

import { RouterModule } from '@angular/router';
import { GpIcon } from '../../../icons/icon';
import { GpTooltipDirective } from '../../../directives/tooltip.directive';
import { GpMenuItem } from '../../button/split-button/split-button';
import { GpMenuBase } from '../../../base/gp-menu-base';

export type GpDockPosition = 'bottom' | 'top' | 'left' | 'right';

@Component({
  selector: 'gp-dock',
  standalone: true,
  imports: [RouterModule, GpIcon, GpTooltipDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './dock.html',
  styleUrl: './dock.scss'
})
export class GpDock extends GpMenuBase<GpMenuItem> {
  public dockPosition = input<GpDockPosition>('bottom', { alias: 'position' });

  public onItemClick(item: GpMenuItem, event: MouseEvent): void {
    this.handleMenuItemClick(item, event);
  }
}
