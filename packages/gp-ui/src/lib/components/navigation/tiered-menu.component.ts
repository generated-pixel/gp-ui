import { GpBaseComponent } from '../../base/gp-base.component';
import { Component, Input, ChangeDetectionStrategy, ViewEncapsulation, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GpIconComponent } from '../../icons/icon.component';
import { GpMenubarItem } from './menubar.component';

@Component({
  selector: 'gp-tiered-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './tiered-menu.component.html',
  styleUrl: './tiered-menu.component.scss'
})
export class GpTieredMenuComponent extends GpBaseComponent {
  @Input() model: GpMenubarItem[] = [];

  protected activeItem = signal<GpMenubarItem | null>(null);

  public onItemClick(item: any, event: MouseEvent): void {
    if (item.disabled) return;
    if (item.command) {
      item.command({ originalEvent: event, item });
    }
  }
}
