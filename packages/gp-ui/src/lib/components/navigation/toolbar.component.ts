import { Component, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'gp-toolbar',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="gp-toolbar" role="toolbar">
      <div class="gp-toolbar-start">
        <ng-content select="[start]" />
      </div>
      <div class="gp-toolbar-center">
        <ng-content select="[center]" />
      </div>
      <div class="gp-toolbar-end">
        <ng-content select="[end]" />
      </div>
    </div>
  `,
  styles: [`
    .gp-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      padding: 0.75rem 1rem;
      background: var(--gp-surface-card);
      border: 1px solid var(--gp-surface-border);
      border-radius: var(--gp-border-radius);
      gap: 0.5rem;
    }
    .gp-toolbar-start, .gp-toolbar-center, .gp-toolbar-end {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  `]
})
export class GpToolbarComponent {}
