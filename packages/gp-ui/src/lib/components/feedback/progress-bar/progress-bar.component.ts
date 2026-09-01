import { GpBaseComponent } from '../../../base/gp-base.component';
import { Component, input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

export type GpProgressBarMode = 'determinate' | 'indeterminate';

@Component({
  selector: 'gp-progress-bar',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.scss'
})
export class GpProgressBarComponent extends GpBaseComponent {
  public value = input<number>(0);
  public mode = input<GpProgressBarMode>('determinate');
  public showValue = input<boolean>(true);
  public height = input<string>('0.75rem');
}
