import { Component, input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

import { GpInsetLabelSize } from './inset-label.interface';

@Component({
  selector: 'gp-inset-label, [gpInsetLabel]',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './inset-label.html',
  styleUrl: './inset-label.scss'
})
export class GpInsetLabel {
  public size = input<GpInsetLabelSize>('md');
  public disabled = input<boolean>(false);
}
