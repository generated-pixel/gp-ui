import { GpBase } from '../../../base/gp-base';
import { Component, input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

export type GpDividerLayout = 'horizontal' | 'vertical';
export type GpDividerType = 'solid' | 'dashed' | 'dotted';
export type GpDividerAlign = 'left' | 'center' | 'right' | 'top' | 'bottom';

@Component({
  selector: 'gp-divider',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './divider.html',
  styleUrl: './divider.scss'
})
export class GpDivider extends GpBase {
  public layout = input<GpDividerLayout>('horizontal');
  public type = input<GpDividerType>('solid');
  public align = input<GpDividerAlign>('center');
}
