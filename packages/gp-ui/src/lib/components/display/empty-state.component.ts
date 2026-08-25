import { Component, Input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '../../icons/icon.component';

@Component({
  selector: 'gp-empty-state',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="gp-emptystate">
      @if (icon) {
        <div class="gp-emptystate-icon-wrap">
          <gp-icon [name]="icon" size="2.5em" class="gp-emptystate-icon" />
        </div>
      }
      <h4 class="gp-emptystate-title">{{ title }}</h4>
      @if (message) {
        <p class="gp-emptystate-message">{{ message }}</p>
      }
      <div class="gp-emptystate-actions">
        <ng-content />
      </div>
    </div>
  `,
  styles: [`
    .gp-emptystate {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem 1.5rem;
      text-align: center;
      background: var(--gp-surface-card);
      border: 1px dashed var(--gp-surface-border);
      border-radius: var(--gp-border-radius-md);
      width: 100%;
    }
    .gp-emptystate-icon-wrap {
      width: 4rem;
      height: 4rem;
      border-radius: 50%;
      background: var(--gp-surface-section);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1rem;
    }
    .gp-emptystate-icon {
      color: var(--gp-text-color-muted);
    }
    .gp-emptystate-title {
      margin: 0 0 0.5rem 0;
      font-size: var(--gp-font-size-base);
      font-weight: 700;
      color: var(--gp-text-color);
    }
    .gp-emptystate-message {
      margin: 0 0 1.25rem 0;
      font-size: var(--gp-font-size-sm);
      color: var(--gp-text-color-secondary);
      max-width: 24rem;
    }
    .gp-emptystate-actions {
      display: flex;
      gap: 0.5rem;
    }
  `]
})
export class GpEmptyStateComponent {
  @Input() title = 'No records found';
  @Input() message = 'There is currently no data to display.';
  @Input() icon = 'search';
}
