import { Component, input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

import { GpIcon } from '../../../icons/icon';
import { GpPanelBase } from '../../../base/gp-panel-base';

@Component({
  selector: 'gp-fieldset',
  standalone: true,
  imports: [GpIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './fieldset.html',
  styleUrl: './fieldset.scss'
})
export class GpFieldset extends GpPanelBase {
  public legend = input<string>('', { alias: 'legend' });
}
