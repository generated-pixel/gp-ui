import { Component, Input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

export type GpProgressBarMode = 'determinate' | 'indeterminate';

@Component({
  selector: 'gp-progress-bar',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div
      class="gp-progressbar"
      [class.gp-progressbar-indeterminate]="mode === 'indeterminate'"
      [style.height]="height"
      role="progressbar"
      [attr.aria-valuenow]="mode === 'determinate' ? value : null"
      [attr.aria-valuemin]="0"
      [attr.aria-valuemax]="100"
    >
      @if (mode === 'determinate') {
        <div class="gp-progressbar-value" [style.width.%]="value">
          @if (showValue && value > 5) {
            <span class="gp-progressbar-label">{{ value }}%</span>
          }
        </div>
      } @else {
        <div class="gp-progressbar-indeterminate-container">
          <div class="gp-progressbar-indeterminate-value"></div>
        </div>
      }
    </div>
  `,
  styles: [`
    .gp-progressbar {
      position: relative;
      background: var(--gp-surface-hover);
      border-radius: var(--gp-border-radius-full);
      overflow: hidden;
      width: 100%;
      height: 0.75rem;
    }
    .gp-progressbar-value {
      height: 100%;
      background: var(--gp-primary);
      border-radius: var(--gp-border-radius-full);
      transition: width 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 0.4rem;
    }
    .gp-progressbar-label {
      color: #ffffff;
      font-size: 0.65rem;
      font-weight: 700;
      line-height: 1;
    }
    .gp-progressbar-indeterminate-container {
      position: relative;
      height: 100%;
      width: 100%;
    }
    .gp-progressbar-indeterminate-value {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      background: var(--gp-primary);
      animation: gp-indeterminate 1.5s infinite linear;
    }
    @keyframes gp-indeterminate {
      0% { left: -35%; right: 100%; width: 35%; }
      60% { left: 100%; right: -90%; width: 90%; }
      100% { left: 100%; right: -90%; width: 90%; }
    }
  `]
})
export class GpProgressBarComponent {
  @Input() value = 0;
  @Input() mode: GpProgressBarMode = 'determinate';
  @Input() showValue = true;
  @Input() height = '0.75rem';
}
