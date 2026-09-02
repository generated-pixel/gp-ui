import { Component, input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GpIconComponent } from '../../../icons/icon.component';
import { GpMenuItem } from '../../button/split-button/split-button.component';
import { GpMenuBaseComponent } from '../../../base/gp-menu-base.component';
import { GpAppendToDirective } from '../../../overlay/append-to.directive';
import { GpAppendToTarget } from '../../../overlay/append-to.interface';

@Component({
  selector: 'gp-menu',
  standalone: true,
  imports: [RouterModule, GpIconComponent, GpAppendToDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class GpMenuComponent extends GpMenuBaseComponent<GpMenuItem> {
  public appendTo = input<GpAppendToTarget>('body');

  public onItemClick(item: GpMenuItem, event: MouseEvent): void {
    this.handleMenuItemClick(item, event);
  }
}
