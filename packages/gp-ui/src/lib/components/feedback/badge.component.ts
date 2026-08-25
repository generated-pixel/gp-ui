import { Component, Input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

export type GpBadgeSeverity = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'contrast';
export type GpBadgeSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'gp-badge',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <span
      class="gp-badge"
      [class]="'gp-badge-' + severity + ' gp-badge-' + size"
      [class.gp-badge-dot]="!value && value !== 0"
    >
      {{ value }}
    </span>
  `,
  styles: [`
    .gp-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      line-height: 1;
      padding: 0.25rem 0.5rem;
      border-radius: var(--gp-border-radius-full);
      font-size: var(--gp-font-size-xs);
      min-width: 1.25rem;
      height: 1.25rem;
    }
    .gp-badge-dot {
      width: 0.65rem;
      height: 0.65rem;
      min-width: 0;
      padding: 0;
    }
    .gp-badge-sm { font-size: 0.65rem; height: 1rem; min-width: 1rem; padding: 0.15rem 0.35rem; }
    .gp-badge-lg { font-size: var(--gp-font-size-sm); height: 1.75rem; min-width: 1.75rem; padding: 0.35rem 0.65rem; }

    .gp-badge-primary { background: var(--gp-primary); color: var(--gp-primary-text); }
    .gp-badge-secondary { background: var(--gp-secondary); color: var(--gp-secondary-text); }
    .gp-badge-success { background: var(--gp-success); color: var(--gp-success-text); }
    .gp-badge-info { background: var(--gp-info); color: var(--gp-info-text); }
    .gp-badge-warning { background: var(--gp-warning); color: var(--gp-warning-text); }
    .gp-badge-danger { background: var(--gp-danger); color: var(--gp-danger-text); }
    .gp-badge-contrast { background: var(--gp-contrast); color: var(--gp-contrast-text); }
  `]
})
export class GpBadgeComponent {
  @Input() value?: string | number;
  @Input() severity: GpBadgeSeverity = 'primary';
  @Input() size: GpBadgeSize = 'md';
}
