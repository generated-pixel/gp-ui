import { Component, Input, ContentChildren, QueryList, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'gp-splitter-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="gp-splitter-panel" [style.flex-basis.%]="size">
      <ng-content />
    </div>
  `,
  styles: [`
    .gp-splitter-panel {
      flex: 1;
      overflow: auto;
      padding: 1rem;
    }
  `]
})
export class GpSplitterPanelComponent {
  @Input() size = 50;
  @Input() minSize = 10;
}

@Component({
  selector: 'gp-splitter',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="gp-splitter" [class.gp-splitter-vertical]="layout === 'vertical'">
      <ng-content />
    </div>
  `,
  styles: [`
    .gp-splitter {
      display: flex;
      border: 1px solid var(--gp-surface-border);
      border-radius: var(--gp-border-radius);
      background: var(--gp-surface-card);
      overflow: hidden;
      width: 100%;
      height: 100%;
    }
    .gp-splitter-vertical {
      flex-direction: column;
    }
  `]
})
export class GpSplitterComponent {
  @Input() layout: 'horizontal' | 'vertical' = 'horizontal';
}
