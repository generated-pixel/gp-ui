import { GpBase } from '../../../base/gp-base';
import { Component, input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'gp-progress-spinner',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './progress-spinner.html',
  styleUrl: './progress-spinner.scss'
})
export class GpProgressSpinner extends GpBase {
  public strokeWidth = input<string>('2.5rem');
  public value = input<number>(0);
}
