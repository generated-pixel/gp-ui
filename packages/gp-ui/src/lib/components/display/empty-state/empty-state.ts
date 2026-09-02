import { GpBase } from '../../../base/gp-base';
import { Component, input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

import { GpIcon } from '../../../icons/icon';

@Component({
  selector: 'gp-empty-state',
  standalone: true,
  imports: [GpIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.scss'
})
export class GpEmptyState extends GpBase {
  public title = input<string>('No records found');
  public message = input<string>('There is currently no data to display.');
  public icon = input<string>('search');
}
