import { Component, input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { GpIcon } from '../../../icons/icon';
import { GpOverlayBase } from '../../../base/gp-overlay-base';
import { GpAppendToDirective } from '../../../overlay/append-to.directive';

export type GpDrawerPosition = 'left' | 'right' | 'top' | 'bottom';

@Component({
  selector: 'gp-drawer',
  standalone: true,
  imports: [GpIcon, GpAppendToDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './drawer.html',
  styleUrl: './drawer.scss'
})
export class GpDrawer extends GpOverlayBase {
  public position = input<GpDrawerPosition>('left');
  public dismissable = input<boolean>(true);

  public override onMaskClick(): void {
    if (this.dismissable()) {
      this.close();
    }
  }
}
