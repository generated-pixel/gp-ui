import { Component, Input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

export type GpSkeletonShape = 'rectangle' | 'circle';

@Component({
  selector: 'gp-skeleton',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div
      class="gp-skeleton"
      [class.gp-skeleton-circle]="shape === 'circle'"
      [style.width]="width"
      [style.height]="height"
      [style.border-radius]="borderRadius || (shape === 'circle' ? '50%' : null)"
      aria-hidden="true"
    ></div>
  `,
  styles: [`
    .gp-skeleton {
      background: linear-gradient(90deg, var(--gp-surface-hover) 25%, var(--gp-surface-border) 50%, var(--gp-surface-hover) 75%);
      background-size: 200% 100%;
      animation: gp-skeleton-shimmer 1.5s infinite;
      border-radius: var(--gp-border-radius);
      height: 1.25rem;
      width: 100%;
    }
    .gp-skeleton-circle {
      border-radius: 50% !important;
    }
  `]
})
export class GpSkeletonComponent {
  @Input() shape: GpSkeletonShape = 'rectangle';
  @Input() width = '100%';
  @Input() height = '1.25rem';
  @Input() borderRadius = '';
}
