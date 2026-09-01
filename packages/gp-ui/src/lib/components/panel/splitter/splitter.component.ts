import { GpBaseComponent } from '../../../base/gp-base.component';
import {
  Component,
  input,
  ChangeDetectionStrategy,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'gp-splitter-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './splitter-panel.component.html',
  styleUrl: './splitter-panel.component.scss'
})
export class GpSplitterPanelComponent extends GpBaseComponent {
  public size = input<number>(50);
  public minSize = input<number>(10);
}

@Component({
  selector: 'gp-splitter',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './splitter.component.html',
  styleUrl: './splitter.component.scss'
})
export class GpSplitterComponent extends GpBaseComponent {
  public layout = input<'horizontal' | 'vertical'>('horizontal');
}
