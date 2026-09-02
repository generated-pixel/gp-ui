import { GpBase } from '../../../base/gp-base';
import { Component, input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

import { GpIcon } from '../../../icons/icon';

export interface GpMeterItem {
  label: string;
  value: number;
  color?: string;
  icon?: string;
}

@Component({
  selector: 'gp-meter-group',
  standalone: true,
  imports: [GpIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './meter-group.html',
  styleUrl: './meter-group.scss'
})
export class GpMeterGroup extends GpBase {
  public value = input<GpMeterItem[]>([]);
  public max = input<number>(100);
}
