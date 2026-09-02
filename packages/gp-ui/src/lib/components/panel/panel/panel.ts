import { Component, input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

import { GpIcon } from '../../../icons/icon';
import { GpPanelBase } from '../../../base/gp-panel-base';

@Component({
  selector: 'gp-panel',
  standalone: true,
  imports: [GpIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './panel.html',
  styleUrl: './panel.scss'
})
export class GpPanel extends GpPanelBase {
  public showFooter = input<boolean>(false);
}
