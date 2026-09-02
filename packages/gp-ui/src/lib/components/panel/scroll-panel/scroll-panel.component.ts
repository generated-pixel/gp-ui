import { GpBaseComponent } from '../../../base/gp-base.component';
import { Component, input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'gp-scroll-panel',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './scroll-panel.component.html',
  styleUrl: './scroll-panel.component.scss'
})
export class GpScrollPanelComponent extends GpBaseComponent {
  public height = input<string>('15rem');
  public maxHeight = input<string>('');
}
