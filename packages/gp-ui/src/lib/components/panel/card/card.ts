import { Component, input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

import { GpPanelBase } from '../../../base/gp-panel-base';

@Component({
  selector: 'gp-card',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './card.html',
  styleUrl: './card.scss'
})
export class GpCard extends GpPanelBase {
  public headerImage = input<string>('');
  public hoverable = input<boolean>(false);
}
