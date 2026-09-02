import { Component, input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { GpIconComponent } from '../../../icons/icon.component';
import { GpOverlayBaseComponent } from '../../../base/gp-overlay-base.component';
import { GpAppendToDirective } from '../../../overlay/append-to.directive';

export type GpDrawerPosition = 'left' | 'right' | 'top' | 'bottom';

@Component({
  selector: 'gp-drawer',
  standalone: true,
  imports: [GpIconComponent, GpAppendToDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './drawer.component.html',
  styleUrl: './drawer.component.scss'
})
export class GpDrawerComponent extends GpOverlayBaseComponent {
  public position = input<GpDrawerPosition>('left');
  public dismissable = input<boolean>(true);

  public override onMaskClick(): void {
    if (this.dismissable()) {
      this.close();
    }
  }
}
