import { Component, Input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '../../icons/icon.component';
import { GpBadgeSeverity } from './badge.component';

@Component({
  selector: 'gp-tag',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <span
      class="gp-tag"
      [class]="'gp-tag-' + severity"
      [class.gp-tag-rounded]="rounded"
    >
      @if (icon) {
        <gp-icon [name]="icon" size="0.85em" class="gp-tag-icon" />
      }
      <span class="gp-tag-value">{{ value }}</span>
      <ng-content />
    </span>
  `,
  styles: [`
    .gp-tag {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.25rem 0.5rem;
      border-radius: var(--gp-border-radius);
      font-size: var(--gp-font-size-xs);
      font-weight: 600;
      line-height: 1;
    }
    .gp-tag-rounded {
      border-radius: var(--gp-border-radius-full);
    }
    .gp-tag-primary { background: var(--gp-primary-light); color: var(--gp-primary); }
    .gp-tag-secondary { background: var(--gp-secondary-light); color: var(--gp-secondary); }
    .gp-tag-success { background: var(--gp-success-light); color: var(--gp-success); }
    .gp-tag-info { background: var(--gp-info-light); color: var(--gp-info); }
    .gp-tag-warning { background: var(--gp-warning-light); color: var(--gp-warning); }
    .gp-tag-danger { background: var(--gp-danger-light); color: var(--gp-danger); }
    .gp-tag-contrast { background: var(--gp-contrast); color: var(--gp-contrast-text); }
  `]
})
export class GpTagComponent {
  @Input() value = '';
  @Input() severity: GpBadgeSeverity = 'primary';
  @Input() icon = '';
  @Input() rounded = false;
}
