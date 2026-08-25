import { GpBaseComponent } from '../../base/gp-base.component';
import { Component, Input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'gp-scroll-panel',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './scroll-panel.component.html',
  styleUrl: './scroll-panel.component.scss'
})
export class GpScrollPanelComponent extends GpBaseComponent {
  @Input() height = '15rem';
  @Input() maxHeight = '';
}
