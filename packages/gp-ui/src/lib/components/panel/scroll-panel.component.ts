import { Component, Input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'gp-scroll-panel',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="gp-scrollpanel" [style.height]="height" [style.max-height]="maxHeight">
      <div class="gp-scrollpanel-wrapper">
        <div class="gp-scrollpanel-content">
          <ng-content />
        </div>
      </div>
    </div>
  `,
  styles: [`
    .gp-scrollpanel {
      position: relative;
      overflow: hidden;
      width: 100%;
      border: 1px solid var(--gp-surface-border);
      border-radius: var(--gp-border-radius);
      background: var(--gp-surface-card);
    }
    .gp-scrollpanel-wrapper {
      overflow: auto;
      width: 100%;
      height: 100%;
      scrollbar-width: thin;
      scrollbar-color: var(--gp-input-border) transparent;
    }
    .gp-scrollpanel-wrapper::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    .gp-scrollpanel-wrapper::-webkit-scrollbar-thumb {
      background: var(--gp-input-border);
      border-radius: 3px;
    }
    .gp-scrollpanel-content {
      padding: 1.25rem;
      color: var(--gp-text-color);
    }
  `]
})
export class GpScrollPanelComponent {
  @Input() height = '15rem';
  @Input() maxHeight = '';
}
