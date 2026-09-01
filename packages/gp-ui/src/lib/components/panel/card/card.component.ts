import { Component, input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

import { GpPanelBaseComponent } from '../../../base/gp-panel-base.component';

@Component({
  selector: 'gp-card',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class GpCardComponent extends GpPanelBaseComponent {
  public headerImage = input<string>('');
  public hoverable = input<boolean>(false);
}
