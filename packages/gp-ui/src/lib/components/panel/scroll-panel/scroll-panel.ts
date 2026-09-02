import { GpBase } from '../../../base/gp-base';
import { Component, input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'gp-scroll-panel',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './scroll-panel.html',
  styleUrl: './scroll-panel.scss'
})
export class GpScrollPanel extends GpBase {
  public height = input<string>('15rem');
  public maxHeight = input<string>('');
}
