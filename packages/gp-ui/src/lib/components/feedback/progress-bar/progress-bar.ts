import { GpBase } from '../../../base/gp-base';
import { Component, input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

export type GpProgressBarMode = 'determinate' | 'indeterminate';

@Component({
  selector: 'gp-progress-bar',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './progress-bar.html',
  styleUrl: './progress-bar.scss'
})
export class GpProgressBar extends GpBase {
  public value = input<number>(0);
  public mode = input<GpProgressBarMode>('determinate');
  public showValue = input<boolean>(true);
  public height = input<string>('0.75rem');
}
