import { GpBase } from '../../../base/gp-base';
import { Component, input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'gp-splitter-panel',
  standalone: true,
  imports: [],
  templateUrl: './splitter-panel.html',
  styleUrl: './splitter-panel.scss'
})
export class GpSplitterPanel extends GpBase {
  public size = input<number>(50);
  public minSize = input<number>(10);
}

@Component({
  selector: 'gp-splitter',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './splitter.html',
  styleUrl: './splitter.scss'
})
export class GpSplitter extends GpBase {
  public layout = input<'horizontal' | 'vertical'>('horizontal');
}
