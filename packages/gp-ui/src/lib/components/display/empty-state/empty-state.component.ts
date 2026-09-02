import { GpBaseComponent } from '../../../base/gp-base.component';
import { Component, input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

import { GpIconComponent } from '../../../icons/icon.component';

@Component({
  selector: 'gp-empty-state',
  standalone: true,
  imports: [GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.scss'
})
export class GpEmptyStateComponent extends GpBaseComponent {
  public title = input<string>('No records found');
  public message = input<string>('There is currently no data to display.');
  public icon = input<string>('search');
}
