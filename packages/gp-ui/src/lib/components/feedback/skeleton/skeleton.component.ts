import { GpBaseComponent } from '../../../base/gp-base.component';
import { Component, input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

export type GpSkeletonShape = 'rectangle' | 'circle';

@Component({
  selector: 'gp-skeleton',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './skeleton.component.html',
  styleUrl: './skeleton.component.scss'
})
export class GpSkeletonComponent extends GpBaseComponent {
  public shape = input<GpSkeletonShape>('rectangle');
  public width = input<string>('100%');
  public height = input<string>('1.25rem');
  public borderRadius = input<string>('');
}
