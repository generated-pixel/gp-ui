import { GpBaseComponent } from '../../../base/gp-base.component';
import { Component, input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GpIconComponent } from '../../../icons/icon.component';
import { GpMenubarItem } from '../menubar/menubar.component';

@Component({
  selector: 'gp-panel-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './panel-menu.component.html',
  styleUrl: './panel-menu.component.scss'
})
export class GpPanelMenuComponent extends GpBaseComponent {
  public model = input<(GpMenubarItem & { expanded?: boolean })[]>([]);

  public toggle(item: any): void {
    item.expanded = !item.expanded;
  }

  public onItemClick(item: any, event: MouseEvent): void {
    if (item.disabled) {
      return;
    }
    if (item.command) {
      item.command({ originalEvent: event, item });
    }
  }
}
