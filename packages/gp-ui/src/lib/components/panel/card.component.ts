import { Component, Input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'gp-card',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="gp-card" [class.gp-card-hoverable]="hoverable">
      @if (headerImage) {
        <div class="gp-card-header-img">
          <img [src]="headerImage" [alt]="header || 'Card image'" />
        </div>
      }

      <div class="gp-card-body">
        @if (header || subheader) {
          <div class="gp-card-title-group">
            @if (header) {
              <h3 class="gp-card-title">{{ header }}</h3>
            }
            @if (subheader) {
              <div class="gp-card-subtitle">{{ subheader }}</div>
            }
          </div>
        }

        <div class="gp-card-content">
          <ng-content />
        </div>

        <div class="gp-card-footer">
          <ng-content select="[footer]" />
        </div>
      </div>
    </div>
  `,
  styles: [`
    .gp-card {
      background: var(--gp-surface-card);
      border: 1px solid var(--gp-surface-border);
      border-radius: var(--gp-border-radius-md);
      box-shadow: var(--gp-shadow-sm);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: all var(--gp-transition-duration);
    }
    .gp-card-hoverable:hover {
      box-shadow: var(--gp-shadow-lg);
      transform: translateY(-2px);
    }
    .gp-card-header-img img {
      width: 100%;
      height: auto;
      display: block;
      object-fit: cover;
    }
    .gp-card-body {
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .gp-card-title {
      margin: 0;
      font-size: var(--gp-font-size-base);
      font-weight: 700;
      color: var(--gp-text-color);
    }
    .gp-card-subtitle {
      font-size: var(--gp-font-size-xs);
      color: var(--gp-text-color-secondary);
      margin-top: 0.2rem;
    }
    .gp-card-content {
      color: var(--gp-text-color);
      font-size: var(--gp-font-size-sm);
      line-height: 1.5;
    }
    .gp-card-footer {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: auto;
    }
  `]
})
export class GpCardComponent {
  @Input() header = '';
  @Input() subheader = '';
  @Input() headerImage = '';
  @Input() hoverable = false;
}
