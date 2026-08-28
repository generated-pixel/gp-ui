import { GpBaseComponent } from '../../../base/gp-base.component';
import { Component, Input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
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
  @Input() shape: GpSkeletonShape = 'rectangle';
  @Input() width = '100%';
  @Input() height = '1.25rem';
  @Input() borderRadius = '';
}
