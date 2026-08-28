import { GpBaseComponent } from '../../../base/gp-base.component';
import {
  Component,
  Input,
  ContentChildren,
  QueryList,
  ChangeDetectionStrategy,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'gp-splitter-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './splitter.component.html',
  styleUrl: './splitter.component.scss'
})
export class GpSplitterPanelComponent extends GpBaseComponent {
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
  styles: [
    `
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
    `
  ]
})
export class GpSplitterComponent extends GpBaseComponent {
  @Input() layout: 'horizontal' | 'vertical' = 'horizontal';
}
