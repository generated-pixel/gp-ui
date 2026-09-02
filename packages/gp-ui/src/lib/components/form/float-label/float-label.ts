import { Component, input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

import { GpFloatLabelVariant } from './float-label.interface';

@Component({
  selector: 'gp-float-label, gp-floatlabel',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './float-label.html',
  styleUrl: './float-label.scss'
})
export class GpFloatLabel {
  public variant = input<GpFloatLabelVariant>('on');
  public always = input<boolean>(false);
}
