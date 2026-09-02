import { Component, input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

import { GpInsetLabelSize } from './inset-label.interface';

@Component({
  selector: 'gp-inset-label, [gpInsetLabel]',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './inset-label.component.html',
  styleUrl: './inset-label.component.scss'
})
export class GpInsetLabelComponent {
  public size = input<GpInsetLabelSize>('md');
  public disabled = input<boolean>(false);
}
