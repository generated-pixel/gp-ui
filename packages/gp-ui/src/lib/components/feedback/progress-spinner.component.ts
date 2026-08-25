import { Component, Input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'gp-progress-spinner',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div
      class="gp-progress-spinner"
      [style.width]="strokeWidth"
      [style.height]="strokeWidth"
      role="progressbar"
      aria-label="Loading"
    >
      <svg class="gp-progress-spinner-svg" viewBox="25 25 50 50">
        <circle
          class="gp-progress-spinner-circle"
          cx="50"
          cy="50"
          r="20"
          fill="none"
          stroke-width="4"
          stroke-miterlimit="10"
        />
      </svg>
    </div>
  `,
  styles: [`
    .gp-progress-spinner {
      position: relative;
      margin: 0 auto;
      width: 2.5rem;
      height: 2.5rem;
      display: inline-block;
    }
    .gp-progress-spinner-svg {
      animation: gp-rotate 2s linear infinite;
      height: 100%;
      transform-origin: center center;
      width: 100%;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
    }
    .gp-progress-spinner-circle {
      stroke-dasharray: 1, 200;
      stroke-dashoffset: 0;
      animation: gp-dash 1.5s ease-in-out infinite;
      stroke-linecap: round;
      stroke: var(--gp-primary);
    }
    @keyframes gp-rotate {
      100% { transform: rotate(360deg); }
    }
    @keyframes gp-dash {
      0% { stroke-dasharray: 1, 200; stroke-dashoffset: 0; }
      50% { stroke-dasharray: 89, 200; stroke-dashoffset: -35px; }
      100% { stroke-dasharray: 89, 200; stroke-dashoffset: -124px; }
    }
  `]
})
export class GpProgressSpinnerComponent {
  @Input() strokeWidth = '2.5rem';
}
