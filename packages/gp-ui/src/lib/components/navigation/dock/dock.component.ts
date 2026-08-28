import { GpBaseComponent } from '../../../base/gp-base.component';
import { Component, input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GpIconComponent } from '../../../icons/icon.component';
import { GpTooltipDirective } from '../../../directives/tooltip.directive';
import { GpMenuItem } from '../../button/split-button/split-button.component';

export type GpDockPosition = 'bottom' | 'top' | 'left' | 'right';

@Component({
  selector: 'gp-dock',
  standalone: true,
  imports: [CommonModule, RouterModule, GpIconComponent, GpTooltipDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './dock.component.html',
  styleUrl: './dock.component.scss'
})
export class GpDockComponent extends GpBaseComponent {
  public model = input<GpMenuItem[]>([]);
  public position = input<GpDockPosition>('bottom');

  public onItemClick(item: GpMenuItem, event: MouseEvent): void {
    if (item.disabled) {
      return;
    }
    if (item.command) {
      item.command({ originalEvent: event, item });
    }
  }
}
