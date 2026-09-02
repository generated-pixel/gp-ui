import { GpBase } from '../../../base/gp-base';
import { Component, input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

import { GpIcon } from '../../../icons/icon';
import { GpBadgeSeverity } from '../badge/badge';

@Component({
  selector: 'gp-tag',
  standalone: true,
  imports: [GpIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './tag.html',
  styleUrl: './tag.scss'
})
export class GpTag extends GpBase {
  public value = input<string>('');
  public severity = input<GpBadgeSeverity>('primary');
  public icon = input<string>('');
  public rounded = input<boolean>(false);
}
