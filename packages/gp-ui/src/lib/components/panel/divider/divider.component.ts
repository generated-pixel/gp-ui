import { GpBaseComponent } from '../../../base/gp-base.component';
import { Component, Input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

export type GpDividerLayout = 'horizontal' | 'vertical';
export type GpDividerType = 'solid' | 'dashed' | 'dotted';
export type GpDividerAlign = 'left' | 'center' | 'right' | 'top' | 'bottom';

@Component({
  selector: 'gp-divider',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './divider.component.html',
  styleUrl: './divider.component.scss'
})
export class GpDividerComponent extends GpBaseComponent {
  @Input() layout: GpDividerLayout = 'horizontal';
  @Input() type: GpDividerType = 'solid';
  @Input() align: GpDividerAlign = 'center';
}
