import { Component, input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

import { RouterModule } from '@angular/router';
import { GpIconComponent } from '../../../icons/icon.component';
import { GpTooltipDirective } from '../../../directives/tooltip.directive';
import { GpMenuItem } from '../../button/split-button/split-button.component';
import { GpMenuBaseComponent } from '../../../base/gp-menu-base.component';

export type GpDockPosition = 'bottom' | 'top' | 'left' | 'right';

@Component({
  selector: 'gp-dock',
  standalone: true,
  imports: [RouterModule, GpIconComponent, GpTooltipDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './dock.component.html',
  styleUrl: './dock.component.scss'
})
export class GpDockComponent extends GpMenuBaseComponent<GpMenuItem> {
  public dockPosition = input<GpDockPosition>('bottom', { alias: 'position' });

  public onItemClick(item: GpMenuItem, event: MouseEvent): void {
    this.handleMenuItemClick(item, event);
  }
}
