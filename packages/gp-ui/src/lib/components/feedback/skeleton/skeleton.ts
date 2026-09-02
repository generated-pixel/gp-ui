import { GpBase } from '../../../base/gp-base';
import { Component, input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

export type GpSkeletonShape = 'rectangle' | 'circle';

@Component({
  selector: 'gp-skeleton',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './skeleton.html',
  styleUrl: './skeleton.scss'
})
export class GpSkeleton extends GpBase {
  public shape = input<GpSkeletonShape>('rectangle');
  public width = input<string>('100%');
  public height = input<string>('1.25rem');
  public borderRadius = input<string>('');
}
