import { GpBaseComponent } from '../../../base/gp-base.component';
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
  templateUrl: './divider.component.html',
  styleUrl: './divider.component.scss'
})
export class GpDividerComponent extends GpBaseComponent {
  public layout = input<GpDividerLayout>('horizontal');
  public type = input<GpDividerType>('solid');
  public align = input<GpDividerAlign>('center');
}
